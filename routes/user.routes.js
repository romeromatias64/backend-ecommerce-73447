const router = require("express").Router()
const userController = require("../controllers/user.controller")
const { isAuth, isAdmin } = require("../middlewares/isAuth")
const upload = require("../middlewares/uploadFile")

// Ruta para obtener los usuarios
router.get("/users", isAuth, isAdmin, userController.getUsers)

// Ruta para crear un usuario (con subida de avatar)
router.post("/users", upload, userController.createUser)

// Ruta para eliminar un usuario por id
router.delete("/users/:id", isAuth, isAdmin, userController.deleteUserByID)

// Ruta para actualizar un usuario por id
router.put("/users/:id", isAuth, isAdmin, userController.updateUserByID)

// Ruta para logear un usuario
router.post("/login", userController.loginUser)

// Ruta para actualizar el avatar de un usuario
router.put("/users/:id/avatar", upload, userController.updateAvatar)

// Ruta para cambiar la contraseña de un usuario

module.exports = router