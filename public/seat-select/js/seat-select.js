const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const flightSelect = document.getElementById("flight-select-selector");
const idInput = document.getElementById("uuid");

let selection = "";

const renderOptions = async () => {
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
  seatMap.forEach(seat => {
    seat.onclick = () => {
      selection = seat.value;
      const seatInfo = seats.find(el => el.id === seat.value);
      if (seatInfo) {
        if (seatInfo.isAvailable) {
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
  event.preventDefault();
  if ((document.querySelector(".form-container").style.display = "block")) {
    document.querySelector("#seats-section").innerHTML = "";
  }
  const flightNumber = event.target.value || null;
  const response = await fetch(
    `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`
  );
  const seats = await response.json();
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

  fetch("/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => {
    res.json().then(data => {
      window.location.href = `/seat-select/confirmed.html?id=${data.id}`;
    });
  });
};

const handleId = async () => {
  userId = event.target.value;
  const response = await fetch(
    `https://journeyedu.herokuapp.com/slingair/users/${userId}`
  );
  const { data } = await response.json();
  // console.log(data.id);
  window.location.href = `/seat-select/view-reservation.html?id=${data.id}`;
};

flightSelect.addEventListener("change", handleConfirmSeat);
idInput.addEventListener("change", handleId);
