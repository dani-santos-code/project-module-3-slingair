const flightId = document.getElementById("flight");
const seat = document.getElementById("seat");
const name = document.getElementById("name");
const email = document.getElementById("email");

const getReservationsInfo = async () => {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  const response = fetch(
    `https://journeyedu.herokuapp.com/slingair/users/${id}`
  ).then(res => res.json());
  const { data } = await response;
  flightId.innerText = data.flight;
  seat.innerText = data.seat;
  name.innerText = `${data.givenName} ${data.surname}`;
  email.innerText = data.email;
};
getReservationsInfo();
