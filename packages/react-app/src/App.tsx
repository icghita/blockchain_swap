import React from "react"
import { useEthers } from "@usedapp/core"

import { uniswapLogo } from "./assets"
import { Loader, Exchange, WalletButton } from "./components"
import styles from "./styles"
import { Use_Pools } from "./hooks"
 

const App = () => {
    const { account } = useEthers()
    const [loading, pools] = Use_Pools()

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <header className={styles.header}>
                    <img src={uniswapLogo}
                    alt="uniswap logo"
                    className="w-16 h-16 object-contain" />
                    <WalletButton />
                </header>
                <div className={styles.exchangeContainer}>
                    <h1 className={styles.headTitle}>UniSwap 2.0</h1>
                    <p className={styles.subTitle}>Exchange Tokens in Seconds</p>
                    <div className={styles.exchangeBoxWrapper}>
                        <div className={styles.exchangeBox}>
                            <div className="pink_gradient" />
                            <div className={styles.exchange}>
                                <div className="text-white">
                                    {account ? (
                                        loading ? (
                                            <Loader title="Loading pools ..." />
                                        ) : <Exchange pools={Use_Pools} />
                                        ) : <Loader title="Please connect your wallet" />
                                    }
                                </div>
                            </div>
                            <div className="pink_gradient" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App