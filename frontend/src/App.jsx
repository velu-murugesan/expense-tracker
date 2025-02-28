import { ReactDOM } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { proxy } from "../utils/proxy";

import Home from "./pages/Home.jsx";
import NewEntry from "./pages/NewEntry.jsx";
import Month from "./pages/Month.jsx";
import Login from "./pages/Login.jsx";
import Category from "./pages/Category.jsx";
import SignUp from "./pages/Signup.jsx";
import "./App.css";
import Settings from "./pages/Settings.jsx";
function App() {
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const [transactions, setTransactions] = useState([]);



  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${proxy}/api/transactions/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setTransactions(data); // Update state with latest transactions
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

 
  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchTransactions();
    try {
      fetch(`${proxy}/api/transactions/${userId}`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setTransactions(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home transactions={transactions} handleUpdate={fetchTransactions}/>} />
          {/* <Route path="/year" element={<Year />} />
          <Route path="/daily" element={<Daily />} /> */}
          <Route
            path="/month"
            element={<Month transactions={transactions} />}
          />
          <Route path="/new-entry" element={<NewEntry userId={userId} handleUpdate={fetchTransactions}/>} />
          {/* <Route path="/week" element={<Week />} /> */}
          <Route path="/" element={<SignUp />} />
          <Route
            path="/category"
            element={<Category transactions={transactions} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings userId={userId} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
