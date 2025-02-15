const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mahendrafenil8:password@cluster0.eembine.mongodb.net/PlantDB').then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("No connection");
});