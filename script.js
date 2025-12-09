const form = document.getElementById("contactForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Lengkapi semua field!");
    return;
  }

  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
  submissions.push({ name, email, message, date: new Date().toLocaleString() });
  localStorage.setItem("submissions", JSON.stringify(submissions));
  this.reset();
  loadMessages();
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("submissions") || "[]");
  const container = document.getElementById("messageList");
  container.innerHTML = "";
  if (messages.length === 0) {
    container.innerHTML = "<p>Belum ada pesan.</p>";
    return;
  }
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message-card");
    div.innerHTML = `<p><strong>Nama:</strong> ${msg.name}</p>
                       <p><strong>Email:</strong> ${msg.email}</p>
                       <p><strong>Pesan:</strong> ${msg.message}</p>
                       <p><em>Dikirim: ${msg.date}</em></p>`;
    container.appendChild(div);
  });
}
window.addEventListener("DOMContentLoaded", loadMessages);

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Hapus semua pesan?")) {
    localStorage.removeItem("submissions");
    loadMessages();
  }
});
