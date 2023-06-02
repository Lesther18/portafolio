// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup}
from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import {getDatabase, ref, onValue, update, push,child}
from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFgRrDSLxa6HAWs9F-3R1axzlal06eIU4",
  authDomain: "sistema-de-comentarios-5b813.firebaseapp.com",
  projectId: "sistema-de-comentarios-5b813",
  storageBucket: "sistema-de-comentarios-5b813.appspot.com",
  messagingSenderId: "786347740430",
  appId: "1:786347740430:web:ee1332ebfce8e420d59b5f",
  measurementId: "G-R2EV35Q0GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var usuarioConectado = document.getElementById('usuarioConectado');
var botoniniciar = document.getElementById('botonIniciar');
var botonCerrar = document.getElementById('botonCerrar');
var textoMensaje = document.getElementById('textoMensaje');
var mensajesChat = document.getElementById('mensajesChat');
var nombreUsuarioConectado = "";

botonIniciar.onclick = async function (){

    var auth = getAuth();
    var provider =  new GoogleAuthProvider();
    auth.language = "es";
    var response = await signInWithPopup(auth, provider);
    usuarioConectado.innerText = response.user.email;
    botonCerrar.style.display = "block";
    botonIniciar.style.display = "none";
    nombreUsuarioConectado =response.user.email;
    escucharYDibujarMensajes();

}

botonCerrar.onclick = async function() {
  var auth = getAuth();
  await auth.signOut();
  botonCerrar.style.display = "none";
  botonIniciar.style.display = "block";
  usuarioConectado.innerText = "No conectado";
  nombreUsuarioConectado = "";
}

textoMensaje.onkeydown = async function(event){
  if (event.key == "Enter"){
    if (nombreUsuarioConectado == ""){
      alert("El usuario debe iniciar sesión");
      return;
    }
    var db = getDatabase();
    var referenciaMensajes = ref(db, "mensajes");
    var nuevaLlave = push( child(ref(db), "mensajes") ).key;
    var nuevosDatos = {
      [nuevaLlave]: {
        usuario: nombreUsuarioConectado,
        mensaje: textoMensaje.value,
        fecha: new Date().toLocaleDateString() 
      }
    }
    textoMensaje.value = ""
    update(referenciaMensajes, nuevosDatos)
  }
}

function escucharYDibujarMensajes (){
  //Recuperamos la base de datos de Firebase
  var db = getDatabase();
  //Creamos la referencia al mensaje.
  var referenciaMensajes = ref(db, "mensajes");
  //Escuchamos cuando hay nuevos mensajes
  onValue(referenciaMensajes, function(datos){
       var valoresObtenidos = datos.val();
       mensajesChat.innerHTML = "";
       Object.keys(valoresObtenidos).forEach(llave=>{
           var mensajeDescargado = valoresObtenidos[llave];
           var mensaje = "";
           mensaje = "<div class='nombre-usuario'>" + mensajeDescargado.usuario +"</div>";
           mensaje += "<div class='mensajes-chat'>" + mensajeDescargado.mensaje +"</div>";
           mensaje += "<div>" + mensajeDescargado.fecha +"</div><br></br>";
           mensajesChat.innerHTML += mensaje;
           
           
           
       })
       mensajesChat.scrollTo(0, mensajesChat.scrollHeight)
  },
  (error)=>{
   console.log(error)
  }
  )
}
