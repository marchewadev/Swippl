const express = require("express");
const http = require("http");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const setupSockets = require("./sockets/socket");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

const server = http.createServer(app);
setupSockets(server);

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
