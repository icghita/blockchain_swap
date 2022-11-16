import {abis} from "@project/contracts"
import { Get_Pairs_Info } from "./Get_Pairs_Info"

export const Get_Factory_Info = async (factory_address: any, web3: any) => {
    const factory = new web3.eth.Contract(abis.factory, factory_address)
    const factory_info = {
        fee: await factory.methods.feeTo().call(),
        feeToSetter: await factory.methods.feeToSetter().call(),
        allPairsLength: await factory.methods.allPairsLength().call(),
        allPairs: [],
        pairsInfo: {}
    }
    for (let i = 0; i < factory_info.allPairsLength; i++) {
        factory_info.allPairs[i] = await factory.methods.allPairs(i).call()
    }
    factory_info.pairsInfo = await Get_Pairs_Info(factory_info.allPairs, web3)

    return factory_info
}