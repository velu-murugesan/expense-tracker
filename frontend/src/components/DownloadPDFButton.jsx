import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import "../styles/Download.css";
const DownloadPDFButton = () => {


    const userId = localStorage.getItem("userId");
    
    console.log(userId); 

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/transactions/monthly/${userId}`);
      return response.data; // Assuming response.data contains the transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  const generatePDF = async () => {
    const transactions = await fetchTransactions();
    const doc = new jsPDF();
  
    doc.text("Monthly Transactions", 14, 10);
  
    const tableColumn = ["Date", "Category", "Amount", "Type"];
    const tableRows = [];
  
    transactions.forEach((transaction) => {
      const transactionData = [
        new Date(transaction.date).toLocaleDateString(), // Format date properly
        transaction.category,
        `INR ${transaction.amount.toFixed(2)}`, // Format amount
        transaction.type,
      ];
      tableRows.push(transactionData);
    });
  
    autoTable(doc, { // Use autoTable from the import
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save("Monthly_Transactions.pdf");
  };
  
  return (
    <button onClick={generatePDF} className="download-btn">
      Download Monthly Transactions PDF
    </button>
  );
};

export default DownloadPDFButton;
