const PORT = 5000; // ✅ Ensure we use the correct port

const express = require('express');
const { Server } = require("socket.io");
const gameManager = require("./gameManager");
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');

const app = express();

// ✅ Allow CORS for Frontend (React at Port 3000)
app.use(cors({
   origin: "http://localhost:3000",
   credentials: true
}));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session Configuration
app.use(session({
   secret: "secret",
   resave: false,
   saveUninitialized: true
}));

// ✅ Create HTTP Server
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
     origin: "http://localhost:3000"
   }
});

// ✅ TEST ENDPOINT: Check if API is Working
app.get("/", (req, res) => {
    res.json({ status: "Server is running!" });
});

// ✅ Authentication Endpoint
app.post('/auth', function (req, res) {
   if(req.session.isAuth === false) return res.json({status: "failed"});
   if(req.session.isAuth) {
       return res.json({status: "loggedIn", name: req.session.name});
   }
   if(req.session.try === undefined) req.session.try = 0;
   if(!req.body.username || !req.body.password) {
       return res.json({status: "login", tries: req.session.try});
   }
   if (req.body.count !== (req.session.try + 1)) return res.json({ status: "restart" });
   req.session.try++;

   const name = req.body.username;
   const password = req.body.password;
   const filePath = `./users/${name}.json`;

   if (fs.existsSync(filePath)) {
       const userJSON = JSON.parse(fs.readFileSync(filePath));
       if (password === userJSON.password) {
           req.session.isAuth = true;
           req.session.name = name;
           return res.json({status: "success"});
       } 
       else if(req.session.try === 3) {
           req.session.isAuth = false;
           return res.json({status: "failed"});
       }
       return res.json({status: "failure"});
   }
   else {
       if(req.session.try === 3) {
           req.session.isAuth = false;
           return res.json({status: "failed"});
       }
       return res.json({status: "failure"});
   }
});

// ✅ Logout Endpoint
app.post("/logout", (req, res) => {
   if(req.session.isAuth === undefined) return res.json("invalid");
   req.session.isAuth = undefined;
   req.session.try = undefined;
   res.json("success");
});

// ✅ WebSocket Logic
io.on('connection', (socket) => {
   console.log("New player connected!");
   gameManager.manager(socket);
});

// ✅ Start the Server
server.listen(PORT, () => {
    console.log(`✅ ExpressJS Server is running on port ${PORT}`);
});
