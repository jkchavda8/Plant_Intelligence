const express = require("express");
require("./src/db/conn");

const adminApi = require("./src/routers/admin/api");
const userApi = require("./src/routers/user/api")
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/loading",async(req,res)=>{
    res.send("server is running")
 })
app.use(adminApi);
app.use(userApi);

app.listen(port, () => {
    console.log(`connection is setup at ${port}`)
});