var CryptoJS = require("crypto-js");
const key = process.env.SECRET_KEY;
hexo.extend.renderer.register("dmd", "html", function (data, options) {
  return new Promise(function (resolve, reject) {
    // if (key) {
    //   var ciphertext = CryptoJS.AES.encrypt(data.text, key).toString();
    //   resolve(ciphertext);
    // }
    resolve(data.text);
  });
});
