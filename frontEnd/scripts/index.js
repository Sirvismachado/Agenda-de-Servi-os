// duração dos serviços (em minutos)
const services = {
  1: { duration: 30, name: "Corte" },
  2: { duration: 60, name: "Corte e Barba" },
  3: { duration: 15, name: "Barba" },
};

// sempre pega atualizado
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(data) {
  localStorage.setItem("appointments", JSON.stringify(data));
}

function loadAvailability() {
  const barber = document.getElementById("barber").value;
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Escolha uma data");
    return;
  }

  const { duration, name } = services[service];

  generateSlots(barber, date, duration, name);
}

function generateSlots(barber, date, duration, serviceName) {
  const slotsDiv = document.getElementById("slots");
  slotsDiv.innerHTML = "";

  const appointments = getAppointments();

  const startHour = 9;
  const endHour = 18;

  for (let h = startHour; h < endHour; h++) {
    for (let m of [0, 30]) {
      let start = new Date(`${date}T${pad(h)}:${pad(m)}:00`);
      let end = new Date(start.getTime() + duration * 60000);

      // 🚫 bloqueia horários que ultrapassam expediente
      if (
        end.getHours() > endHour ||
        (end.getHours() === endHour && end.getMinutes() > 0)
      ) {
        continue;
      }

      const isBusy = appointments.some((app) => {
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
        div.innerText += " (ocupado)";
      } else {
        div.style.background = "#065f46";
        div.innerText += " (livre)";

        div.onclick = () => {
          let client = prompt("Nome do cliente:");

          if (!client || client.trim() === "") {
            alert("Nome inválido");
            return;
          }

          const updated = getAppointments();

          updated.push({
            barber,
            date,
            start: `${pad(h)}:${pad(m)}`,
            duration,
            service: serviceName,
            client: client.trim(),
          });

          saveAppointments(updated);

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

// opcional: manter cancelamento aqui também
function cancelAppointment(barber, date, time) {
  let appointments = getAppointments();

  const index = appointments.findIndex(
    (app) => app.barber === barber && app.date === date && app.start === time,
  );

  if (index !== -1) {
    appointments.splice(index, 1);
    saveAppointments(appointments);

    alert("Agendamento cancelado!");
    loadAvailability();
  }
}
// ==========================
// RANDOM API - AGENDAMENTOS AUTOMÁTICOS
// ==========================

async function generateFakeAppointments() {
  // evita duplicar sempre que atualizar página
  const alreadyGenerated = localStorage.getItem("fakeAppointmentsGenerated");

  if (alreadyGenerated) return;

  try {
    // pega nomes aleatórios
    const response = await fetch("https://randomuser.me/api/?results=20");

    const data = await response.json();

    const fakeUsers = data.results;

    let appointments = getAppointments();

    const barberIds = ["1", "2", "3", "4"];
    const servicesIds = ["1", "2", "3"];

    fakeUsers.forEach((user) => {
      const barber = barberIds[Math.floor(Math.random() * barberIds.length)];

      const serviceId =
        servicesIds[Math.floor(Math.random() * servicesIds.length)];

      const service = services[serviceId];

      // próximos 7 dias
      const randomDay = Math.floor(Math.random() * 7);

      const dateObj = new Date();

      dateObj.setDate(dateObj.getDate() + randomDay);

      const date = dateObj.toISOString().split("T")[0];

      // horários possíveis
      const possibleHours = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
      ];

      const start =
        possibleHours[Math.floor(Math.random() * possibleHours.length)];

      // evita conflitos
      const conflict = appointments.some((app) => {
        if (app.barber !== barber || app.date !== date) return false;

        let appStart = new Date(`${app.date}T${app.start}:00`);
        let appEnd = new Date(appStart.getTime() + app.duration * 60000);

        let newStart = new Date(`${date}T${start}:00`);
        let newEnd = new Date(newStart.getTime() + service.duration * 60000);

        return newStart < appEnd && newEnd > appStart;
      });

      if (!conflict) {
        appointments.push({
          barber,
          date,
          start,
          duration: service.duration,
          service: service.name,
          client: `${user.name.first} ${user.name.last}`,
        });
      }
    });

    saveAppointments(appointments);

    localStorage.setItem("fakeAppointmentsGenerated", "true");

    console.log("Agendamentos fake gerados!");
  } catch (error) {
    console.error("Erro ao gerar agendamentos:", error);
  }
}

// executa automaticamente
generateFakeAppointments();
