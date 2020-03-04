const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const flightSelect = document.getElementById("flight-select-selector");

let selection = "";

const renderOptions = async () => {
  // const response = await fetch("/flightIds");
  // const flightIds = await response.json();
  // flightIds.forEach(id => {
  //   const option = document.createElement("option");
  //   option.value = id;
  //   option.innerText = id;
  //   flightSelect.appendChild(option);
  // });
  const response = await fetch(
    "https://journeyedu.herokuapp.com/slingair/flights"
  );
  const { flights } = await response.json();
  if (flights.length > 1) {
    flights.forEach(id => {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = id;
      flightSelect.appendChild(option);
    });
  }
};

renderOptions();

const renderSeats = async seats => {
  // console.log(seats);
  document.querySelector(".form-container").style.display = "block";
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      const seatInfo = await seats.find(el => el.id === seatNumber);
      if (seatInfo) {
        if (seatInfo.isAvailable) {
          const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
          seat.innerHTML = seatAvailable;
          row.appendChild(seat);
        } else {
          const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
          seat.innerHTML = seatOccupied;
          row.appendChild(seat);
        }
      }
    }
  }
  let seatMap = document.forms["seats"].elements["seat"];
  // console.log(seatMap);
  seatMap.forEach(seat => {
    seat.onclick = () => {
      selection = seat.value;
      const seatInfo = seats.find(el => el.id === seat.value);
      if (seatInfo) {
        if (seatInfo.isAvailable) {
          // console.log("YAY!!!!");
          // console.log(seatInfo.isAvailable);
        } else {
          console.log("false");
        }
      }
      seatMap.forEach(x => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const handleConfirmSeat = async () => {
  const flightNumber = event.target.value || null;
  // const response = await fetch(`/seats-available/${flightNumber}`);
  // const seats = await response.json();
  const response = await fetch(
    `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`
  );
  const seats = await response.json();
  // console.log(seats);
  renderSeats(seats[flightNumber]);
};
const handleConfirmSubmission = event => {
  event.preventDefault();
  const givenName = document.getElementById("givenName");
  const surname = document.getElementById("surname");
  const email = document.getElementById("email");
  const data = {
    givenName: givenName.value,
    surname: surname.value,
    email: email.value,
    seat: selection,
    flight: document.getElementById("flight-select-selector").value
  };
  // console.log(data);

  // fetch("/confirm", {
  //   method: "POST",
  //   mode: "cors",
  //   cache: "no-cache",
  //   credentials: "same-origin",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(data)
  // }).then(() => {
  //   window.location.href = "/seat-select/confirmed.html";
  // });
  fetch("/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(() => {
    window.location.href = `/seat-select/confirmed.html`;
  });
};

flightSelect.addEventListener("change", handleConfirmSeat);
