import { useState, useEffect } from "react";
import {getAuthData} from "../../common/AuthService.jsx";
import "./styles/UserProfile.css";

const host = import.meta.env.VITE_DJANGO_HOST;

const UserProfile = () => {
  const [username, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);


  const setUserData = (data) => {
    console.log("Username: ", data[0].username);
    console.log("Transactions: ", data[0].transactions.slice(0, 5));

    setUserName(data[0].username);
    setTransactions(data[0].transactions.slice(0, 5));
  }

  useEffect(() => {
    const token = getAuthData();
    if (!token) return
    console.log("aunthenticated");
    fetch(`${host}users/`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token
        },
        credentials: "include",
    })            
    .then((response) =>{
      if (!response.ok) {
          return response.json().then(data => {
          throw new Error(data.error || "Error get user data from database");
          });
      }
      return response.json();
      })
    .then(setUserData)
    .catch((error) => {
      console.error("Error get user data from database:", error);
    });
  }, [])
  

  return (
    <div className="user-profile-container">
      <h2>👤 {username}</h2>
      <h3>Останні транзакції</h3>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Сума</th>
            <th>З валюти</th>
            <th>У валюту</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.amount}</td>
              <td>{tx.from_currency}</td>
              <td>{tx.to_currency}</td>
              <td>{new Date(tx.timestamp).toLocaleString('uk-UA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;