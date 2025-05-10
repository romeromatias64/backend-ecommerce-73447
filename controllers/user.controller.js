// Importamos nuestro modelo de usuario
const dotenv = require('dotenv').config();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = 10;
const SECRET = process.env.SECRET_JWT;

const AWS_URL = process.env.AWS_URL;

async function getUsers(req, res) {
    try {

        const users = await User.find({}).select({ password: 0, __v: 0 }).sort({ name: 1 }).collation({ locale: "es" });
        res.status(200).send({
            message: 'Se obtuvieron los usuarios',
            users: users
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
}

//? Obtener usuario por ID

async function getUserByID(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select({ password: 0, __v: 0 }); // Excluimos la contraseña y la version del usuario con .select

        if (!user) {
            return res.status(404).send({
                message: 'No se encontró el usuario'
            });
        }

        res.status(200).send({
            message: 'Se obtuvo el usuario',
            user
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error al obtener el usuario',
            error
        });
    }
}

//? Eliminar un usuario

async function deleteUserByID(req, res) {
    try {
        const id = req.params.id;

        const userDeleted = await User.findByIdAndDelete(id);

        if (!userDeleted) {
            return res.status(404).send({
                message: 'No se encontró el usuario'
            });
        }

        return res.status(200).send({
            message: `El usuario con la id: ${id}, ${userDeleted.name} fue eliminado correctamente`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar el usuario');
    }
}

async function updateUserByID(req, res) {
    try {
        const { password, ...restData } = req.body;
        const updateData = { ...restData, updatedAt: Date.now() };

        if(password) {
            updateData.password = await bcrypt.hash(password, salt);
        }


        const userUpdated = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        ).select("-password -__v");

        if (!userUpdated) {
            return res.status(404).send({
                message: 'No se puede actualizar el usuario'
            });
        }

        return res.status(200).send({
            message: `El usuario con la id: ${req.params.id} fue actualizado correctamente`,
            userUpdated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al actualizar el usuario',
            error
        });
    }
}

//? Crear un usuario

async function createUser(req, res) {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: req.file ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/users/${req.fileData.filename}` : "https://www.utqiagvik.us/wp-content/uploads/2022/08/pngwing.com_.png"
        }

        userData.password = await bcrypt.hash(userData.password, salt);
        const newUser = await new User(userData).save();

        const token = jwt.sign(newUser.toJSON(), SECRET, {
            expiresIn: '1h' // El token va a expirar en 1 hora
        })

        res.status(201).send({
            message: 'Usuario creado correctamente',
            user: newUser,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear el usuario');
    }
}

//? Funcion para logear un usuario

async function loginUser(req, res) {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!email || !password) {
            return res.status(400).send({
                message: 'Email y contraseña son necesarios'
            });
        }

        if (!user) {
            return res.status(404).send({
                message: 'No existe el usuario'
            });
        }



        const isVerified = await bcrypt.compare(password, user.password);

        if (!isVerified) {
            return res.status(401).send({
                message: 'Credenciales incorrectas'
            });
        }

        const tokenData = { ...user.toJSON(), avatar: user.avatar || "https://www.utqiagvik.us/wp-content/uploads/2022/08/pngwing.com_.png" }
        
        user.password = undefined;

        const token = jwt.sign(tokenData, SECRET, {
            expiresIn: '1h' 
        });

        return res.status(200).send({
            message: 'Usuario logueado correctamente',
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al logear el usuario',
            error
        });
    }
}

async function updateAvatar(req, res) {
    try {
        const id = req.params.id;
        const avatarURL = `${AWS_URL}/users/${req.fileData.filename}`; // Nombre del archivo subido
        const userUpdated = await User.findByIdAndUpdate(
            id,
            { avatar: avatarURL },
            { new: true }
        );
        res.status(200).send(userUpdated);
    } catch (error) {
        res.status(500).send("Error al actualizar el avatar");
    }
}

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    deleteUserByID,
    updateUserByID,
    loginUser,
    updateAvatar
};
