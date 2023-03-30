const fs = require('fs');
const qrcodeTerminal = require('qrcode-terminal');
const qrImage = require('qr-image');

const { Client, LegacySessionAuth, LocalAuth, Events } = require('whatsapp-web.js');

const C_US_PLACEHOLDER = '@c.us'; // Este codigo es definido por whatsapp

class WhatsappClient extends Client {

    constructor(props = { sesionData, apiKey, contryCode }) {
        super({
            authStrategy: new LocalAuth({ clientId: `${props.apiKey}`, session: props.sesionData }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
        this.apiKey = props.apiKey;
        this.contryCode = props.contryCode;
        this.sessionData = props.sesionData;
        this.clienteOk = false;
        this.qrCode;
        //this.init();
    }

    init = () => {

        console.log("@@Iniciando cliente Whatsapp....");

        return new Promise((resolve, reject) => {

            this.on('authenticated', session => {
                console.log("on authenticated");
                //se autentica con el qr 

                this.sessionData = session;

                //aqui guardar la sesion en la db                        
                resolve({ sesionIniciada: true, leerQr: false, qr: null, sesionData: session });

            });

            this.on('ready', () => {
                console.log("@El cliente esta listo para enviar mensajes ..");

                this.qrCode = null;

                this.clienteOk = true;

                //guardar en db             

            });

            this.on('auth_failure', msg => {
                console.err("Hubo un fallo en en la auth" + msg);
                reject({ status: false, msg });
            })

            this.on('qr', qr => {
                console.log(`QR ${this.apiKey}..`); //TODO: enviar qr por websocket
                this.qrCode = qr;
                this.clienteOk = false;
                //qrcodeTerminal.generate(qr,{small:true});    
                resolve({ sesionIniciada: false, leerQr: true, qr: qr, sesionData: null });
                generateImage(qr, this.apiKey);
            });

            this.on('message', msg => {
                console.log("msg from :" + msg.from + ':' + msg.body);

            });

            this.on('disconnected', reason => {
                console.log("disconected " + reason);
                this.clienteOk = false;

                //FIXT_TO Trabajar aqui si se desconecta el cliente del telefono borrar todas las instancias

                //guardar en db 

            });

            //this.registerEvent("message_ack");
            //this.registerEvent("message_create");
            //this.registerEvent("message_revoke_everyone");        

            this.initialize();
        });
    }

    registerEvent = (name) => {

        console.log("Evento registrado " + name);

        this.on(name, msg => {
            console.log(`${name }:${ JSON.stringify(msg)}`);
        });
    }

    sendMessagePhone = async({ phoneNumber, message }) => {

        if (!this.clienteOk) {
            console.log("El cliente no esta listo, debe escanear el codigo QR");
            return false;
        }

        validarRequerido(message, "message");

        const chatId = buildChatId(phoneNumber);

        const response = await this.sendMessage(chatId, message);

        console.log("Mensaje enviado..");

        return response.id.id;

    }

    getEstatus = () => this.clienteOk;

    estaPermitidoLeerQr = () => this.qrCode != null;

}

const validarRequerido = (value, id) => { if (!value) throw new Error(`${id} : Valor es requerido`); };

const buildChatId = (number) => {

    validarRequerido(number, 'numero para chatid');

    return `${number}${C_US_PLACEHOLDER}`;
}

const getPath = (nombreArchivo) => `${process.cwd()}/external_resource/${nombreArchivo}.svg`;

const generateImage = async(base64, nombreArchivo) => {
        console.log("@generateImage ");

        let qr_svg = qrImage.image(base64, { type: "svg", margin: 4 });

        qr_svg.pipe(require("fs").createWriteStream(`${getPath(`qr_${nombreArchivo}`)}`));

    console.log(` Qr refrescado  ${nombreArchivo}`);    

    //return  getPath();
};



module.exports = WhatsappClient;