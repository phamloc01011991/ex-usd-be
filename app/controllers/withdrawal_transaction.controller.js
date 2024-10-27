const db = require("../../app/models");
const dbAdmin = require("../../admin/models");
const WithdrawalTransaction = db.transaction;
const User = db.user;
const Bank = db.banks_for_users;
const Config = dbAdmin.config;
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const axios = require("axios");
const { generateRandomString } = require("../../helper/string");
exports.new_withdrawal_transaction = async (req, res) => {
  try {
    let { amount } = req.body;
    console.log(req.body);
    const { address } = req.body
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    const user = await User.findOne({ where: { id: userId } });
    const configData = await Config.findAll({});
    //Lấy tỷ giá VND/USD
    const reponse = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const { data } = await reponse;
    const rate = data.rates.VND;
    // const fee = configData[0].dataValues.withdrawal_fee;
    const minWithdrawal = configData[0].dataValues.min_withdrawal;
    const amountDefault = amount;
    // amount = amount - amount * fee / 100
    const amount_vnd = parseInt(amount) * rate;

    if (parseInt(user.balance) < parseInt(amount)) {
      res.status(200).json({ success: false, message: "Số dư không đủ" });
      return;
    }
    if (parseInt(amountDefault) < minWithdrawal) {
      res.status(200).json({
        success: false,
        message: `Bạn phải rút tối thiểu ${minWithdrawal} $`,
      });
      return;
    }

    // Trừ số tiền từ trường balance của người dùng
    await User.decrement("balance", { by: amount, where: { id: userId } });
    //Balance của người dùng sau khi trừ
    // Lấy giá trị balance hiện tại của người dùng sau khi trừ
    const updatedUser = await User.findOne({ where: { id: userId } });
    const balanceNow = updatedUser.balance;
    const transaction = await WithdrawalTransaction.create({
      user_id: userId,
      typeTransaction: "withdrawal",
      amount: amount_vnd,
      amount_usd: amount,
      code: generateRandomString(),
      balanceNow,
      address // Cập nhật giá trị balanceNow trong bảng WithdrawalTransaction
    });
    res.status(200).json({
      success: true,
      message: "Withdrawal transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);

    res.status(200).json({ message: error });
  }
};
