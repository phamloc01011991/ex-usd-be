module.exports = (sequelize, Sequelize) => {
  const order_history = sequelize.define("order_history", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    order_type: {
      type: Sequelize.ENUM("long", "short"),
    },
    amount: {
      type: Sequelize.DECIMAL(20, 2),
    },
    profit: {
      type: Sequelize.DECIMAL(20, 2),
    },
    balance_now: {
      type: Sequelize.DECIMAL(20, 2),
    },
    order_duration: {
      type: Sequelize.ENUM("60s", "90s", "180s", "300s", "500s"),
    },
    entry_price: {
      type: Sequelize.DECIMAL(20, 3),
    },
    exit_price: {
      type: Sequelize.DECIMAL(20, 3),
      optional: true,
    },
    order_result: {
      type: Sequelize.STRING,
      optional: true,
      defaultValue: "pending",
    },
    profit_percentage: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    status_time: {
      type: Sequelize.ENUM("pending", "finished", "win"),
      defaultValue: "pending",
    },
  });
  return order_history;
};
