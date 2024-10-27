const db = require("../../admin/models");
console.log(db);
const WalletAdmin = db.wallet_admin;

exports.create = async (req, res) => {
  try {
    const create = await WalletAdmin.create({
      ...req.body,
    });
    res.status(200).send({
      message: "Create notify success",
      success: true,
      data: create,
    });
  } catch (error) {
    console.log("🚀 ~ exports.create= ~ error:", error);
    console.log(error);
  }
};

exports.listing = async (req, res) => {
  try {
    const listing = await WalletAdmin.findAll();
    res.status(200).send({
      message: "Listing notify success",
      success: true,
      data: listing,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.detail = async (req, res) => {
  try {
    console.log("🚀 ~ exports.detail= ~ req.params.id:", req.params.id);
    const id = req.params.id;
    const listing = await WalletAdmin.findOne({ where: { id } });
    res.status(200).send({
      message: "Listing notify success",
      success: true,
      data: listing,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { network, adress } = req.body;

  try {
    const update = await WalletAdmin.update(
      {
        network,
        adress
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send({
      message: "Update notify success",
      success: true,
      data: update,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await WalletAdmin.destroy({ where: { id } });

    res.status(200).json({ success: true, message: "Xoá thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
