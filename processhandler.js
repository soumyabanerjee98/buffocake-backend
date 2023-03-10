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
    case "get-all-users":
      return utilfunctions?.GetAllUsers();
      break;
    case "update-user-as-admin":
      return utilfunctions?.UpdateUserAsAdmin(data_json);
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
    case "update-product":
      return utilfunctions?.UpdateProduct(data_json);
      break;
    case "delete-product":
      return utilfunctions?.DeleteProduct(data_json);
      break;
    case "add-product-image":
      return utilfunctions?.AddProductImage(data_json);
      break;
    case "edit-product-image":
      return utilfunctions?.UpdateProductImage(data_json);
      break;
    case "delete-product-image":
      return utilfunctions?.DeleteProductImage(data_json);
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
    case "clear-cart":
      return utilfunctions?.ClearCart(data_json);
      break;
    case "create-order":
      return utilfunctions?.CreateOrder(data_json);
      break;
    case "update-order-status":
      return utilfunctions?.UpdateOrderStatus(data_json);
      break;
    case "update-order-substatus":
      return utilfunctions?.UpdateOrderSubStatus(data_json);
      break;
    case "get-all-orders":
      return utilfunctions?.GetAllOrders();
      break;
    case "get-orders":
      return utilfunctions?.GetOrders(data_json);
      break;
    case "create-catagory":
      return utilfunctions?.CreateCatagory(data_json);
      break;
    case "get-catagory":
      return utilfunctions?.GetCatagory();
      break;
    case "update-catagory":
      return utilfunctions?.UpdateCatagory(data_json);
      break;
    case "delete-catagory":
      return utilfunctions?.DeleteCatagory(data_json);
      break;
    case "create-subcatagory":
      return utilfunctions?.CreateSubCatagory(data_json);
      break;
    case "get-subcatagory":
      return utilfunctions?.GetSubCatagory();
      break;
    case "update-subcatagory":
      return utilfunctions?.UpdateSubCatagory(data_json);
      break;
    case "delete-subcatagory":
      return utilfunctions?.DeleteSubCatagory(data_json);
      break;
    case "add-product-catagory":
      return utilfunctions?.AddProductCatagory(data_json);
      break;
    case "edit-product-catagory":
      return utilfunctions?.EditProductCatagory(data_json);
      break;
    case "delete-product-catagory":
      return utilfunctions?.DeleteProductCatagory(data_json);
      break;
    case "add-product-subcatagory":
      return utilfunctions?.AddProductSubCatagory(data_json);
      break;
    case "edit-product-subcatagory":
      return utilfunctions?.EditProductSubCatagory(data_json);
      break;
    case "delete-product-subcatagory":
      return utilfunctions?.DeleteProductSubCatagory(data_json);
      break;
    case "add-product-flavour":
      return utilfunctions?.AddFlavour(data_json);
      break;
    case "delete-product-flavour":
      return utilfunctions?.DeleteFlavour(data_json);
      break;
    case "add-product-custom":
      return utilfunctions?.AddCustom(data_json);
      break;
    case "delete-product-custom":
      return utilfunctions?.DeleteCustom(data_json);
      break;
    case "add-product-weight":
      return utilfunctions?.AddWeight(data_json);
      break;
    case "delete-product-weight":
      return utilfunctions?.DeleteWeight(data_json);
      break;
    case "get-catagory-map":
      return utilfunctions?.GetCatagoryMap(data_json);
      break;
    case "add-catagory-map":
      return utilfunctions?.AddCatagoryMap(data_json);
      break;
    case "remove-catagory-map":
      return utilfunctions?.RemoveCatagoryMap(data_json);
      break;
    case "get-carousel":
      return utilfunctions?.GetCarousel();
      break;
    case "add-carousel":
      return utilfunctions?.AddCarousel(data_json);
      break;
    case "edit-carousel":
      return utilfunctions?.EditCarousel(data_json);
      break;
    case "delete-carousel":
      return utilfunctions?.DeleteCarousel(data_json);
      break;
    case "get-pincodes":
      return utilfunctions?.GetDeliveryPincode();
      break;
    case "add-pincodes":
      return utilfunctions?.UploadPincodes(data_json);
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
