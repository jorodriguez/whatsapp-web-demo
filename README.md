# whatsapp-web-demo
Demo de libreria whatsasppweb

**Librería:**
https://wwebjs.dev/

**Versiones**
Node > 12, express, qrcode-terminal

probado en la version node v14.x

**Iniciar prueba**

1. Hacer el clon del repositorio

2. Entrar a la carpeta del proyecto

3. Antes de iniciar se tiene que modificar el número de teléfono para iniciar la sesión, abrir el proyecto o abrir el archivo ../service/WhatsappClientService.js y modificar el número de la constante:

>  const myNumber = ''811xxxx"; //<<< aqui pones el numero que inicia sesión

5. Correr el comando para instalar las dependencias

>   $ npm i 

4.  Desde la terminal correr el siguiente comando para iniciar el api:

> $ npm start

5. Abre la app whatsapp de tu teléfono y ve a la opción de Dispositivos Vinculados y escanea el QR que sale en la terminal para iniciar el cliente.

6. Después de escanear el QR en la terminal debe decir un mensaje "El cliente esta listo.." y enviará un mensaje a tu número que dice "Hola esto es una prueba desde api client web ".

➡ En la terminal se imprimirán los mensajes recibidos.

**Enviar  mensaje a un teléfono cualquiera** 

1. Puedes usar postman o correr el comando para enviar un post al API
o pega esta linea en tu terminal
```bash
curl -X POST -d '{"phoneNumber":"8110208406","message":"Hola estoy probando tu api....."}' -H "Content-Type: application/json" http://localhost:5000/whatsapp/send
```
2. Revisa tu whatsapp y debe aparecer el envío del mensaje exitoso.




Nota: hasta el momento no esta probado en un ambiente productivo ni online.


*fecha: 20-sep-2022* 
