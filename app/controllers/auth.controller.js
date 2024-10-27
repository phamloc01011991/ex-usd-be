const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Tạo user mới với mã code 7 kí tự ngẫu nhiên
const generateRandomCode = () => {
  // return Math.random().toString(36).substring(2, 8).toUpperCase();
  let code = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 7;
  // Tạo một chuỗi ngẫu nhiên với độ dài bằng codeLength
  const potentialCode = Array.from(
    { length: codeLength },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
  code = potentialCode;
  return code;
};

const createUniqueCode = async () => {
  let code;
  let existingUser;
  do {
    code = generateRandomCode();
    existingUser = await User.findOne({ where: { referralCode: code } });
  } while (existingUser);
  return code;
};

exports.signup = (req, res) => {
  // Save User to Database

  const transferCode = generateRandomCode();
  const expiresIn = 3 * 365 * 24 * 60 * 60;
  if (!req.body.invitedCode)
    return res.status(500).send({ message: "Must Have Invited Code" });
  User.findOne({
    where: {
      referralCode: req.body.invitedCode,
    },
  })
    .then((result) => {
      if (result) {
        createUniqueCode()
          .then((referralCode) => {
            const ipAddress =
              req?.headers?.["x-forwarded-for"] ||
              req?.socket?.remoteAddress ||
              null;
            User.create({
              phone: req.body.phone,
              email: req.body.email,
              fullName: req.body.fullName,
              securityCode: req.body.securityCode,
              avatar: req.body.avatar || "",
              transferCode: referralCode,
              password: bcrypt.hashSync(req.body.password, 8),
              invitedCode: req.body.invitedCode,
              ipAddress,
              referralCode,
            })
              .then((user) => {
                var token = jwt.sign({ id: user.id }, config.secret, {
                  expiresIn: expiresIn,
                });
                const { password, ...userData } = user.toJSON();
                res.send({ success: true, accessToken: token, data: userData });
                // return{
                //   success: true,
                //   accessToken:token,
                //   data: userData
                // }
                // if (req.body.roles) {
                //   Role.findAll({
                //     where: {
                //       name: {
                //         [Op.or]: req.body.roles
                //       }
                //     }
                //   }).then(roles => {
                //     user.setRoles(roles).then(() => {
                //       res.send({ message: "User registered successfully!" });
                //     });
                //   });
                // } else {
                //   // user role = 1
                //   user.setRoles([1]).then(() => {
                //     res.send({ message: "User registered successfully!" });
                //   });
                // }
              })
              .catch((err) => {
                res.status(500).send({ message: err.message });
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      } else throw new Error("Not Found Referral Code");
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

exports.signin = (req, res) => {
  console.log("🚀 ~ req:", req);
  if (req.body.phone || req.body.email) {
    User.findOne({
      where: {
        ...(req.body.phone
          ? { phone: req.body.phone }
          : req.body.email
          ? { email: req.body.email }
          : {}),
      },
    })
      .then((user) => {
        console.log("🚀 ~ .then ~ user:", user);
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        // if(user.status == 5){
        //   return res.status(404).send({success: false, message: "Tài khoản của bạn đã bị khoá" });
        // }

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 8640000,
        });

        res.status(200).send({
          id: user.id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,

          accessToken: token,
        });
        // user.getRoles().then(roles => {
        //   for (let i = 0; i < roles.length; i++) {
        //     authorities.push("ROLE_" + roles[i].name.toUpperCase());
        //   }
        //   res.status(200).send({
        //     id: user.id,
        //     username: user.username,
        //     email: user.email,
        //     roles: authorities,
        //     accessToken: token
        //   });
        // });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(500).send({ message: "User not found" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    // Lấy id user thông qua token
    const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header Authorization
    // Giải mã token và lấy thông tin từ payload
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.id;
    const { newPassword, oldPassword } = req.body;
    if (newPassword === "") {
      res.status(404).send({ success: false, message: "New Password empty" });
    }
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(userId);

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid old password." });
    }

    // Hash và cập nhật mật khẩu mới
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    res.send({ success: true, message: "Password updated successfully." });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
