const dbUser = require("../app/models");
const HistoryInterest = dbUser.history_interest;
const User = dbUser.user;
const fs = require("fs");
const path = require("path");
const { parentPort } = require("worker_threads");

const Cabin = require("cabin");
const Axe = require("axe");
const { Signale } = require("signale");
const BATCH_SIZE = 100;

// initialize cabin
const logger = new Axe({
  logger: new Signale(),
});
const cabin = new Cabin({ logger });

// store boolean if the job is cancelled

// handle cancellation (this is a very simple example)

// load the queue
const queueFile = path.join(__dirname, "..", "queue.json");
if (!fs.existsSync(queueFile)) {
  cabin.info(`queue file does not exist yet: ${queueFile}`);
  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
}
const removeObjectFromQueue = async (queue, userid) => {
  const updatedQueue = queue.filter((item) => item.user_id !== userid);
  return updatedQueue;
};
async function updateRecordsInBatches(records) {
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }
}

async function processBatch(records) {
  for (const record of records) {
    try {
      const userDetail = await User.findByPk(record.user_id);
      if (userDetail) {
        await userDetail.update({
          balance:
            parseFloat(userDetail.balance) + parseFloat(record.additional_fee),
        });

        // send the create noty
        console.log(
          "🚀 ~ records.forEach ~ parseFloat(userDetail.balance) + parseFloat(record.additional_fee):",
          record.user_id,
          parseFloat(userDetail.balance) + parseFloat(record.additional_fee)
        );
        await HistoryInterest.create({
          user_id: record.user_id,
          additional_fee: parseFloat(record.additional_fee),
          percent_interest: parseFloat(record.percent_interest),
          balance_after: parseFloat(record.balance_after),
        });
        // userDetail.save();
        // flush the queue of this message
      } else {
        cabin.log("Record not found");
      }
    } catch (err) {
      console.log("🚀 ~ queue.forEach ~ err:", err);
      // cabin.error(err);
    }
  }
}
(async () => {
  let queue = require(queueFile);

  if (Array?.isArray(queue) && queue?.length) {
    await updateRecordsInBatches(queue);
  }
})();
