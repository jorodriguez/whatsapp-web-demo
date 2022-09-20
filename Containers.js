import {ContainerBuilder} from 'node-dependency-injection';
import WhatsappClientService from './service/WhatsappClientService';

const container = new ContainerBuilder();

const DAO_WHATSAPP_CLIENTE_SERVICE  = 'whatsapp.cliente.service';

container.register(DAO_WHATSAPP_CLIENTE_SERVICE,WhatsappClientService);
 
module.exports.getWhatsAppDao = () => container.get(DAO_WHATSAPP_CLIENTE_SERVICE);

module.exports = container;