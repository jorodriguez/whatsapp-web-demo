const router = require('express').Router();
const whatsappController = require('../controllers/WhatsappController');

router.post('/send',whatsappController.enviarMensaje);
router.get('/:qr',whatsappController.getQr);

module.exports = router;