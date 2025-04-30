const router = require("express").Router()
const userController = require("../controllers/user.controller")

// Ruta para obtener los usuarios
router.get("/users", userController.getUsers)

// Ruta para crear un usuario
router.post("/users", userController.createUser)

// Ruta para obtener un usuario por id
router.get("/users/:id{/:otro}", userController.getUserByID) // {/:otro} es un ejemplo de ruta con parámetros opcionales

// Ruta para eliminar un usuario por id
router.delete("/users/:id", userController.deleteUserByID)

// Ruta para actualizar un usuario por id
router.put("/users/:id", userController.updateUserByID)

// Ruta para logear un usuario
router.post("/login", userController.loginUser)

// Ruta para cambiar la contraseña de un usuario

module.exports = router