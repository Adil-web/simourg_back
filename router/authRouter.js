const Router = require('express')
const router = new Router()
const controller = require('../controller/authController')
// const authMiddleware = require('../middleware/authMiddleware')

router.post('/login', controller.login)
router.post('/user', controller.getUser)
router.post('/users', controller.getUsers)

module.exports = router