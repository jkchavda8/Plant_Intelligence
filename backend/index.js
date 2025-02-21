const express = require("express");
require("./src/db/conn");

const adminApi = require("./src/routers/admin/api");
const userApi = require("./src/routers/user/api");
const itemApi  = require("./src/routers/item/api");
const orderApi = require("./src/routers/order/api");
const reviewApi = require("./src/routers/review/api");
const catalogApi = require("./src/routers/catalog/api");

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
app.use(itemApi);
app.use(orderApi);
app.use(reviewApi);
app.use(catalogApi);

app.listen(port, () => {
    console.log(`connection is setup at ${port}`)
});