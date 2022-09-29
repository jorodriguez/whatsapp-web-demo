const router = require('express').Router();
const whatsappController = require('../controllers/WhatsappController');

router.post('/send',whatsappController.enviarMensaje);
router.get('/qr/:apiKey',whatsappController.getQr);
router.post('/sesion/logout',whatsappController.logout);
router.post('/sesion/iniciar',whatsappController.iniciarCliente);
router.get('/sesion/imprimir',whatsappController.imprimirSesiones);

module.exports = router;