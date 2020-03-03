const flightId = document.getElementById("flight");
const seat = document.getElementById("seat");
const name = document.getElementById("name");
const email = document.getElementById("email");

const getReservationsInfo = async () => {
  const queryString = window.location.search;
  const userId = queryString.replace("?id=", "");
  const response = await fetch(`/userinfo?id=${userId}`);
  //   const response = await fetch(
  //     `/https://journeyedu.herokuapp.com?/slingair/users?id=${userId}`
  //   );
  const { userById } = await response.json();
  flightId.innerText = userById.flight;
  seat.innerText = userById.seat;
  name.innerText = `${userById.givenName} ${userById.surname}`;
  email.innerText = userById.email;
};

getReservationsInfo();
