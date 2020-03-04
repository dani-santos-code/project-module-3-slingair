"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const request = require("request-promise");
const { flights } = require("./test-data/flightSeating");
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
    res.status(200).json(flightIds);
  })
  .get("/seats-available/:flightNumber", (req, res) => {
    const { flightNumber } = req.params;
    res.status(200).json(flights[flightNumber]);
  })
  .post("/confirm", async (req, res) => {
    const { flight, seat, givenName, surname, email } = req.body;
    const checkSeatAvailability = await request(
      `https://journeyedu.herokuapp.com/slingair/flights/${flight}/${seat}`
    );
    const { isAvailable } = await JSON.parse(checkSeatAvailability);

    const options = {
      method: "POST",
      uri: "https://journeyedu.herokuapp.com/slingair/users",
      body: {
        flight,
        seat,
        givenName,
        surname,
        email
      },
      json: true
    };
    if (isAvailable) {
      try {
        const data = await request(options);
        const { id } = await data.reservation;
        res.send({ id });
      } catch (e) {
        console.log(e.message);
      }
    } else {
      res.send("Not Available");
    }
  })

  .get("/users/:userId", (req, res) => {
    const { userId } = req.params;
    res.redirect(`/seat-select/view-reservation.html?id=${userId}`);
  })

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
