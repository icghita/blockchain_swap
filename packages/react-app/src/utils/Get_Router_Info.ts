import { abis } from "@project/contracts"

export const Get_Router_Info = async (router_address, web3) => {
    const router = new web3.eth.Contract(abis.router02, router_address)

    return {
        factory: await router.methods.factory().all()
    }
}