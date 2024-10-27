module.exports = (sequelize, Sequelize) => {
  const config = sequelize.define("configs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    min_withdrawal: {
      type: Sequelize.INTEGER,
    },
    max_withdrawal: {
      type: Sequelize.INTEGER,
    },
    min_topup: {
      type: Sequelize.INTEGER,
    },
    max_topup: {
      type: Sequelize.INTEGER,
    },
    withdrawal_fee: {
      type: Sequelize.INTEGER,
    },
    max_number_of_withdrawal: {
      type: Sequelize.INTEGER,
    },
    max_number_or_orders: {
      type: Sequelize.INTEGER,
    },
    black_list: {
      type: Sequelize.STRING,
    },
    percent_stacking_fee: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
  });
  return config;
};
