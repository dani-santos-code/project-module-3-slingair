const flightId = document.getElementById("flight");
const seat = document.getElementById("seat");
const name = document.getElementById("name");
const email = document.getElementById("email");

const getReservationsInfo = async () => {
  const response = await fetch("/reservations");
  const data = await response.json();
  const lastElement = data[data.length - 1];
  flightId.innerText = lastElement.flight;
  seat.innerText = lastElement.seat;
  name.innerText = `${lastElement.givenName} ${lastElement.surname}`;
  email.innerText = lastElement.email;
  // const queryString = window.location.search;
  // const userId = queryString.replace("?id=", "");
  // const response = await fetch(`/userinfo/${userId}`);
  // const { userById } = await response.json();
  // flightId.innerText = userById.flight;
  // seat.innerText = userById.seat;
  // name.innerText = `${userById.givenName} ${userById.surname}`;
  // email.innerText = userById.email;
};

getReservationsInfo();
