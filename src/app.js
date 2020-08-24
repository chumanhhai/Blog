const express = require("express");
require("./models/startDB");
const userRouter = require("./routers/user");
const blogRouter = require("./routers/blog");
const cors = require("cors");
const path = require("path");

const app = express();

const publicPath = path.join(__dirname, "../public")

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(blogRouter);
app.use(express.static(publicPath));
app.get("/*", (req, res) => {
    res.sendFile(publicPath + "/index.html");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`);
})