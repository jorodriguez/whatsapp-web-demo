
class Exception{
    
    constructor(mensajeError,mensajeUsuario){
        this.mensajeError=  mensajeError;
        this.mensajeUsuario= mensajeUsuario;
    }      

    getMensajeError(){
        return this.mensajeError;
    }


    getMensajeUsuario(){
        return this.mensajeUsuario;
    }

}

class ExceptionBD extends Exception{
    constructor(mensajeError){
        super(mensajeError,"¡Ups! Ocurrió un error contacte al equipo de soporte.")
    }
}


class ExceptionDatosFaltantes extends Exception{
    constructor(mensajeError){
        super("Faltan Datos",mensajeError);
    }
}



module.exports = {Exception,ExceptionBD,ExceptionDatosFaltantes};