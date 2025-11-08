import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
    
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });

    // Socket.io configuration
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("setup", (userData) => {
        if (userData && userData._id) {
          console.log("User setup:", userData.username);
          socket.join(userData._id);
          socket.emit("connected");
        }
      });

      socket.on("join chat", (room) => {
        console.log("User joined chat:", room);
        socket.join(room);
      });

      socket.on("new message", (newMessage) => {
        const chat = newMessage.chatId;
        if (!chat || !chat.users) {
          console.log("❌ Chat.users not defined");
          return;
        }
        
        chat.users.forEach((user) => {
          if (user._id === newMessage.sender._id) return;
          io.to(user._id).emit("message recieved", newMessage);
        });
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });