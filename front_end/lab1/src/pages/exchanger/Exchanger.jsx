import { useState, useEffect } from "react";
import {getAuthData} from "../../common/AuthService.jsx";
import "./styles/Exchanger.css";

export default function Exchanger() {
    const [buttons, setButtons] = useState([]);
    const [fromCurrency, setFromCurrency] = useState(null);
    const [toCurrency, setToCurrency] = useState(null);
    const [amount, setAmount] = useState("");
    const [convertedAmount, setConvertedAmount] = useState(null);

    const api_hub_key = import.meta.env.VITE_EXCHANGER_API_HUB_KEY
    const host = import.meta.env.VITE_DJANGO_HOST;

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("x-app-version", "1.0.0");
        myHeaders.append("x-apihub-key", api_hub_key);
        myHeaders.append("x-apihub-host", "Currency-Converter.allthingsdev.co");
        myHeaders.append("x-apihub-endpoint", "f7a950b7-e795-4241-b4ab-1c646fcabadc");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://Currency-Converter.proxy-production.allthingsdev.co/api/v1/currency/list", requestOptions)
            .then((response) => response.json())
            .then(processCurrencies)
            .catch((error) => console.error("Loading error:", error));
    }, []);


    const processCurrencies = (data) => {
        console.log(data);
        const currencies = data.data.result;
        const currenciesList = Object.entries(currencies).map(([currencyCode, currency]) => ({
            id: currencyCode,
            name: currency.name,
            symbol: currency.symbol,
        }));
        setButtons(currenciesList);
    };

    const withdrawСonvertedСurrency = (data) => {
        setConvertedAmount(data.data.result);
        const token = getAuthData();
        if (!token) return
        console.log("aunthenticated");
        fetch(`${host}users/add_transaction/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token
            },
            credentials: "include",
            body: JSON.stringify(
                { 
                "amount": amount, 
                "from_currency": fromCurrency.name,
                "to_currency": toCurrency.name
                }
            ),
            })
            .then((response) =>{
                if (!response.ok) {
                    return response.json().then(data => {
                    throw new Error(data.error || "Error set data in database");
                    });
                }
                return response.json();
                }
            )
            .then(() => {})
            .catch((error) => {
            console.error("Error set data in database:", error);
        });
    }    

    const setConvertData = () => {
        if (!fromCurrency || !toCurrency || !amount) return;

        const myHeaders = new Headers();
        myHeaders.append("x-app-version", "1.0.0");
        myHeaders.append("x-apihub-key", api_hub_key);
        myHeaders.append("x-apihub-host", "Currency-Converter.allthingsdev.co");
        myHeaders.append("x-apihub-endpoint", "a0a275dc-a8ba-4d34-bb29-2787556829d2");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "from": fromCurrency.id,
            "to": toCurrency.id,
            "amount": amount
         });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://Currency-Converter.proxy-production.allthingsdev.co/api/v1/currency/conversion", requestOptions)
            .then((response) => response.json())
            .then(withdrawСonvertedСurrency)
            .catch((error) => console.error("Loading error:", error));
    };

    return (
        <main className="container">
            <div className="exchange-box">
                <h2>Exchange</h2>
                {fromCurrency && toCurrency && (
                    <>
                        <p>{fromCurrency.name} → {toCurrency.name}</p>
                        <input 
                            type="text"
                            value={amount}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9.]/g, "");
                                const dotCount = (value.match(/\./g) || []).length;
                                if (dotCount > 1) value = value.slice(0, -1);
                                setAmount(value);
                            }}
                            placeholder="Enter amount"
                            inputMode="decimal"
                        />
                        <button className="convert-btn" onClick={setConvertData} disabled={!amount}>Convert</button>
                        {convertedAmount !== null && <p>Converted amount: {convertedAmount}</p>}
                    </>
                )}
            </div>
    
            <div className="currency-wrapper">
                <div className="currency-list">
                    <h2>From:</h2>
                    {buttons.map((button_data) => (
                        <button 
                            key={`${button_data.id}-from`} 
                            className={`button ${fromCurrency && fromCurrency.id === button_data.id ? "active" : ""}`} 
                            onClick={() => setFromCurrency(button_data)}
                        >
                            {`${button_data.name} (${button_data.symbol})`}
                        </button>
                    ))}
                </div>
    
                <div className="currency-list">
                    <h2>To:</h2>
                    {buttons.map((button_data) => (
                        <button 
                            key={`${button_data.id}-to`} 
                            className={`button ${toCurrency && toCurrency.id === button_data.id ? "active" : ""}`} 
                            onClick={() => setToCurrency(button_data)}
                        >
                            {`${button_data.name} (${button_data.symbol})`}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
