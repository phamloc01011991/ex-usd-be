module.exports = (sequelize, Sequelize) => {
  const configInterest = sequelize.define("config_interest", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true,
    },
    percent: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
  });
  return configInterest;
};
