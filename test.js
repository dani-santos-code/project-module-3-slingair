const flights = {
  SA231: [
    { id: "1A", isAvailable: true },
    { id: "1B", isAvailable: true },
    { id: "1C", isAvailable: false }
  ],
  SA232: [
    { id: "1A", isAvailable: false },
    { id: "1B", isAvailable: true },
    { id: "1C", isAvailable: false }
  ]
};

console.log(flights["SA232"]);
