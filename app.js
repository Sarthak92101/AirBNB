const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const { listen } = require("express/lib/application");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
  console.log("connected to DB")
}).catch(err=>{
  console.log(err);
})
async function main(){
  await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
res.send("Hii, I am Root ")
})

app.get("/testlisting",async(req,res)=>{
let Samplelisting=new Listing({
  title:"My home",
  description:"Welcome to my home",
  price:1200,
  location:"Panchkula,Haryana",
  country:"India",

});
await Samplelisting.save();
console.log("sample Saves");
res.send("successfull testing ")
});

app.listen(8080,()=>{
  console.log("Server is listeining to port 8080");
})