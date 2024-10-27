const dbUser = require("../app/models");
const StakingInterest = dbUser.staking_interest;
const User = dbUser.user;
const sequelize = dbUser.sequelize;

const Cabin = require("cabin");
const Axe = require("axe");
const { Signale } = require("signale");

// initialize cabin
const logger = new Axe({
  logger: new Signale(),
});
const cabin = new Cabin({ logger });

(async () => {
  try {
    let getUserStaking = ` SELECT
    su.*,
    s.interestRate
  FROM
  staking_users su
  INNER JOIN
  stakings s ON su.staking_id = s.id
 
`;

    const [data, _] = await sequelize.query(getUserStaking);
    console.log("🚀 ~ data:date_end", data);
    let result = [];
    const currentDate = new Date();
    if (Array.isArray(data) && data.length) {
      for (const iterator of data) {
        const dateObject = new Date(iterator.date_end);
        if (currentDate <= dateObject) {
          result.push({
            staking_user_id: iterator?.id,
            balance_interest:
              (parseFloat(iterator?.balance_hold) *
                parseFloat(iterator?.interestRate)) /
              100,
          });
        }
      }
      console.log("🚀 ~ result-stacking:", result);
      await StakingInterest.bulkCreate(result);
    }
  } catch (error) {
    cabin.error(error);
  }
})();
