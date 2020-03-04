"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const uniqid = require("uniqid");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations.js");
const PORT = process.env.PORT || 8000;

express()
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints

  .get("/", (req, res) => {
    res.redirect("/seat-select/index.html");
  })
  .get("/flightIds", (req, res) => {
    const flightIds = Object.keys(flights);
    console.log(flightIds);

    res.status(200).json(flightIds);
  })
  .get("/seats-available/:flightNumber", (req, res) => {
    const { flightNumber } = req.params;
    res.status(200).json(flights[flightNumber]);
    //   res.status(200).json({ [flightNumber]: flights[flightNumber] });
  })
  .post("/confirm", (req, res) => {
    const { flight, seat, givenName, surname, email } = req.body;
    const uniqueId = uniqid();
    reservations.push({
      uniqueId,
      flight,
      seat,
      givenName,
      surname,
      email
    });
    res.redirect("/seat-select/confirmed.html");
  })

  .get("/reservations", (req, res) => {
    res.send(reservations);
  })
  .get("/users/:userId", (req, res) => {
    const { userId } = req.params;
    res.redirect(`/seat-select/view-reservation.html?id=${userId}`);
  })

  .get("/userinfo", (req, res) => {
    const { id } = req.query;
    const userById = reservations.find(user => user.id === id);
    res.send({ userById });
  })

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
