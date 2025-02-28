const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");
const express = require("express");
const PORT = 4000;


const app = express();
app.use(express.json());



const corsOptions = {
  origin: ["https://fin-z-app.vercel.app", "http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With","x-is-admin"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); 
});

mongoose
  .connect(
    "mongodb+srv://velu2092002:HXdXw3ULnE410Oen@cluster0.up2go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB2"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoute);



app.get("/", (req, res) => {
  res.send("Hello Guys Welcomes to Expense App!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});