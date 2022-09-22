
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const qrImage = require('qr-image');

const { Client, LegacySessionAuth,LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = "./session.js";
const country_code = '521'; //codigo para mexico
const myNumber = "8110208406";
const msgInit = "Hola esto es una prueba desde api client web";

const C_US_PLACEHOLDER = '@c.us'; // Este codigo es definido por whatsapp

class WhatsappClient extends Client {

    constructor(){
        super({
            authStrategy: new LocalAuth({ session:getSesionData() } ),
            puppeteer: { headless: true },
            args: ['--no-sandbox'],
        });
        this.sessionData;
        this.clienteOk = false;
        this.qrCode;
        this.init();
    }

    
    init = () =>{

        console.log("Iniciando....");

        this.initialize();

        this.on('authenticated',session=>{
            console.log("on authenticated");
        
            this.sessionData = session;                   
        });
        
        this.on('ready',()=>{
            console.log("El cliente esta listo..");                

            const msgInicial = `${msgInit} ${new Date()}`;

            this.clienteOk = true;

            //testing message
           // this.sendMessagePhonePromise({ phoneNumber :myNumber, message :msgInicial });            
                    
        });

        this.on('qr', qr =>{
            console.log("QR ..");//TODO: enviar qr por websocket
            this.qrCode = qr;            
            //qrcode.generate(qr,{small:true});  
            
            generateImage(qr);
        });

        this.on('auth_failure',msg=>{
            console.err("Hubo un fallo en en la auth"+msg);
        })
        
        this.on('message', msg=>{
            console.log("msg from :"+msg.from + ':' + msg.body);
            
        });
        
    }

    sendMessagePhone = async ({phoneNumber,message}) =>{
        
        if(!this.clienteOk){
            console.log("El cliente no esta listo, debe escanear el codigo QR");
            return;
        }
    
        validarRequerido(message);

        const chatId = buildChatId(phoneNumber);

                   
        const response = await this.sendMessage(chatId,message);
    
        console.log("Mensaje enviado..");
    
        return { id: response.id.id };
            
    }    

    sendMessagePhonePromise = ({phoneNumber,message})=>{

        console.log(`try to send ${phoneNumber} : ${message}`);
        
        if(!this.clienteOk){
            console.log("El cliente no esta listo, debe escanear el codigo QR");
            return;
        }    

        validarRequerido(message);
        
        let charId = buildChatId(phoneNumber);

        this.sendMessage(charId,message)            
        .then(response=>{
                if(response.id.fromMe){
                    console.log("Mensaje enviado...");
                }
            console.log("Msg Enviado: "+response.id.id);

        }).catch(err => console.log("ERROR AL ENVIAR MSG "+err));
    }

    

    /*generateImageQr = async () =>{
        console.log("@generateImageQr");
        
        if(this.clienteOk){
            
           const path = await generateImage(this.qrCode);
           return path;
        }else{ return "Cliente No activo"; }        
    }   */

    getEstatus = () => this.clienteOk;


}

const validarRequerido = (value)=> {if(!value) throw new Error("Valor es requerido");};

const buildChatId = (number)=> {
     
    validarRequerido(number);

    return `${country_code}${number}${C_US_PLACEHOLDER}`;
}


const getSesionData = ()=>{
    let sesionData;
    if(fs.existsSync(SESSION_FILE_PATH)){
        sesionData = require(SESSION_FILE_PATH);
    }

    return sesionData;        
} 

const getPath = ()=> `${process.cwd()}/external_resource/qr.svg`;

const generateImage = async (base64) => {
    console.log("@generateImage ");
          
    let qr_svg = await qrImage.image(base64, { type: "svg", margin: 4 });

    qr_svg.pipe(require("fs").createWriteStream(`${getPath()}`));

    console.log(` Recuerda que el QR se actualiza cada minuto '`);
    console.log(` Actualiza F5 el navegador para mantener el mejor QR`);
    console.log(` Entra a : http://localhost:5000/whatsapp/qr`);

    return getPath();
  };

module.exports = WhatsappClient;