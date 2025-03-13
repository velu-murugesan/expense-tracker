import React, { useState } from "react";
import Navbar2 from "../components/Navbar2.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/NewEntry.css";
import { proxy } from "../../utils/proxy";
import SalaryInput from "./SalaryInput.jsx";

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

  // Define Salary Range (Customize as needed)
  const minSalary = 5000;  // Minimum salary allowed
  const maxSalary = 100000; // Maximum salary allowed

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

    // Enforce salary limits only if 'income' is selected
    if (id === "amount" && formData.type === "income") {
      const salary = Number(value);
      if (salary < minSalary || salary > maxSalary) {
        setText(`Salary must be between ${minSalary} and ${maxSalary}`);
      } else {
        setText(""); // Clear error if within range
      }
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, type: e.target.value });

    // Reset error message when switching between income and expense
    setText("");
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are present
    if (!formData.amount || !formData.date || !formData.type) {
      setText("Error: Please fill all required fields");
      return;
    }

    // Validate salary range for income
    if (formData.type === "income") {
      const salary = Number(formData.amount);
      if (salary < minSalary || salary > maxSalary) {
        setText(`Salary must be between ${minSalary} and ${maxSalary}`);
        return;
      }
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
      }
    } catch (error) {
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
        <SalaryInput userId={userId} />
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
                    <input
                      type="number"
                      id="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min={formData.type === "income" ? minSalary : undefined}
                      max={formData.type === "income" ? maxSalary : undefined}
                    />
                    {formData.type === "income" && (
                      <small>Allowed range: {minSalary} - {maxSalary}</small>
                    )}
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
