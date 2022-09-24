const router = require('express').Router();
const whatsappController = require('../controllers/WhatsappController');

router.post('/send',whatsappController.enviarMensaje);
router.get('/qr',whatsappController.getQr);
router.get('/',(request, response)=>{
  response.send("- puedes usar /qr o /send ");
});

module.exports = router;