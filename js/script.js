const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Gửi khi click
sendBtn.addEventListener("click", sendMessage);

// Gửi khi nhấn Enter
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    const response = await fetch("https://baao09-github-io.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    addMessage(data.reply || "Không có phản hồi từ server.", "bot");

  } catch (error) {
    addMessage("Không kết nối được server.", "bot");
    console.error(error);
  }
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;
}
