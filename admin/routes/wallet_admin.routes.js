const { authJwt } = require("../middleware");
const controller = require("../../admin/controllers/wallet_admin.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //   create config interest
  app.post(
    "/api/admin/wallet-admin",
    [authJwt.verifyToken],
    controller.create
  );
  //   get config interest
  app.get(
    "/api/admin/wallet-admin",
    controller.listing
  );
  //   update config interest
  app.put(
    "/api/admin/wallet-admin/:id",
    [authJwt.verifyToken],
    controller.update
  );
  //   delete config interest
  app.delete(
    "/api/admin/wallet-admin/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
