 const barberLogged = localStorage.getItem("barber");

if (!barberLogged) {
  window.location.href = "login.html";
}
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const users = [
    { id: "1", user: "mario", pass: "123" },
    { id: "2", user: "leandro", pass: "123" },
    { id: "3", user: "cleber", pass: "123" },
    { id: "4", user: "joao", pass: "123" }
  ];

  const found = users.find(u => u.user === user && u.pass === pass);

  if (found) {
    localStorage.setItem("barberId", found.id);
    localStorage.setItem("barberName", found.user);

    window.location.href = "index.html";
  } else {
    alert("Login inválido");
  }
}
document.getElementById("welcome").innerText =
  "Bem-vindo, " + localStorage.getItem("barber");
  function logout() {
  localStorage.removeItem("barber");
  window.location.href = "login.html";
}
function loadAvailability() {
  const barber = localStorage.getItem("barberId");
  const date = document.getElementById("date").value;

  if (!date) return alert("Escolha uma data");

  generateSlots(barber, date);
  renderAppointments();
}
const appointments = [
  { barber: "1", date: "2026-05-06", start: "09:00", duration: 30 },
  { barber: "2", date: "2026-05-06", start: "10:00", duration: 60 },
];