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
        // 1. Preparar datos de actualización
        let updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        // 2. Manejar nueva imagen de avatar
        if (req.fileData?.filename) {
            updateData.avatar = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/users/${req.fileData.filename}`;
        }

        // 3. Hashear nueva contraseña si existe
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        // 4. Actualizar el usuario en la base de datos
        const userUpdated = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { 
                new: true,
                runValidators: true // Validar los nuevos datos contra el schema
            }
        ).select("-password -__v");

        // 5. Manejar caso de usuario no encontrado
        if (!userUpdated) {
            return res.status(404).send({
                message: 'No se puede actualizar el usuario'
            });
        }

        // 6. Preparar respuesta
        const responseData = {
            _id: userUpdated._id,
            name: userUpdated.name,
            email: userUpdated.email,
            role: userUpdated.role,
            avatar: userUpdated.avatar,
            createdAt: userUpdated.createdAt,
            updatedAt: userUpdated.updatedAt
        };

        // 7. Enviar respuesta
        return res.status(200).send({
            message: `Usuario ${userUpdated.name} actualizado correctamente`,
            user: responseData
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                message: 'Error de validación',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        return res.status(500).send({
            message: 'Error interno al actualizar el usuario',
            error: error.message
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
