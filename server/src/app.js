const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
