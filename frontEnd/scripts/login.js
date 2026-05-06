// barbeiros cadastrados (simulação)
const barbers = [
  { id: "1", name: "Mário", user: "mario", pass: "123" },
  { id: "2", name: "Leandro", user: "leandro", pass: "123" },
  { id: "3", name: "Cleber", user: "cleber", pass: "123" },
  { id: "4", name: "João", user: "joao", pass: "123" },
];

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const barber = barbers.find((b) => b.user === user && b.pass === pass);

  if (barber) {
    // salva sessão
    localStorage.setItem("barberLogged", JSON.stringify(barber));

    window.location.href = "painel.html";
  } else {
    alert("Login inválido");
  }
}
