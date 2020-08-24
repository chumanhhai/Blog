const mongoose = require("mongoose");

mongoose.connect(process.env.DBPATH, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})