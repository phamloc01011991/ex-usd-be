const db = require("../admin/models");
const dbUser = require("../app/models");
const ConfigInterest = db.config_interest;
const User = dbUser.user;
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { parentPort } = require("worker_threads");

const Cabin = require("cabin");
const Axe = require("axe");
const { Signale } = require("signale");
const crypto = require("crypto");
// initialize cabin
const logger = new Axe({
  logger: new Signale(),
});
const cabin = new Cabin({ logger });

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once("message", (message) => {
    if (message === "cancel") isCancelled = true;
  });

// load the queue
const queueFile = path.join(__dirname, "..", "queue.json");
if (!fs.existsSync(queueFile)) {
  cabin.info(`queue file does not exist yet: ${queueFile}`);
  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
}

function isBalanceValid(arr, naturalNumber) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return false;
  }
  const sortedArray = arr
    .map((item) => item.value)
    .slice()
    .sort((a, b) => a - b);

  const smallerOrEqual = sortedArray.reduce((acc, num) => {
    return num <= naturalNumber ? num : acc;
  }, null);

  // const largerOrEqual = sortedArray.reduce((acc, num) => {
  //   return num >= naturalNumber && (acc === null || num < acc) ? num : acc;
  // }, null);

  if (smallerOrEqual !== null)
    return arr.find((item) => item.value === smallerOrEqual);
  else return false;
}

(async () => {
  try {
    const dataConfig = await ConfigInterest.findAll();
    const { data: dataRate } = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const rate = dataRate.rates.VND;

    const allUsers = await User.findAll({
      attributes: ["id", "balance"],
    });
    let dataAfterCheckBalance = [];
    for (let index = 0; index < allUsers.length; index++) {
      const validConfig = isBalanceValid(
        dataConfig,
        parseInt(parseFloat(allUsers[index].balance) * rate)
      );
      if (validConfig) {
        const additional_fee =
          (parseFloat(allUsers[index].balance) *
            parseFloat(validConfig.percent)) /
          100;
        dataAfterCheckBalance.push({
          user_id: allUsers[index].id,
          additional_fee,
          percent_interest: parseFloat(validConfig.percent),
          balance_after:
            parseFloat(allUsers[index].balance) + parseFloat(additional_fee),
        });
      }
    }

    let queue = [];

    dataAfterCheckBalance.map((result, index) => {
      queue.push({
        ...result,
        index: `${index}`,
      });
      // if it's before the time we need to send the message then return early
      // if (Date.now() < new Date(result.send_at).getTime()) {
      //   cabin.info("It it not time yet to send message", { result });
      //   return;
      // }

      // send the email

      // flush the queue of this message
      // try {
      //   const currentQueue = require(queueFile);
      //   const index = currentQueue.findIndex((r) => r.id === result.id);
      //   if (index === -1) return;
      //   delete currentQueue[index];
      //   await fs.promises.writeFile(
      //     queueFile,
      //     JSON.stringify(currentQueue.filter(Boolean))
      //   );
      // } catch (err) {
      //   cabin.error(err);
      // }
    });

    await fs.promises.writeFile(queueFile, JSON.stringify(queue));
  } catch (error) {
    cabin.error(error);
  }

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
