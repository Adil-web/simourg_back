const Router = require('express')
const router = new Router()
const dispensingBlockController = require('../controller/dispensingBlock.controller')
const tareController = require('../controller/tare.controller')

router.post('/drugsName', tareController.getDrugName)
router.post('/dispensing', dispensingBlockController.createDispensing)
router.post('/organizations', tareController.getOrganization)
router.post('/tare', tareController.getTare)
router.post('/tar', tareController.getTars)
router.post('/tare-accepting', tareController.tareAccepting)

module.exports = router