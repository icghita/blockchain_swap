import React, { useEffect, useRef, useState } from "react"

import { chevronDown } from "../assets"
import styles from "../styles"
import { useOnClickOutside } from "../utils"


const AmountIn = ({ value, onChange, currencyValue, onSelect, currencies, isSwapping }) => {
    const [show_list, Set_Show_List] = useState(false)
    const [active_currency, Set_Active_Currency] = useState("Select")
    const ref = useRef()

    useOnClickOutside(ref, () => Set_Show_List(false))

    useEffect(() => {
        if (Object.keys(currencies).includes(currencyValue)) {
            Set_Active_Currency(currencies[currencyValue])
        } else {
            Set_Active_Currency("Select")
        }
    }, [currencies, currencyValue])

    return (
        <div className={styles.amountContainer}>
            <input placeholder="0.0"
                type="number"
                value={value}
                disabled={isSwapping}
                onChange={(e) => typeof onChange === "function" && onChange(e.target.value)}
                className={styles.amountInput} />
            <div className="relative" onClick={() => {
                Set_Show_List((prev_state) => !prev_state)
            }}>
                <button className={styles.currencyButton}>
                    {active_currency}
                    <img src={chevronDown}
                        alt="chevron down"
                        className={`w-4 h-4 object-contain ml-2 ${show_list ? "rotate-180" : "rotate-0"}`} />
                </button>
                {show_list && (
                    <ul ref={ref} className={styles.currencyList}>
                        {Object.entries(currencies).map(([token, token_name], index) => (
                            <li key={index}
                                className={`${styles.currencyListItem} ${active_currency === token_name ? "bg-site-dim2" : ""} cursor-pointer`}
                                onClick={() => {
                                    if (typeof onSelect === "function")
                                        onSelect(token)
                                    Set_Active_Currency(token_name)
                                    Set_Show_List(false)
                                }} >
                                {token_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AmountIn