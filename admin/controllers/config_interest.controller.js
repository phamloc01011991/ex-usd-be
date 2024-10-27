const db = require("../models");
const ConfigInterest = db.config_interest;
exports.create = async (req, res) => {
  try {
    const { value, percent } = req.body;

    const data = await ConfigInterest.create({
      value,
      percent,
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.listing = async (req, res) => {
  try {
    const data = await ConfigInterest.findAll();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { value, percent } = req.body;
    const data = await ConfigInterest.update(
      {
        value,
        percent,
      },
      {
        where: {
          id,
        },
      }
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await ConfigInterest.destroy({ where: { id } });

    res.status(200).json({ success: true, message: "Xoá bank thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
