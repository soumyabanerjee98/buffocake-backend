const utilfunctions = require("./utilfunctions");

module.exports.ProcessIdHandler = async (process_id, data_json) => {
  switch (process_id) {
    case "phone-verify":
      return utilfunctions?.PhoneVerify(data_json);
      break;
    case "otp-verify":
      return utilfunctions?.OTPVerify(data_json);
      break;
    case "verify-login-token":
      return utilfunctions?.VerifyToken(data_json);
      break;
    case "user-login-with-phone":
      return utilfunctions?.LoginUserWithPhone(data_json);
      break;
    case "user-login-with-email":
      return utilfunctions?.LoginUserWithEmail(data_json);
      break;
    case "user-phone-check":
      return utilfunctions?.CheckUserPhone(data_json);
      break;
    case "user-email-check":
      return utilfunctions?.CheckUserEmail(data_json);
      break;
    case "create-new-account":
      return utilfunctions?.CreateAccount(data_json);
      break;
    case "update-user":
      return utilfunctions?.UpdateUser(data_json);
      break;
    case "add-address":
      return utilfunctions?.AddAddress(data_json);
      break;
    case "edit-address":
      return utilfunctions?.EditAddress(data_json);
      break;
    case "remove-address":
      return utilfunctions?.RemoveAddress(data_json);
      break;
    case "get-address":
      return utilfunctions?.GetAddress(data_json);
      break;
    case "change-password":
      return utilfunctions?.ChangePassword(data_json);
      break;
    case "forgot-password":
      return utilfunctions?.ForgotPassword(data_json);
      break;
    case "delete-photo":
      return utilfunctions?.DeletePhoto(data_json);
      break;
    case "paytm-transaction-token-generate":
      return utilfunctions?.TransactionTokenGenerate(data_json);
      break;
    case "paytm-transaction-verify":
      return utilfunctions?.TransactionVerify(data_json);
      break;
    case "get-all-products":
      return utilfunctions?.GetAllProducts();
      break;
    case "save-new-product":
      return utilfunctions?.SaveNewProduct(data_json);
      break;
    case "get-product-details":
      return utilfunctions?.GetProductDetails(data_json);
      break;
    case "add-item-to-wishlist":
      return utilfunctions?.AddToWishlist(data_json);
      break;
    case "remove-item-from-wishlist":
      return utilfunctions?.RemoveFromWishlist(data_json);
      break;
    case "get-wishlist":
      return utilfunctions?.GetWishlist(data_json);
      break;
    case "add-item-to-cart":
      return utilfunctions?.AddToCart(data_json);
      break;
    case "remove-item-from-cart":
      return utilfunctions?.RemoveFromCart(data_json);
      break;
    case "get-cart":
      return utilfunctions?.GetCart(data_json);
      break;
    default:
      return { ...this.returnJSONfailure, msg: "No Process Id found" };
      break;
  }
};

module.exports.returnJSONsuccess = {
  returnCode: true,
  returnData: null,
  msg: null,
};

module.exports.returnJSONfailure = {
  returnCode: false,
  returnData: null,
  msg: null,
};
