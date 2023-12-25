const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AppChat", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("CONNECT succesfuly");
  } catch (error) {
    console.log("CONNECT ERROR", error);
  }
}

module.exports = { connect };
