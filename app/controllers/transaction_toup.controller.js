const db = require("../../app/models");
const TopupTransaction = db.transaction;
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const axios = require("axios");
const { generateRandomString } = require("../../helper/string");

exports.new_trans_topup = async (req, res) => {
  try {
    const { amount } = req.body;
    const { network } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header Authorization
    // Giải mã token và lấy thông tin từ payload
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    // const checkTransactionTopup = await TopupTransaction.findOne({
    //   where: { user_id: userId, status: "pending" },
    // });

    //Lấy tỷ giá VND/USD
    // const reponse = await axios.get(
    //   "https://api.exchangerate-api.com/v4/latest/USD"
    // );
    // const { data } = await reponse;
    // const rate = data.rates.VND;
    const amountUSDT = amount;

    // Tạo một giao dịch nạp tiền mới
    const transaction = await TopupTransaction.create({
      user_id: userId,
      amount,
      typeTransaction: "toup",
      amount_usd: amountUSDT,
      code: generateRandomString(),
      address: network
    });

    // Tạo một giao dịch mới
    res.status(200).json({
      message: "Top-up transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
