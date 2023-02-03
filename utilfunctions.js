const processhandler = require("./processhandler");
const dotenv = require("dotenv");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");
const jwt = require("jsonwebtoken");
const Users = require("./models/Users");
const Products = require("./models/Products");
const Wishlists = require("./models/Wishlist");

dotenv.config();

const twilio_client = require("twilio")(
  process.env.TWILIO_AID,
  process.env.TWILIO_TOKEN
);

module.exports.voidCheck = (data) => {
  if (data !== undefined && data !== null) {
    return true;
  }
  return false;
};

module.exports.PhoneVerify = async (data) => {
  let response = {};
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  }
  if (!this.voidCheck(data?.phone)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Invalid body format, {phone} missing!",
    };
  }
  await twilio_client?.verify
    ?.services(process.env.TWILIO_SID)
    ?.verifications?.create({
      to: data?.phone,
      channel: "sms",
    })
    .then((res) => {
      response = {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          status: res?.status,
          to: res?.to,
        },
        msg: "Process completed successfully!",
      };
    })
    .catch((err) => {
      response = {
        ...processhandler?.returnJSONfailure,
        msg: `Process failed with status code ${err?.status}!`,
      };
    });
  return response;
};

module.exports.OTPVerify = async (data) => {
  let response = {};
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  }
  if (!this.voidCheck(data?.phone) && !this.voidCheck(data?.otp)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Invalid body format, {phone} and {otp} missing!",
    };
  }
  if (!this.voidCheck(data?.phone)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Invalid body format, {phone} missing!",
    };
  }
  if (!this.voidCheck(data?.otp)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Invalid body format, {otp} missing!",
    };
  }
  await twilio_client?.verify
    ?.services(process.env.TWILIO_SID)
    ?.verificationChecks?.create({
      to: data?.phone,
      code: data?.otp,
    })
    .then((res) => {
      if (res?.status === "approved") {
        response = {
          ...processhandler?.returnJSONsuccess,
          returnData: {
            status: res?.status,
            to: res?.to,
          },
          msg: "Process completed successfully!",
        };
      } else {
        response = {
          ...processhandler?.returnJSONfailure,
          returnData: {
            status: res?.status,
            to: res?.to,
          },
          msg: "Invalid OTP!",
        };
      }
    })
    .catch((err) => {
      response = {
        ...processhandler?.returnJSONfailure,
        msg: `Process failed with status code ${err?.status}!`,
      };
    });
  return response;
};

module.exports.LoginUserWithPhone = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (!this.voidCheck(data?.phone) || !this.voidCheck(data?.password)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {phone, password}",
    };
  } else {
    let findUser = await Users.findOne({
      phoneNumber: data?.phone,
    });
    if (findUser === null) {
      return {
        ...processhandler?.returnJSONfailure,
        returnData: findUser,
        msg: "User not found",
      };
    } else {
      if (findUser?.password === data?.password) {
        const accessToken = jwt.sign(
          { userId: findUser?._id },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: process.env.JWT_TOKEN_EXP }
        );
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: {
            profileData: {
              id: findUser?._id,
              firstName: findUser?.firstName,
              lastName: findUser?.lastName,
              email: findUser?.email,
              phoneNumber: findUser?.phoneNumber,
              profilePhoto: findUser?.profilePhoto,
            },
            accessToken: accessToken,
          },
          msg: "Logged in successfully",
        };
      } else {
        return {
          ...processhandler?.returnJSONfailure,
          msg: "Invalid password",
        };
      }
    }
  }
};

module.exports.LoginUserWithEmail = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (!this.voidCheck(data?.email)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {email}",
    };
  } else {
    let findUser = await Users.findOne({
      email: data?.email,
    });
    if (findUser === null) {
      return {
        ...processhandler?.returnJSONfailure,
        returnData: findUser,
        msg: "User not found",
      };
    } else {
      const accessToken = jwt.sign(
        { userId: findUser?._id },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_TOKEN_EXP }
      );
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          profileData: {
            id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            phoneNumber: findUser?.phoneNumber,
            profilePhoto: findUser?.profilePhoto,
          },
          accessToken: accessToken,
        },
        msg: "Logged in successfully",
      };
    }
  }
};

module.exports.VerifyToken = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.token)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {token}",
      };
    } else {
      const verifyResponse = jwt.verify(
        data?.token,
        process.env.JWT_SECRET_TOKEN
      );
      if (verifyResponse) {
        const returnResponse = new Promise((resolve, reject) => {
          Users.findById(verifyResponse?.userId, async (err, user) => {
            if (err) {
              resolve({
                ...processhandler?.returnJSONfailure,
                msg: `Error: ${err}`,
              });
            } else {
              resolve({
                ...processhandler?.returnJSONsuccess,
                returnData: {
                  id: user?._id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  email: user?.email,
                  phoneNumber: user?.phoneNumber,
                  profilePhoto: user?.profilePhoto,
                },
                msg: "Verified successfully!",
              });
            }
          });
        });
        return returnResponse;
      }
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.CheckUserPhone = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (!this.voidCheck(data?.phoneNumber)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {phoneNumber}",
    };
  } else {
    let findUser = await Users.findOne({
      phoneNumber: data?.phoneNumber,
    });
    if (findUser === null) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          phoneNumber: data?.phoneNumber,
        },
        msg: "New User",
      };
    } else {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "User already exists!",
      };
    }
  }
};

module.exports.CheckUserEmail = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (
    !this.voidCheck(data?.email) ||
    !this.voidCheck(data?.firstName) ||
    !this.voidCheck(data?.lastName)
  ) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {email, firstName, lastName}",
    };
  } else {
    let findUser = await Users.findOne({
      email: data?.email,
    });
    if (findUser === null) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
        },
        msg: "New User",
      };
    } else {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "User already exists!",
      };
    }
  }
};

module.exports.CreateAccount = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.firstName) ||
      !this.voidCheck(data?.lastName) ||
      !this.voidCheck(data?.phoneNumber) ||
      !this.voidCheck(data?.password) ||
      !this.voidCheck(data?.email)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {firstName, lastName, phoneNumber, password, email}",
      };
    } else {
      const newUser = new Users({
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email === "" ? null : data?.email,
        phoneNumber: data?.phoneNumber,
        password: data?.password,
        profilePhoto: null,
      });
      let result = await newUser.save();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "Account created successfully!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error.message}`,
    };
  }
};

module.exports.TransactionTokenGenerate = async (data) => {
  try {
    let returnResponse = null;
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.mid) ||
      !this.voidCheck(data?.mkey) ||
      !this.voidCheck(data?.oid) ||
      !this.voidCheck(data?.value) ||
      !this.voidCheck(data?.userId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Please check datajson, required keys {mid, mkey, oid, value, userId}",
      };
    } else {
      var paytmParams = {};
      paytmParams.body = {
        requestType: "Payment",
        mid: data?.mid,
        websiteName: process.env.WEBSITE_NAME,
        orderId: data?.oid?.toString(),
        callbackUrl: process.env.PAYTM_CALLBACK_URL,
        txnAmount: {
          value: data?.value?.toString(),
          currency: "INR",
        },
        userInfo: {
          custId: data?.userId,
        },
      };
      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        data?.mkey
      );
      paytmParams.head = {
        signature: checksum,
      };
      var post_data = JSON.stringify(paytmParams);
      const requestAsyncFunc = () => {
        return new Promise((resolve, reject) => {
          var options = {
            hostname: "securegw.paytm.in",
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${data?.mid}&orderId=${data?.oid}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          var response = "";
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              // console.log("Response: ", response);
              resolve(JSON.parse(response).body);
            });
          });

          post_req.write(post_data);
          post_req.end();
        });
      };
      let myResponse = await requestAsyncFunc();
      if (myResponse?.resultInfo?.resultStatus === "F") {
        returnResponse = {
          ...processhandler?.returnJSONfailure,
          returnData: myResponse?.resultInfo?.resultMsg,
          msg: "Something went wrong!",
        };
      } else {
        returnResponse = {
          ...processhandler?.returnJSONsuccess,
          returnData: myResponse,
          msg: "Process completed successfully!",
        };
      }

      return returnResponse;
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      returnData: error?.message,
      msg: "Something went wrong!",
    };
  }
};

module.exports.SaveNewProduct = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.metaHead) ||
      !this.voidCheck(data?.metaDesc) ||
      !this.voidCheck(data?.title) ||
      !this.voidCheck(data?.description) ||
      !this.voidCheck(data?.catagory) ||
      !this.voidCheck(data?.unitValue)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {metaHead, metaDesc, title, description, catagory, unitValue}",
      };
    } else {
      const newProduct = new Products({
        metaHead: data?.metaHead,
        metaDesc: data?.metaDesc,
        title: data?.title,
        description: data?.description,
        catagory: data?.catagory,
        unitValue: data?.unitValue,
        minWeight: data?.minWeight,
        productImage: data?.productImage,
        availableFlavours: data?.availableFlavours?.map((i) => {
          return { flavour: i?.flavour, value: i?.value };
        }),
        customOptions: data?.customOptions?.map((i) => {
          return { option: i?.option, value: i?.value };
        }),
      });
      let result = await newProduct.save();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "New product saved!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.GetAllProducts = async () => {
  const returnArr = await Products.find();
  return {
    ...processhandler?.returnJSONsuccess,
    returnData: returnArr,
    msg: "Process done successfully!",
  };
};

module.exports.GetProductDetails = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.productId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId}",
      };
    } else {
      const returnResponse = new Promise((resolve, reject) => {
        Products.findById(data?.productId, (err, product) => {
          if (err) {
            resolve({
              ...processhandler?.returnJSONfailure,
              msg: `Error: ${err}`,
            });
          } else {
            if (product === null) {
              resolve({
                ...processhandler?.returnJSONfailure,
                msg: `Product not found!`,
              });
            } else {
              resolve({
                ...processhandler?.returnJSONsuccess,
                returnData: product,
                msg: "Data fetched successfully!",
              });
            }
          }
        });
      });
      return returnResponse;
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.AddToWishlist = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId) || !this.voidCheck(data?.itemId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, itemId}",
      };
    } else {
      let findWishlist = await Wishlists.findOne({ userId: data?.userId });
      if (findWishlist === null) {
        const newWishlist = new Wishlists({
          userId: data?.userId,
          wishList: [data?.itemId],
        });
        let result = await newWishlist.save();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result,
          msg: "Item added to wishlist!",
        };
      } else {
        let wishlistArray = findWishlist?.wishList;
        let updatedArray = [...wishlistArray, data?.itemId];
        let result = await Wishlists.updateOne(
          { userId: data?.userId },
          {
            $set: {
              wishList: updatedArray,
            },
          }
        );
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result,
          msg: "Item added to wishlist!",
        };
      }
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.RemoveFromWishlist = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId) || !this.voidCheck(data?.itemId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, itemId}",
      };
    } else {
      let findWishlist = await Wishlists.findOne({ userId: data?.userId });
      if (findWishlist === null) {
        return {
          ...processhandler?.returnJSONfailure,
          msg: "No wishlist found!",
        };
      } else {
        let wishlistArray = findWishlist?.wishList;
        if (wishlistArray?.length === 1) {
          const deletedWishlist = await Wishlists.deleteOne({
            userId: data?.userId,
          });
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: deletedWishlist,
            msg: "Deleted wishlist!",
          };
        } else {
          let updatedArray = wishlistArray.filter((i) => {
            return i !== data?.itemId;
          });
          let result = await Wishlists.updateOne(
            { userId: data?.userId },
            {
              $set: {
                wishList: updatedArray,
              },
            }
          );
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: result,
            msg: "Item removed from wishlist!",
          };
        }
      }
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.GetWishlist = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId}",
      };
    } else {
      const wishlist = await Wishlists.findOne({ userId: data?.userId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: wishlist?.wishList,
        msg: "Wishlist fetched successfully!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};
