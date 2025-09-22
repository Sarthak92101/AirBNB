const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { listen } = require("express/lib/application");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyncr.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("connected to DB")
}).catch(err => {
  console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) => {
  res.send("Hii, I am Root ")
})

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings })
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new")
})

//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing })
}));

//Create Route
app.post("/listings", wrapAsync(async (req, res, next) => {
  if(!req.body.listings){
    throw new ExpressError(400,"Send valid data for listing")
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect(`/listings/${newListing._id}`)
})
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing })
}))

//Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if(!req.body.listings){
    throw new ExpressError(400,"Send valid data for listing")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
  res.redirect("/listings");
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings")
}));



// app.get("/testlisting",async(req,res)=>{
// let Samplelisting=new Listing({
//   title:"My home",
//   description:"Welcome to my home",
//   price:1200,
//   location:"Panchkula,Haryana",
//   country:"India",

// });
// await Samplelisting.save();
// console.log("sample Saves");
// res.send("successfull testing ")
// });

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found!"))
// })

app.use((err, req, res, next) => {
  let {statusCode=500,message="Something went wrong"} =  err;
  res.status(statusCode).send(message);
})

app.listen(8080, () => {
  console.log("Server is listeining to port 8080");
})