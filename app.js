const chat = document.getElementById("chat");
const input = document.getElementById("q");
const sendBtn = document.getElementById("send");
const modePill = document.getElementById("modePill");

// URL backend trên Render
const API_BASE = "https://baao09-github-io.onrender.com";

function addMsg(text, who, meta = "") {
  const wrap = document.createElement("div");
  wrap.className = `msg ${who}`;
  
  // Dọn dẹp nếu AI lỡ sinh Markdown
  let cleanText = text
    .replace(/\*\*/g, "")
    .replace(/(^|\n)\* /g, "$1- ")
    .replace(/#/g, "");

  wrap.textContent = cleanText;

  if (meta) {
    const m = document.createElement("div");
    m.className = "meta";
    m.textContent = meta;
    wrap.appendChild(m);
  }

  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

async function loadHealth() {
  try {
    const r = await fetch(`${API_BASE}/api/health`);
    const j = await r.json();
    modePill.textContent = `MODE: ${j.mode} | model: ${j.model}`;
  } catch {
    modePill.textContent = "MODE: (không kết nối được backend)";
  }
}

async function ask(question) {
  sendBtn.disabled = true;
  addMsg(question, "user");
  input.value = "";

  try {
    const r = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const j = await r.json();

    if (!r.ok) {
      addMsg(j.error || "Lỗi server", "bot");
      return;
    }

    const meta = `Nguồn: gemini | model: ${j.model || ""}`;
    addMsg(j.answer || "(trống)", "bot", meta);

  } catch (e) {
    addMsg("Không gọi được server. Kiểm tra Render đã chạy chưa.", "bot");
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener("click", () => {
  const q = input.value.trim();
  if (q) ask(q);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = input.value.trim();
    if (q) ask(q);
  }
});

addMsg("Chào bạn! Hãy nhập câu hỏi môn học.", "bot");
loadHealth();
