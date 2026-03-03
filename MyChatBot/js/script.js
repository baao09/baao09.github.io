const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Tạm thời giả lập bot trả lời
  setTimeout(() => {
    addMessage("Bot đang hoạt động. Backend sẽ thêm sau.", "bot");
  }, 500);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}