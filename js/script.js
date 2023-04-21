const msgerForm = document.getElementById("form");
const msgerInput = document.querySelector(".msger-input");
const msgerChat = document.querySelector(".msger-chat");
let typing = document.getElementById("typingstatus")

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];


const BOT_IMG = "bot.png";
const PERSON_IMG = "profile.jpeg";
const BOT_NAME = "Jarvis";
const PERSON_NAME = "Nitesh";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText, true);
  typing.innerHTML = "typing...";
  msgerInput.value = "";

  botResponse(msgText);
});

function appendMessage(name, img, side, text, log, time = formatDate(new Date())) {
  const message = { name, img, side, text, time };
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url('/static/assets/${img}')"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;

  if (log) {
    console.log("Logged : "+log)
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }
}

function botResponse(message) {

  send(message)


  // const r = random(0, BOT_MSGS.length - 1);
  // const msgText = BOT_MSGS[r];
  // const delay = msgText.split(" ").length * 100;
  // setTimeout(() => {
  //   appendMessage(BOT_NAME, BOT_IMG, "left", msgText,false);
  //   typing.innerText = "";
  // }, delay);
  
}

function formatDate(date) {
  let h = date.getHours();
  const m = "0" + date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;

  return `${h}:${m.slice(-2)} ${ampm}`;
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


window.addEventListener('load', () => {
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  if (chatHistory.length === 0) {
    const welcomeMessage = "Hi, welcome to the chat! My name is Jarvis. Please feel free to send me a message. 😄";
    appendMessage(BOT_NAME, BOT_IMG, "left", welcomeMessage, true);
  } else {
    chatHistory.forEach(message => {
      appendMessage(message.name, message.img, message.side, message.text, false, message.time);
    });
  }
  chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  console.log(chatHistory);
});

function clearChat(){
  localStorage.removeItem('chatHistory');
  location.reload();
}


function send(message) {

  fetch('http://localhost:5002/bot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message })
  })
  .then(response => response.json())
  .then(data => {
    const msgText = data.message;
    typing.innerText = "";
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText, true);
  })
  .catch(error => {
    console.error('Error fetching bot response:', error);
  });
}


document.addEventListener("keydown", function(event) {
  if (event.code === "Slash" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    msgerInput.focus();
  }
});
