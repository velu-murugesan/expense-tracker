import { useState, useEffect } from "react";
import axios from "axios";

const SalaryInput = ({ userId }) => {
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return; // ✅ Prevents unnecessary API calls if userId is missing

    axios
      .get(`http://localhost:4000/api/salaries/check-salary/${userId}`)
      .then((response) => {
        setAlreadyAdded(response.data.alreadyAdded);
      })
      .catch((error) => {
        console.error("Error fetching salary status:", error);
        setError("Failed to fetch salary status.");
      });
  }, [userId]);

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    setSalary(value);

    if (value < 20000 || value > 400000) {
      setError("Salary must be between 20,000 and 400,000.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyAdded) {
      setError("Salary has already been added for this month.");
      return;
    }

    if (!salary || isNaN(salary) || salary < 20000 || salary > 400000) {
      setError("Please enter a valid salary amount.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:4000/api/salaries/add-salary", {
        userId,
        amount: Number(salary), // ✅ Ensuring salary is a number
      });

      setAlreadyAdded(true);
      setError("");
      alert("Salary added successfully!");
    } catch (error) {
      console.error("Error adding salary:", error);
      setError(error.response?.data?.message || "Error adding salary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700">Salary</label>
      <input
        type="number"
        value={salary}
        onChange={handleSalaryChange}
        className="w-full p-2 border rounded-md"
        placeholder="Enter salary"
        required
        disabled={alreadyAdded || loading} // ✅ Disabling if already added or loading
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <button
        onClick={handleSubmit}
        className={`mt-2 px-4 py-2 rounded ${
          alreadyAdded || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
        disabled={alreadyAdded || loading} // ✅ Disabling if already added or loading
      >
        {alreadyAdded ? "Salary Already Added" : loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default SalaryInput;
