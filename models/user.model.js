const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const bcrypt = require('bcryptjs');

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

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    try {
        // Solo hashear si la contraseña fue modificada (o es nueva)
        if (!this.isModified('password')) return next();

        // Generar salt y hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Actualizar updatedAt
        this.updatedAt = Date.now();
        
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", userSchema)