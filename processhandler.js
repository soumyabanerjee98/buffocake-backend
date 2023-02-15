const utilfunctions = require("./utilfunctions");
module.exports.ProcessIdHandler = async (process_id, data_json) => {
  const processIdArray = [
    { key: "phone-verify", value: utilfunctions?.PhoneVerify(data_json) },
    { key: "otp-verify", value: utilfunctions?.OTPVerify(data_json) },
    { key: "verify-login-token", value: utilfunctions?.VerifyToken(data_json) },
    {
      key: "user-login-with-phone",
      value: utilfunctions?.LoginUserWithPhone(data_json),
    },
    {
      key: "user-login-with-email",
      value: utilfunctions?.LoginUserWithEmail(data_json),
    },
    {
      key: "user-phone-check",
      value: utilfunctions?.CheckUserPhone(data_json),
    },
    {
      key: "user-email-check",
      value: utilfunctions?.CheckUserEmail(data_json),
    },
    {
      key: "create-new-account",
      value: utilfunctions?.CreateAccount(data_json),
    },
    { key: "update-user", value: utilfunctions?.UpdateUser(data_json) },
    { key: "change-password", value: utilfunctions?.ChangePassword(data_json) },
    { key: "forgot-password", value: utilfunctions?.ForgotPassword(data_json) },
    { key: "delete-photo", value: utilfunctions?.DeletePhoto(data_json) },
    {
      key: "paytm-transaction-token-generate",
      value: utilfunctions?.TransactionTokenGenerate(data_json),
    },
    {
      key: "paytm-transaction-verify",
      value: utilfunctions?.TransactionVerify(data_json),
    },
    {
      key: "get-all-products",
      value: utilfunctions?.GetAllProducts(data_json),
    },
    {
      key: "save-new-product",
      value: utilfunctions?.SaveNewProduct(data_json),
    },
    {
      key: "get-product-details",
      value: utilfunctions?.GetProductDetails(data_json),
    },
    {
      key: "add-item-to-wishlist",
      value: utilfunctions?.AddToWishlist(data_json),
    },
    {
      key: "remove-item-from-wishlist",
      value: utilfunctions?.RemoveFromWishlist(data_json),
    },
    { key: "get-wishlist", value: utilfunctions?.GetWishlist(data_json) },
    { key: "add-item-to-cart", value: utilfunctions?.AddToCart(data_json) },
    {
      key: "remove-item-from-cart",
      value: utilfunctions?.RemoveFromCart(data_json),
    },
    { key: "get-cart", value: utilfunctions?.GetCart(data_json) },
  ];
  const processFunc = processIdArray.find((i) => {
    return i?.key === process_id;
  });
  if (processFunc) {
    return processFunc.value;
  } else {
    return { ...this.returnJSONfailure, msg: "No Process Id found" };
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
