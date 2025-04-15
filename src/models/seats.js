const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Seats;
