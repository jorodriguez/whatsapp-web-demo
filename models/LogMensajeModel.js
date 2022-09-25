class LogMensaje {
  constructor() {
    this.id = null;
    this.c_cuenta = null;
    this.whatsapp = "";
    this.mensaje = "";
    this.codigo_envio = null;
    this.excepcion = null;
    this.creado=null;
    this.creado_por = null;
    this.modificado=null;
    this.modificado_por = null;
    this.activo = null;
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setCCuenta(ccuenta) {
    this.c_cuenta = ccuenta;
    return this;
  }
  buildInsert() {
    return {      
      c_cuenta: this.c_cuenta,
      whatsapp: this.whatsapp,
      mensaje:this.mensaje,
      codigo_envio: this.codigo_envio,      
      creado_por: this.creado_por,
      excepcion : this.excepcion
    };
  }
  buildReturn() {
    return {            
      whatsapp: this.whatsapp,
      mensaje:this.mensaje,
      codigo_envio: this.codigo_envio,            
      excepcion : this.excepcion
    };
  }
}

module.exports = LogMensaje;