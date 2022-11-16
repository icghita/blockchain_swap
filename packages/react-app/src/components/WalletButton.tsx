import React, { useEffect, useState } from "react"
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core"
import styles from "../styles"


const WalletButton = () => {
    const [account_address, Set_Account_Address] = useState("")
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const { ens } = useLookupAddress(account)

    useEffect(() => {
        if (ens) {
            Set_Account_Address(ens)
        } else if (account) {
            Set_Account_Address(shortenAddress(account))
        } else {
            Set_Account_Address("")
        }
    }, [account, ens, Set_Account_Address])

    return (
        <button onClick={() => {
            if (!account) {
                activateBrowserWallet()
            } else {
                deactivate()
            }
        }}
        className={styles.walletButton}>
            {account_address || "Connect Wallet" }
        </button>
    )
}

export default WalletButton