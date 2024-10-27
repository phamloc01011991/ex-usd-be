function generateRandomString() {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";

  let randomString = "";
  // Thêm 3 kí tự từ letters vào chuỗi ngẫu nhiên
  for (let i = 0; i < 3; i++) {
    randomString += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // Thêm 7 số từ numbers vào chuỗi ngẫu nhiên
  for (let j = 0; j < 7; j++) {
    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return randomString;
}
module.exports = { generateRandomString };
