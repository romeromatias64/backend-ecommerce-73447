const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        minLength: 9,
        maxLength: 50,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} no es un correo electrónico válido!`
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true
    },
    avatar: {
        type: String,
        default: "https://www.utqiagvik.us/wp-content/uploads/2022/08/pngwing.com_.png"
    },
    role: {
        type: String,
        enum: ["admin", "user", "moderator", "editor"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("User", userSchema)