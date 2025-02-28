import { MdDelete } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

const Transactions = ({ transactions, onDelete }) => {
  return (
    <div>
      <h2 className="transaction-h2">Transactions</h2>
      <div className="table">
        <div className="table-row header">
          <div className="table-cell first">Title</div>
          <div className="table-cell">Amount</div>
          <div className="table-cell">Date</div>
          <div className="table-cell last">Category</div>
        </div>

        {transactions.slice().reverse().map((transaction) => (
          <div className="table-row" key={transaction._id}>
            <div className="table-cell first">{transaction.title}</div>
            <div className="table-cell">
              <span>
                <FaCircle
                  className={`circle ${
                    transaction.type === "income"
                      ? "green-circle"
                      : "red-circle"
                  }`}
                />
              </span>
              {transaction.amount}
            </div>
            <div className="table-cell">
              {transaction.date.split("T")[0].split("-").reverse().join("-")}
            </div>
            <div className="table-cell last">{transaction.category}</div>
            <div className="delete">
              <MdDelete onClick={() => onDelete(transaction._id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
