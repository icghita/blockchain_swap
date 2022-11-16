import { abis } from "@project/contracts"

export const Get_Pairs_Info = async (pairs_addresses, web3) => {
    const pairs_info = []
    const pairs_ABI = abis.pair
    const token_ABI = abis.erc20.abi

    for (let i = 0; i < pairs_addresses.length; i++) {
        const pair_address = pairs_addresses[i]
        const pair = new web3.eth.Contract(pairs_ABI, pair_address)

        const token_0_address = await pair.methods.token0().call()
        const token_1_address = await pair.methods.token1().call()

        const token_0_contract = new web3.eth.Contract(token_ABI, token_0_address)
        const token_1_contract = new web3.eth.Contract(token_ABI, token_1_address)

        const token_0_name = await token_0_contract.methods.name().call()
        const token_1_name = await token_1_contract.methods.name().call()

        pairs_info.push({
            address: pair_address,
            token_0_address,
            token_1_address,
            token_0_name,
            token_1_name
        })
    }
    return pairs_info
}