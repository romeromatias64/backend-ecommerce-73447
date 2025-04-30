// Importamos nuestro modelo de usuario
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = 10;
const SECRET = 'F0xTro7_99';

async function getUsers(req, res) {
    try {

        const users = await User.find({}).select({ password: 0, __v: 0 }).sort({name: 1}).collation({locale:"es"});
        res.status(200).send(users);

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

        console.log(user);

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
        const id = req.params.id;
        const user = req.body;

        data.password = undefined; // Para no actualizar la contraseña

        data.updatedAt = Date.now(); // Actualizamos la fecha de actualización

        const userUpdated = await User.findByIdAndUpdate(id, user, { new: true }); // new: true para que devuelva el usuario actualizado

        if (!userUpdated) {
            return res.status(404).send({
                message: 'No se puede actualizar el usuario'
            });
        }

        return res.status(200).send({
            message: `El usuario con la id: ${id}, fue actualizado correctamente`,
            user: userUpdated
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
        const user = new User(req.body);

        user.password = await bcrypt.hash(user.password, salt); // Encriptar la contraseña con bcrypt

        const newUser = await user.save();

        // // Encriptar la contraseña
        // newUser.password = undefined // Para no enviar la contraseña en la respuesta

        res.status(201).send({
            message: 'Usuario creado correctamente',
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear el usuario');
    }
}

//? Funcion para logear un usuario

async function loginUser(req, res) {
    try {
        // 1. Vamos a recibir desde la aplicacion un email y un password
        const { email, password } = req.body;
        // a. Si no llega email o password, retornamos error 400
        if (!email || !password) {
            return res.status(400).send({
                message: 'Email y contraseña son necesarios'
            });
        }

        // 2. Vamos a buscar en nuestra DB si tenemos un usuario con dicho email
        const user = await User.findOne({ email });

        // a. No existe el usuario
        if (!user) {
            return res.status(404).send({
                message: 'No existe el usuario'
            });
        }
        // b. Existe y pasamos al punto 3

        // 3. Vamos a comparar la contraseña que nos llega con la que tenemos en nuestra DB
        const isVerified = await bcrypt.compare(password, user.password);
        // a. Credenciales incorrectas, retornar el error
        if (!isVerified) {
            return res.status(401).send({
                message: 'Credenciales incorrectas'
            });
        }

        user.password = undefined;
        // b. Vamos a establecer o generar un token para que el usuario pueda corroborar en futuras peticiones que es el mismo usuario que se logueo
        // Los token se utilizan para autenticar a un usuario y verificar su identidad
        // En este caso vamos a usar JWT (JSON Web Token)
        const token = jwt.sign(user.toJSON(), SECRET, {
            expiresIn: '1h' // El token va a expirar en 1 hora
        });

        // 4. Retornamos el token y el usuario sin contraseña
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

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    deleteUserByID,
    updateUserByID,
    loginUser
};
