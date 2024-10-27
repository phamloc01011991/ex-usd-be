module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    // username: {
    //   type: Sequelize.STRING,
    // },
    phone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    balance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    transferCode: {
      type: Sequelize.STRING,
    },
    securityCode: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    avatar: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    creditScore: {
      type: Sequelize.INTEGER,
      defaultValue: 100,
    },
    note: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    rank: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    referralCode: {
      type: Sequelize.STRING,
    },
    invitedCode: {
      type: Sequelize.STRING,
    },
    ipAddress: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
