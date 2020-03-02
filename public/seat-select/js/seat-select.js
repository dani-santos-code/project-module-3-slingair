const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const flightSelect = document.getElementById("flight-select-selector");

let selection = "";

const renderOptions = async () => {
  const response = await fetch("/flightIds");
  const flightIds = await response.json();

  flightIds.forEach(id => {
    const option = document.createElement("option");
    option.value = id;
    option.innerText = id;
    flightSelect.appendChild(option);
  });
};

renderOptions();

const renderSeats = seats => {
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
      const seatInfo = seats.find(el => el.id === seatNumber);
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
          console.log("YAY!!!!");
          // here we should make a call to the server to assign user to a seat
          // also post to the BE isAvailable false, so other users cannot sit
          //   window.location.href = "/confirmed";
          console.log(seatInfo.isAvailable);
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
  const response = await fetch(`/seats-available/${flightNumber}`);
  const seats = await response.json();
  renderSeats(seats);
};

const handleConfirmSubmission = async () => {
  event.preventDefault();
  // query the user firstName, lastName
  // get the Seat nummnber to Assign to the user
};

flightSelect.addEventListener("change", handleConfirmSeat);
