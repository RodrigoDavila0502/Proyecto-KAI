// 🧠 VARIABLES GLOBALES
let reconocimiento;
let escuchando = false;

let circulo;
let boton;

// 🚀 CARGA PRINCIPAL
window.addEventListener("load", () => {

  // 🔗 REFERENCIAS
  circulo = document.getElementById("circulo");
  boton = document.getElementById("btnKai");

  const kaiContainer = document.getElementById("kaiContainer");
  const kaiText = document.querySelector(".kai-text");
  const introAudio = document.getElementById("introAudio");
  const overlay = document.getElementById("overlayKai");

  // 🔘 ocultar botón al inicio
  boton.classList.remove("show");

  // 🖥️ ACTIVACIÓN GLOBAL (CLICK EN PANTALLA)
  overlay.addEventListener("click", () => {

    // 🔊 activar audio REAL
    if (introAudio) {
      introAudio.muted = false;
      introAudio.play().catch(() => {});
    }

    // ❌ quitar overlay
    overlay.style.display = "none";

    // ✨ PASO 1: APARECER
    setTimeout(() => {
      kaiContainer.classList.add("aparecer");
      kaiText.classList.add("aparecer");
    }, 400);

    // 🚀 PASO 2: SUBIR
    setTimeout(() => {
      kaiContainer.classList.add("subir");
      kaiText.classList.add("animar");
    }, 2200);

    // 🎯 MOSTRAR BOTÓN
    if (introAudio) {
      introAudio.addEventListener("ended", () => {
        boton.classList.add("show");
      });
    } else {
      setTimeout(() => {
        boton.classList.add("show");
      }, 3000);
    }

  }, { once: true });

});


// ⚛️ CONTROL DE ESTADOS
function setEstado(tipo) {
  circulo.classList.remove("activo", "pensando", "hablando");

  if (tipo === "escuchando") {
    circulo.classList.add("activo");
    boton.innerText = "Escuchando...";
  }

  else if (tipo === "pensando") {
    circulo.classList.add("pensando");
    boton.innerText = "Pensando...";
  }

  else if (tipo === "hablando") {
    circulo.classList.add("hablando");
    boton.innerText = "Hablando...";
  }

  else {
    boton.innerText = "Activar KAI";
  }
}


// 🎤 INICIAR IA
function iniciarKai() {

  if (escuchando) {
    reconocimiento.stop();
    speechSynthesis.cancel();

    setEstado("idle");
    escuchando = false;
    return;
  }

  reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;

  escuchando = true;
  setEstado("escuchando");

  reconocimiento.start();

  reconocimiento.onresult = function(event) {
    const texto = event.results[0][0].transcript;

    const textoNormalizado = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    reconocimiento.stop();

    setEstado("pensando");

    setTimeout(() => {
      responder(textoNormalizado);
    }, 500);
  };

  reconocimiento.onend = function() {
    escuchando = false;
  };

  reconocimiento.onerror = function() {
    setEstado("idle");
    escuchando = false;
  };
}


// 🧠 RESPONDER
function responder(texto) {
  let respuesta = "";

  if (texto.includes("hola")) {
    respuesta = "Hola, ¿qué quieres hacer hoy?";
  }

  else if (esYoutube(texto)) {

    let busqueda = texto
      .replace("youtube", "")
      .replace("abre", "")
      .replace("abrir", "")
      .replace("pon", "")
      .replace("reproduce", "")
      .replace("musica", "")
      .trim();

    if (busqueda === "") {
      respuesta = "Abriendo YouTube";
      window.open("https://www.youtube.com", "_blank");
    } else {
      respuesta = "Buscando en YouTube";
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(busqueda)}`;
      window.open(url, "_blank");
    }
  }

  else if (texto.includes("hora")) {
    const hora = new Date().toLocaleTimeString();
    respuesta = "Son las " + hora;
  }

  else if (texto.includes("calculadora de apuestas")) {
    respuesta = "Abriendo calculadora";
    window.open("https://es.surebet.com/calculator", "_blank");
  }

  else if (texto.includes("excel")) {
    respuesta = "Abriendo Excel";
    window.open("https://docs.google.com/spreadsheets/d/162VerR62EFFSDwxVa_c1DXBAKgtuJdfi/edit?gid=1366473076#gid=1366473076", "_blank");
  }

  else if (texto.includes("series")) {
    respuesta = "Abriendo página de series";
    window.open("https://www.lacartoons.com/serie/capitulo/19732?t=2", "_blank");
  }

  else if (texto.includes("gracias")) {
    respuesta = "Un placer ayudarte";
  }

  else if (texto.includes("que haces")) {
    respuesta = "Aprendiendo y evolucionando";
  }

  else {
    respuesta = "Aún estoy aprendiendo contigo";
  }

  hablar(respuesta);
}


// 🔊 VOZ
function hablar(texto) {
  speechSynthesis.cancel();

  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "es-ES";
  voz.rate = 0.9;
  voz.pitch = 1;

  setEstado("hablando");

  voz.onend = () => {
    setEstado("idle");
  };

  speechSynthesis.speak(voz);
}


// 🎯 DETECCIÓN YOUTUBE
function esYoutube(texto) {
  const palabras = [
    "youtube",
    "video",
    "videos",
    "musica"
  ];

  return palabras.some(p => texto.includes(p));
}