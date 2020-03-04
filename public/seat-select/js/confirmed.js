const flightId = document.getElementById("flight");
const seat = document.getElementById("seat");
const name = document.getElementById("name");
const email = document.getElementById("email");

let params = new URL(document.location).searchParams;
let userId = params.get("id");

const reservation = new Reservation(userId, flightId, seat, name, email);

reservation.renderUserInfo();
