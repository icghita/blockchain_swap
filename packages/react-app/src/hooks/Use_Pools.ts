import Web3 from "web3"
import { useState, useEffect } from "react"
import { useConfig } from "@usedapp/core"

import { ROUTER_ADDRESS } from "../config"
import { Get_Factory_Info, Get_Router_Info } from "../utils"


export const Load_Pools = async (provider_url: any) => {
    const provider = new Web3.providers.HttpProvider(provider_url)
    const web3 = new Web3(provider)

    const router_info = await Get_Router_Info(ROUTER_ADDRESS, web3)
    const factory_info = await Get_Factory_Info(router_info.factory, web3)
    
    return factory_info.pairsInfo
}

export const Use_Pools = () => {
    const { readOnlyChainId, readOnlyUrls } = useConfig()
    const [loading, Set_Loading ] = useState(true)
    const [pools, Set_Pools ] = useState({})

    useEffect(() => {
        if (typeof readOnlyUrls !== "undefined" && typeof readOnlyChainId !== "undefined") {
            Load_Pools(readOnlyUrls[readOnlyChainId])
            .then((pools) => {
                Set_Pools(pools)
                Set_Loading(false)
            })
        }
    }, [readOnlyChainId, readOnlyUrls])

    return [loading, pools]
}