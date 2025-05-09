const router = require("express").Router()
const userController = require("../controllers/user.controller")
const upload = require("../middlewares/uploadFile")

// Ruta para obtener los usuarios
router.get("/users", userController.getUsers)

// Ruta para crear un usuario (con subida de avatar)
router.post("/users", upload.single("avatar"), userController.createUser)

// Ruta para obtener un usuario por id
router.get("/users/:id", userController.getUserByID)

// Ruta para eliminar un usuario por id
router.delete("/users/:id", userController.deleteUserByID)

// Ruta para actualizar un usuario por id
router.put("/users/:id", userController.updateUserByID)

// Ruta para logear un usuario
router.post("/login", userController.loginUser)


router.put("/users/:id/avatar", upload.single("avatar"), userController.updateAvatar)

// Ruta para cambiar la contraseña de un usuario

module.exports = router