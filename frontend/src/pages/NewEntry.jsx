import React, { useState } from "react";
import Navbar2 from "../components/Navbar2.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/NewEntry.css";
import { proxy } from "../../utils/proxy";

const NewEntry = ({ userId, handleUpdate }) => {
  console.log("UserId in NewEntry:", userId);

  const [selectedNumber, setSelectedNumber] = useState(1);
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "income",
    category: "",
    amount: "",
  });
  const [receipt, setReceipt] = useState(null);

  const expenseCategories = [
    "Education", "Food", "Transportation", "Entertainment", "Clothing",
    "Tuition Fees", "Hospital", "Rent", "Bills", "Miscellaneous",
  ];
  const incomeCategories = [
    "Pocket Money", "Salary", "Freelancing", "Investment", "Gift",
    "Scholarships", "Internship/Stipend", "Part-time", "Others",
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Debugging: Log formData before sending
    console.log("Form Data before sending:", formData);
  
    // Ensure all required fields are present
    if (!formData.amount || !formData.date || !formData.type) {
      console.error("Error: Missing required fields");
      setText("Error: Please fill all required fields");
      return;
    }
  
    try {
      const response = await fetch(`${proxy}/api/transactions/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setText("Transaction added successfully");
        console.log("Transaction added successfully");
  
        // Call function to refresh transactions
        handleUpdate();
  
        // Reset form fields
        setFormData({
          title: "",
          description: "",
          date: "",  
          type: "income", // Default value
          category: "other",
          amount: "",
        });
      } else {
        setText(data.message || "Transaction add failed");
        console.log("Transaction add failed:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      setText("Error: Failed to connect to server");
    }
  };
  
  

  return (
    <div className="container-1">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <Navbar2 n1="New-Entry" onSelected={setSelectedNumber} className="navbar-settings" />
        <div className="new-entry-form">
          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="form-2">
              <div className="our-form">
                <div className="left-form">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={formData.title} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" rows="4" value={formData.description} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" id="date" value={formData.date} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="right-form">
                  <div className="radio-main">
                    <div className="form-group radio">
                      <label>
                        <input type="radio" name="type" value="income" checked={formData.type === "income"} onChange={handleRadioChange} />
                        Income
                      </label>
                    </div>
                    <div className="form-group radio">
                      <label>
                        <input type="radio" name="type" value="expense" checked={formData.type === "expense"} onChange={handleRadioChange} />
                        Expense
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" value={formData.category} onChange={handleCategoryChange}>
                      {(formData.type === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" value={formData.amount} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="receipt">Attach Receipt</label>
                    <input type="file" id="receipt" accept="image/*, application/pdf" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="submit">Submit</button>
              </div>
              <p className="failed-text">{text}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
