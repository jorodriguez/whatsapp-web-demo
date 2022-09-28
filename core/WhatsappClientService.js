
const fs = require('fs');
const qrcodeTerminal = require('qrcode-terminal');
const qrImage = require('qr-image');

const { Client, LegacySessionAuth,LocalAuth, Events } = require('whatsapp-web.js');

const SESSION_FILE_PATH = "./session.js";
const country_code = '521'; //codigo para mexico
//const myNumber = "8110208406";
const msgInit = "Hola esto es una prueba desde api client web";

const C_US_PLACEHOLDER = '@c.us'; // Este codigo es definido por whatsapp

class WhatsappClient extends Client {

    constructor(sesionData,idCuenta,contryCode){
        super({
            authStrategy: new LocalAuth({ session:sesionData }),
            puppeteer: { 
                headless: true ,
                args: ['--no-sandbox', '--disable-setuid-sandbox']               
            }
        });
        this.idCuenta = idCuenta;
        this.contryCode = contryCode;
        this.sessionData;
        this.clienteOk = false;        
        this.qrCode;
        //this.init();
    }
    
    init = () =>{

        console.log("@@Iniciando cliente Whatsapp....");
        return new Promise((resolve,reject)=>{        
        console.log("@@Iniciando promesar...");
        this.on('authenticated',session=>{
            console.log("on authenticated");
        
            this.sessionData = session;                   
            
            //aqui guardar la sesion en la db
            resolve({inSesion:true,leerQr:false,qr:null});

        });
        
        this.on('ready',()=>{
            console.log("El cliente esta listo ..");                
            
            this.clienteOk = true;                 
            
        });

        this.on('auth_failure',msg=>{
            console.err("Hubo un fallo en en la auth"+msg);
            reject()
        })

        this.on('qr', qr =>{
            console.log("QR ..");//TODO: enviar qr por websocket
            this.qrCode = qr;
            //qrcodeTerminal.generate(qr,{small:true});    
            resolve({inSesion:false,leerQr:true,qr:qr});
            generateImage(qr,this.idCuenta);
        });       
        
        this.on('message', msg=>{
            console.log("msg from :"+msg.from + ':' + msg.body);
            
        });        

        this.on('disconnected', reason=>{
            console.log("disconected "+reason );
            this.clienteOk = false;
            
            //guardar en db 
            
        });

        this.registerEvent("message_ack");
        this.registerEvent("message_create");
        this.registerEvent("message_revoke_everyone");        

        this.initialize();
    });
    }

    registerEvent = (name)=>{
        
        console.log("Evento registrado "+name);

        this.on(name,msg =>{
            console.log(`${name }:${ JSON.stringify(msg)}`);            
        });                
    }

    sendMessagePhone = async ({phoneNumber,message}) =>{
        
        if(!this.clienteOk){
            console.log("El cliente no esta listo, debe escanear el codigo QR");
            return false;
        }
    
        validarRequerido(message,"message");

        const chatId = buildChatId(phoneNumber);
                   
        const response = await this.sendMessage(chatId,message);
    
        console.log("Mensaje enviado..");
    
        return response.id.id;
            
    }    

    sendMessagePhonePromise = ({phoneNumber,message})=>{

        console.log(`try to send ${phoneNumber} : ${message}`);
        
        if(!this.clienteOk){
            console.log("El cliente no esta listo, debe escanear el codigo QR");
            return;
        }    

        validarRequerido(message,"message");
        validarRequerido(phoneNumber,"phoneNumber");
        
        let charId = buildChatId(phoneNumber);

        this.sendMessage(charId,message)            
        .then(response=>{
                if(response.id.fromMe){
                    console.log("Mensaje enviado...");
                }
            console.log("Msg Enviado: "+response.id.id);

        }).catch(err => console.log("ERROR AL ENVIAR MSG "+err));
    }
   
    getEstatus = () => this.clienteOk;

}

const validarRequerido = (value,id)=> {if(!value)throw new Error(`${id} : Valor es requerido`);};

const buildChatId = (number)=> {
     
    validarRequerido(number);

    return `${this.contryCode}${number}${C_US_PLACEHOLDER}`;
}

/*
const getSesionData = ()=>{
    let sesionData;
    if(fs.existsSync(SESSION_FILE_PATH)){
        sesionData = require(SESSION_FILE_PATH);
    }

    return sesionData;        
} */

const getPath = (nombreArchivo)=> `${process.cwd()}/external_resource/${nombreArchivo}.svg`;

const generateImage = async (base64,nombreArchivo) => {
    console.log("@generateImage ");
          
    let qr_svg = qrImage.image(base64, { type: "svg", margin: 4 });

    qr_svg.pipe(require("fs").createWriteStream(`${getPath(nombreArchivo)}`));

    console.log(` Recuerda que el QR se actualiza cada minuto '`);
    console.log(` Actualiza F5 el navegador para mantener el mejor QR`);
    console.log(` Entra a : http://localhost:5000/whatsapp/qr`);

    //return  getPath();
};



module.exports = WhatsappClient;