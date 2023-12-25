const express = require("express");
const cors = require("cors");
const db = require("./config/db/index");
const exphbs = require("express-handlebars");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRouter);

db.connect();

app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

const server = app.listen(process.env.PORT, () => {
  console.log(`lawngs nghe coongr  PORT: ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    Credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
