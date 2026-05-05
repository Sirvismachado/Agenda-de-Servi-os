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

function generateSlots(barber, date, duration) {
  const slotsDiv = document.getElementById("slots");
  slotsDiv.innerHTML = "";

  const startHour = 9;
  const endHour = 18;

  for (let h = startHour; h < endHour; h++) {
    for (let m of [0, 30]) {

      let start = new Date(`${date}T${pad(h)}:${pad(m)}:00`);
      let end = new Date(start.getTime() + duration * 60000);

      const isBusy = appointments.some(app => {
        if (app.barber !== barber || app.date !== date) return false;

        let appStart = new Date(`${app.date}T${app.start}:00`);
        let appEnd = new Date(appStart.getTime() + app.duration * 60000);

        return start < appEnd && end > appStart;
      });

      const div = document.createElement("div");
      div.className = "slot";
      div.innerText = `${pad(h)}:${pad(m)}`;

      if (isBusy) {
  div.style.background = "#7f1d1d";
  div.innerText += " (cancelar)";

  div.onclick = () => {
    if (confirm("Deseja cancelar este horário?")) {
      cancelAppointment(barber, date, `${pad(h)}:${pad(m)}`);
    }
  };

      } else {
        div.style.background = "#065f46";
        div.innerText += " (livre)";

        div.onclick = () => {
          appointments.push({
            barber,
            date,
            start: `${pad(h)}:${pad(m)}`,
            duration
          });

          alert("Agendado!");
          loadAvailability();
        };
      }

      slotsDiv.appendChild(div);
    }
  }
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