const express = require("express");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
