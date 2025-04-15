const Seats = require("../models/seats");
const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const sendSeatsData = async (req, res) => {
  const Seats = sequelize.define("Seats", {
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 80,
    },
    bookedSeats: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
    },
  });

  try {
    const seatsData = await Seats.findOne();

    if (!seatsData) {
      const dataCreated = await Seats.create(); // This will use default values

      res.json({ ...dataCreated.dataValues });
    } else {
      res.json(seatsData.dataValues);
    }
  } catch (error) {
    res.json(error);
  }
};

const seatBooking = async (req, res) => {
  const { numSeats } = req.body;

  const seatsData = await Seats.findOne();

  const {
    dataValues: { totalSeats, bookedSeats },
  } = seatsData;

  // Find available seats in one row
  const findSeatsInOneRow = (numOfSeats) => {
    for (let row = 0; row <= 11; row++) {
      const startSeat = row * 7 + 1;
      const endSeat = row === 11 ? startSeat + 2 : startSeat + 6; // Last row has 3 seats
      const availableSeatsInRow = [];

      for (let seat = startSeat; seat <= endSeat; seat++) {
        if (!bookedSeats.includes(seat)) {
          availableSeatsInRow.push(seat);
        }
      }

      if (availableSeatsInRow.length >= numOfSeats) {
        return availableSeatsInRow.slice(0, numOfSeats);
      }
    }
    return null;
  };

  // Find nearby available seats across rows
  const findNearbySeats = (numOfSeats) => {
    const availableSeats = [];
    for (let seat = 1; seat <= totalSeats; seat++) {
      if (!bookedSeats.includes(seat)) {
        availableSeats.push(seat);
      }
    }

    availableSeats.sort((a, b) => a - b);

    let start = 0;
    let gap = availableSeats[numOfSeats - 1] - availableSeats[0];

    for (let i = 1; i <= availableSeats.length - numOfSeats; i++) {
      let currentGap = availableSeats[i + numOfSeats - 1] - availableSeats[i];
      if (currentGap < gap) {
        gap = currentGap;
        start = i;
      }
    }

    return availableSeats.slice(start, start + numOfSeats);
  };

  // Try to find seats in one row first
  let seatsToReserve = findSeatsInOneRow(numSeats);

  // If not available in one row, find nearby seats
  if (!seatsToReserve) {
    seatsToReserve = findNearbySeats(numSeats);

    if (!seatsToReserve) {
      res.status(500);
      throw new Error("Required number of seats not available");
    }
  }

  if (seatsToReserve[0]) {
    const updateSeats = [...bookedSeats, ...seatsToReserve];

    await Seats.update(
      { bookedSeats: updateSeats }, // values to update
      { where: { id: 1 } } // condition
    );

    const updatedData = await Seats.findOne();

    if (updatedData) {
      res.json({
        updatedSeats: updatedData.dataValues.bookedSeats,
        bookedSeats: seatsToReserve,
      });
    }
  }
};

const resetBooking = async (req, res) => {
  await Seats.update(
    { bookedSeats: [] }, // values to update
    { where: { id: 1 } } // condition
  );

  const updatedData = await Seats.findOne();

  if (updatedData) {
    res.json({
      updatedSeats: updatedData.dataValues.bookedSeats,
      bookedSeats: null,
    });
  }
};

module.exports = { sendSeatsData, seatBooking, resetBooking };
