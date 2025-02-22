const express = require("express");
require("./src/db/conn");
require('dotenv').config();
const adminApi = require("./src/routers/admin/api");
const userApi = require("./src/routers/user/api");
const itemApi  = require("./src/routers/item/api");
const orderApi = require("./src/routers/order/api");
const reviewApi = require("./src/routers/review/api");
const catalogApi = require("./src/routers/catalog/api");
const authentication=require("./src/routers/authentication/authentication");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/loading",async(req,res)=>{
    res.send("server is running")
 })
app.use(authentication,adminApi);
app.use(userApi);
app.use(authentication,itemApi);
app.use(authentication,orderApi);
app.use(authentication,reviewApi);
app.use(authentication,catalogApi);

app.listen(port, () => {
    console.log(`connection is setup at ${port}`)
});