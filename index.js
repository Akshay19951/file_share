const express = require("express");
const connectDb = require("./config/db");
const app = express();
const port = 3000;


connectDb();
app.use(express.json());

//Routes
app.use("/api/files", require("./route/file"))
app.use("/files", require("./route/show"))
app.use("/files/download", require("./route/download"));
app.use("/api/files", require("./route/file"))

app.listen(`${port}`, ()=>{
    console.log(`Server connected to ${port}`)
})