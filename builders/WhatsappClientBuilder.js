
const WhatsappClientService = require('../core/WhatsappClientService')

class WhatsappClientBuilder {

    constructor(){
        this.apiKey = null;
        this.contrycode = null;
        this.sesionData = null;        
        this.events = [];
    }

    setApiKey(apiKey){
        this.apiKey = apiKey;
        return this;
    }

    setContryCode(contryCode){
        this.contrycode = contryCode;
        return this;
    }

    setSesionData(sesionData){
        this.sesionData = sesionData;
        return this;
    }

    addEventRegister(event,action){
        this.events.push({event,action});
    }

    validacion(){
        if(!this.apiKey)
            throw new Error("ApiKey required");
        if(!this.contrycode)
            throw new Error("contryCode required");
        //if(!this.sesionData)
          //  throw new Error("contryCode required");
    }

    build(){
        
        this.validacion();

        return new WhatsappClientService({            
            apiKey:this.apiKey,
            contryCode: this.contrycode,
            sesionData:this.sesionData
        });
    }  

}

module.exports = WhatsappClientBuilder;