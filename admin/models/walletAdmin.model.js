module.exports = (sequelize, Sequelize) => {
    const WalletAdmin = sequelize.define("wallet_admin",
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        network:{
            type: Sequelize.STRING
        },
        adress:{
            type: Sequelize.STRING
        }
    })
    return WalletAdmin;
    };