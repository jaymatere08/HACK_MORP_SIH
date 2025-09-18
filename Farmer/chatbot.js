let selectedLang = "en"; 
let recognition;
let isListening = false;


const langMap = {
  en: "en-US",
  hi: "hi-IN",
  mr: "mr-IN"
};

function changeLanguage() {
  selectedLang = document.getElementById("language-select").value;
  console.log("🌐 Language changed to:", selectedLang);
}


function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (text === "") return;

  appendMessage(text, "user");
  input.value = "";


  let reply;
  if (selectedLang === "hi") {
    reply = "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?";
  } else if (selectedLang === "mr") {
    reply = "नमस्कार! मी तुम्हाला कशी मदत करू शकतो?";
  } else {
    reply = "Hello! How can I help you?";
  }

  setTimeout(() => {
    appendMessage(reply, "bot");
    speak(reply, selectedLang);
  }, 800);
}


function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleVoice() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("⚠ Voice input not supported in this browser. Use Chrome instead.");
    return;
  }

  if (!recognition) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  recognition.lang = langMap[selectedLang];
  
  if (!isListening) {
    recognition.start();
    isListening = true;
    document.getElementById("mic-btn").classList.add("listening");

    recognition.onstart = () => console.log("🎤 Listening...");
    recognition.onend = () => {
      console.log("❌ Stopped listening");
      isListening = false;
      document.getElementById("mic-btn").classList.remove("listening");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("✅ Heard:", transcript);
      document.getElementById("user-input").value = transcript;
      sendMessage();
    };
  } else {
    recognition.stop();
  }
}


function speak(text, lang) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langMap[lang];
  window.speechSynthesis.speak(utterance);
}