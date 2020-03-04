class Reservation {
  constructor(userId, flightId, seat, name, email) {
    this.userId = userId;
    this.flightId = flightId;
    this.seat = seat;
    this.name = name;
    this.email = email;
  }

  async renderUserInfo() {
    const response = fetch(
      `https://journeyedu.herokuapp.com/slingair/users/${this.userId}`
    ).then(res => res.json());
    const { data } = await response;
    this.flightId.innerText = data.flight;
    this.seat.innerText = data.seat;
    this.name.innerText = `${data.givenName} ${data.surname}`;
    this.email.innerText = data.email;
  }
}
