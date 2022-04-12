const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
const osu = require('node-os-utils');
const cpu = osu.cpu;
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});

app.use(express.static(path.resolve(__dirname, "./cpumonitor/build")));

app.use(express.static(path.join(__dirname, 'cpumonitor')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'cpumonitor', 'index.html'));
});

let interval;
let usage;


app.use(index);
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  getApiAndEmit(socket)
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
let data = {}
const getApiAndEmit = socket => {
	let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    cpu.usage()
	  .then(cpuPercentage => {
		  data = {
			"usage": cpuPercentage,
			"timestamp": time
		} 
	})
  const response = data;
  socket.emit("FromAPI", response);
};