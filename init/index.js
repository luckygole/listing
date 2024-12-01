const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = "mongodb+srv://golelaksh:bv4UORahqnNm0NzE@listings.tjxto.mongodb.net/?retryWrites=true&w=majority&appName=listings"

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// let allChat = [
//   {
//     title: "My New house",
//     description: "By the beach in goa",
//     price: 1500,
//     location: "indore",
//     country: "India",
//   },
//   {
//     title: "My hawali",
//     description: "pass the beach",
//     price: 3000,
//     location: "channai",
//     country: "India",
// },
// {
//     title: "My New house",
//     description: "you can buy",
//     price: 1100,
//     location: "mumbai",
//     country: "India",
// },
// {
//     title: "Homeee",
//     description: "Like by many",
//     price: 1500,
//     location: "jaipur",
//     country: "India",
// }
// ,
// {
//     title: "new tent house",
//     description: "with summing pool",
//     price: 1800,
//     location: "bhopal",
//     country: "India",
// },
// {
//     title: "House ghar",
//     description: "center in the city",
//     price: 1400,
//     location: "Goa",
//     country: "India",
// }
// ];
 
    //  chat.insertMany(allChat);

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, owner: "674c7d223b8729f571246bd2",
      })
    );
  await Listing.insertMany(initData.data);
  // await Listing.insertMany(allChat);

  console.log("data was initialized");
};

initDB();