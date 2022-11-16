import React, { useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { abis } from "abis_link"
import { ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core"
import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"

import { ROUTER_ADDRESS } from "../config"
import styles from "../styles"
import { AmountIn, AmountOut, Balance } from "./"
import { getAvailableTokens, getCounterpartTokens, findPoolByTokens, isOperationPending, getFailureMessage, getSuccessMessage } from "../utils"


const Exchange = ({ pools }: { pools: any }) => {

    const { account } = useEthers()
    const [from_value, Set_From_Value] = useState("0")
    const [from_token, Set_From_Token] = useState(pools[0].token_0_address)
    const [to_token, Set_To_Token] = useState("")
    const [reset_state, Set_Reset_State] = useState(false)

    const from_value_big_number = parseUnits(from_value)
    const availableTokens = getAvailableTokens(pools)
    const counterpartTokens = getCounterpartTokens(pools, from_token)
    const pair_address = findPoolByTokens(pools, from_token, to_token)?.address ?? ""

    const router_contract = new Contract(ROUTER_ADDRESS, abis.router02)
    const from_token_contract = new Contract(from_token, ERC20.abi)
    const from_token_balance = useTokenBalance(from_token, account)
    const to_token_balance = useTokenBalance(to_token, account)
    const token_allowance = useTokenAllowance(from_token, account, ROUTER_ADDRESS) || parseUnits("0")
    const approve_needed = from_value_big_number.gt(token_allowance)
    const from_value_is_gt_0 = from_value_big_number.gt(parseUnits("0"))
    const has_enough_balance = from_value_big_number.lte(from_token_balance ?? parseUnits("0"))

    const { state: swap_approve_state, send: Swap_Approve_Send } = useContractFunction(from_token_contract, "approve", {
        transactionName: "onApproveRequested",
        gasLimitBufferPercentage: 10
    })
    const { state: swap_execute_state, send: Swap_Execute_Send } = useContractFunction(router_contract, "swapExactTokensForTokens", {
        transactionName: "onApproveRequested",
        gasLimitBufferPercentage: 10
    })

    const is_approving = isOperationPending(swap_approve_state)
    const is_swapping = isOperationPending(swap_execute_state)
    const can_approve = !is_approving && approve_needed
    const can_swap = !approve_needed && !is_swapping && from_value_is_gt_0 && has_enough_balance

    const success_message = getSuccessMessage(swap_approve_state, swap_execute_state)
    const failure_message = getFailureMessage(swap_approve_state, swap_execute_state)

    const On_Approve_Requested = () => {
        Swap_Approve_Send(ROUTER_ADDRESS, pools, ethers.constants.MaxUint256)
    }

    const On_Swap_Requested = () => {
        Swap_Execute_Send(
            from_value_big_number,
            0,
            [from_token, to_token],
            account,
            Math.floor(Date.now() / 1000) + 60 * 2
        ).then(() => {
            Set_From_Value("0")
        })
    }

    const On_From_Value_Change = (value: string) => {
        const trimmed_value = value.trim()
        try {
            if (trimmed_value) {
                parseUnits(value)
                Set_From_Value(value)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const On_From_Token_Change = (value) => {
        Set_From_Token(value)
    }

    const On_To_Token_Change = (value) => {
        Set_To_Token(value)
    }

    useEffect(() => {
        if (failure_message || success_message) {
            setTimeout(() => {
                Set_Reset_State(true)
                Set_From_Value("0")
                Set_To_Token("")
            }, 5000)
        }
    }, [failure_message, success_message])

    return (
        <div className="flex flex-col w-full items-center">
            <div className="mb-8">
                <AmountIn value={from_value}
                    onChange={On_From_Value_Change}
                    currencyValue={from_token}
                    onSelect={On_From_Token_Change}
                    currencies={availableTokens}
                    isSwapping={is_swapping && has_enough_balance} />
                <Balance tokenBalance={from_token_balance} />
            </div>
            <div className="mb-8 w-[100%]">
                <AmountOut
                    fromToken={from_token}
                    toToken={to_token}
                    amountIn={from_value_big_number}
                    pairContract={pair_address}
                    currencyValue={to_token}
                    onSelect={On_To_Token_Change}
                    currencies={counterpartTokens} />
                <Balance />
            </div>
            {approve_needed && !is_swapping ? (
                <button disabled={!can_approve}
                    onClick={On_Approve_Requested}
                    className={
                        `${can_approve
                            ? "bg-site-pink text-white"
                            : "bg-site-dim2 text-site-dim2"}
                        ${styles.actionButton}
                        }`
                    }>
                    {is_approving ? "Approving..." : "Approve"}
                </button>
            ) : (
                <button disabled={!can_swap}
                    onClick={On_Swap_Requested}
                    className={
                        `${can_approve
                            ? "bg-site-pink text-white"
                            : "bg-site-dim2 text-site-dim2"}
                        ${styles.actionButton}
                        }`
                    }>
                    {is_swapping ? "Swapping..." :
                        has_enough_balance ? "Swap" : "Insufficient Balance"}
                </button>
            )}

            {failure_message && !reset_state ? (
                <p className={styles.message}>{failure_message}</p>
            ) : success_message ? (
                <p className={styles.message}>{success_message}</p>
            ) : ""}

        </div>
    )
}

export default Exchange