module.exports = (sequelize, Sequelize) => {
  const transaction = sequelize.define("transaction", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    code: {
      type: Sequelize.STRING,
    },
    typeTransaction: {
      type: Sequelize.ENUM("toup", "withdrawal", "manual"),
    },
    type: {
      type: Sequelize.ENUM("bank", "staking"),
      defaultValue: "bank",
    },
    amount: {
      type: Sequelize.DOUBLE,
    },
    amount_usd: {
      type: Sequelize.DECIMAL(20, 2),
    },
    balanceNow: {
      type: Sequelize.DECIMAL(20, 2),
    },
    status: {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    address: {
      type: Sequelize.STRING,
    },
  });

  return transaction;
};
