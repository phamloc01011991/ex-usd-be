const Bree = require("bree");
const Graceful = require("@ladjs/graceful");

const bree = new Bree({
  logger: false,
  jobs: [
    {
      name: "schedule-check-user",
      cron: "58 23 * * *",
      timezone: "Asia/Ho_Chi_Minh",
    },
    {
      name: "schedule-add-balance",
      cron: "01 00 * * *",
      timezone: "Asia/Ho_Chi_Minh",
    },
    {
      name: "schedule-add-stacking",
      cron: "00 01 * * *",
      timezone: "Asia/Ho_Chi_Minh",
    },
    {
      name: "schedule-tracking-balance",
      cron: "00 02 * * *",
      timezone: "Asia/Ho_Chi_Minh",
    },
  ],
});

bree.start();

const graceful = new Graceful({ brees: [bree] });
graceful.listen();
