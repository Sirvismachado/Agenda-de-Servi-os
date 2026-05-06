// duração dos serviços (em minutos)
const services = {
  1: 30,
  2: 60,
  3: 15
};

// simulação de banco de dados (agendamentos já feitos)
const appointments = [
  {
    barber: "1",
    date: "2026-05-06",
    start: "09:00",
    duration: 30
  },
  {
    barber: "1",
    date: "2026-05-06",
    start: "10:00",
    duration: 60
  },
  {
    barber: "2",
    date: "2026-05-06",
    start: "09:30",
    duration: 30
  }
];

function loadAvailability() {
  const barber = document.getElementById("barber").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Escolha uma data");
    return;
  }

  const duration = services[service];

  generateSlots(barber, date, duration);
}

function generateSlots(barber, date) {
  const slotsDiv = document.getElementById("slots");
  slotsDiv.innerHTML = "";

  let horarios = [];

  for (let h = 9; h < 18; h++) {
    horarios.push(`${pad(h)}:00`);
    horarios.push(`${pad(h)}:30`);
  }

  horarios.forEach(horario => {

    const isBusy = appointments.some(app =>
      app.barber === barber &&
      app.date === date &&
      app.start === horario
    );

    const div = document.createElement("div");
    div.className = "slot";
    div.innerText = horario;

    if (isBusy) {
      div.style.background = "#7f1d1d";
      div.innerText += " (ocupado)";
    } else {
      div.style.background = "#065f46";
      div.innerText += " (livre)";

      div.onclick = () => {
        const duration = 30;

        appointments.push({
          barber,
          date,
          start: horario,
          duration
        });

        alert("Agendado!");
        loadAvailability();
      };
    }

    slotsDiv.appendChild(div);
  });
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

function cancelAppointment(barber, date, time) {
  const index = appointments.findIndex(app =>
    app.barber === barber &&
    app.date === date &&
    app.start === time
  );

  if (index !== -1) {
    appointments.splice(index, 1);
    alert("Agendamento cancelado!");
    loadAvailability();
  }
}
