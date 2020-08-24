const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function (value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: function (value) {
            if (value.length < 6) {
                throw new Error ("Password's length must greater than 6.");
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        validate: function (value) {
            if (value < 0 || value > 100) {
                throw new Error("Invalid age.");
            }
        }
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    }
})

schema.methods.generateToken = async function () {
    const token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
}

schema.methods.toJSON = function () {
    const handledUser = this.toObject();
    return {
        email: handledUser.email,
        name: handledUser.name,
        age: handledUser.age
    }
}

schema.methods.customUpdate = async function (reqBody) {
    for (let key in reqBody) {
        this[key] = reqBody[key];
    }
    await this.save();
}

schema.statics.findByCredentials = async function (reqBody) {
    const user = await User.findOne({ email: reqBody.email });
    const isMatch = await bcryptjs.compare(reqBody.password, user.password);
    if (!isMatch) {
        throw new Error();
    }
    return user;
}

schema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const encryptedPw = await bcryptjs.hash(this.password, 8);
        this.password = encryptedPw;
        next();
    }
})

const User = mongoose.model("User", schema);

module.exports = User;