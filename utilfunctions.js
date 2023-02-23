const processhandler = require("./processhandler");
const dotenv = require("dotenv");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");
const jwt = require("jsonwebtoken");
const Users = require("./models/Users");
const Products = require("./models/Products");
const Wishlists = require("./models/Wishlist");
const { unlink } = require("fs/promises");
const Carts = require("./models/Carts");
const Address = require("./models/Address");
const Orders = require("./models/Orders");
const Catagory = require("./models/Catagory");
const Subcatagory = require("./models/Subcatagory");

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
              admin: findUser?.admin,
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
            admin: findUser?.admin,
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
              if (user) {
                resolve({
                  ...processhandler?.returnJSONsuccess,
                  returnData: {
                    id: user?._id,
                    admin: user?.admin,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    phoneNumber: user?.phoneNumber,
                    profilePhoto: user?.profilePhoto,
                  },
                  msg: "Verified successfully!",
                });
              } else {
                resolve({
                  ...processhandler?.returnJSONfailure,
                  msg: `User not found!`,
                });
              }
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
      const accessToken = jwt.sign(
        { userId: result?._id },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_TOKEN_EXP }
      );
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          profileData: {
            id: result?._id,
            admin: result?.admin,
            firstName: result?.firstName,
            lastName: result?.lastName,
            email: result?.email,
            phoneNumber: result?.phoneNumber,
            profilePhoto: result?.profilePhoto,
          },
          accessToken: accessToken,
        },
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

module.exports.UpdateUser = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.id) ||
      !this.voidCheck(data?.firstName) ||
      !this.voidCheck(data?.lastName) ||
      !this.voidCheck(data?.phoneNumber) ||
      !this.voidCheck(data?.email)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {id, firstName, lastName, phoneNumber, email}",
      };
    } else {
      let result = await Users.updateOne(
        { _id: data?.id },
        {
          $set: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            phoneNumber: data?.phoneNumber,
            email: data?.email,
            profilePhoto: data?.profilePhoto,
          },
        }
      );
      let profile = await Users.findOne({ _id: data?.id });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: {
          result: result,
          profile: {
            id: profile?._id,
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            email: profile?.email,
            phoneNumber: profile?.phoneNumber,
            profilePhoto: profile?.profilePhoto,
          },
        },
        msg: "User updated!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.AddAddress = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.receiverName) ||
      !this.voidCheck(data?.receiverContact) ||
      !this.voidCheck(data?.house) ||
      !this.voidCheck(data?.street) ||
      !this.voidCheck(data?.pin) ||
      !this.voidCheck(data?.favorite)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, receiverName, receiverContact, house, street, pin, favorite}",
      };
    } else {
      let findAddress = await Address.findOne({ userId: data?.userId });
      if (findAddress) {
        const asyncAddFunc = () => {
          return new Promise(async (resolve, reject) => {
            if (data?.favorite) {
              await Address.updateOne(
                {
                  userId: data?.userId,
                  address: { $elemMatch: { favorite: true } },
                },
                {
                  $set: {
                    "address.$.favorite": false,
                  },
                }
              );
            }
            await Address.updateOne(
              { userId: data?.userId },
              {
                $push: {
                  address: {
                    receiverName: data?.receiverName,
                    receiverContact: data?.receiverContact,
                    house: data?.house,
                    street: data?.street,
                    pin: data?.pin,
                    favorite: data?.favorite,
                  },
                },
              }
            );
            let result = await Address.findOne({ userId: data?.userId });
            resolve(result?.address);
          });
        };
        let response = await asyncAddFunc();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: response,
          msg: "Address added!",
        };
      } else {
        const newAddress = new Address({
          userId: data?.userId,
          address: [
            {
              receiverName: data?.receiverName,
              receiverContact: data?.receiverContact,
              house: data?.house,
              street: data?.street,
              pin: data?.pin,
              favorite: data?.favorite,
            },
          ],
        });
        let result = await newAddress.save();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result?.address,
          msg: "Address added!",
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

module.exports.EditAddress = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.addressId) ||
      !this.voidCheck(data?.receiverName) ||
      !this.voidCheck(data?.receiverContact) ||
      !this.voidCheck(data?.house) ||
      !this.voidCheck(data?.street) ||
      !this.voidCheck(data?.pin) ||
      !this.voidCheck(data?.favorite)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, addressId, receiverName, receiverContact, house, street, pin, favorite}",
      };
    } else {
      let findAddress = await Address.findOne({ userId: data?.userId });
      if (findAddress) {
        const asyncEditFunc = () => {
          return new Promise(async (resolve, reject) => {
            if (data?.favorite) {
              await Address.updateOne(
                {
                  userId: data?.userId,
                  address: { $elemMatch: { favorite: true } },
                },
                {
                  $set: {
                    "address.$.favorite": false,
                  },
                }
              );
            }
            await Address.updateOne(
              {
                userId: data?.userId,
                address: { $elemMatch: { _id: data?.addressId } },
              },
              {
                $set: {
                  "address.$.receiverName": data?.receiverName,
                  "address.$.receiverContact": data?.receiverContact,
                  "address.$.house": data?.house,
                  "address.$.street": data?.street,
                  "address.$.pin": data?.pin,
                  "address.$.favorite": data?.favorite,
                },
              }
            );
            let result = await Address.findOne({ userId: data?.userId });
            resolve(result?.address);
          });
        };
        let response = await asyncEditFunc();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: response,
          msg: "Address updated!",
        };
      } else {
        return {
          ...processhandler?.returnJSONfailure,
          msg: "Address not found!",
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

module.exports.RemoveAddress = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.addressId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, addressId}",
      };
    } else {
      let findAddress = await Address.findOne({ userId: data?.userId });
      if (findAddress?.address?.length === 1) {
        await Address.deleteOne({ userId: data?.userId });
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: [],
          msg: "Address removed!",
        };
      } else {
        await Address.updateOne(
          { userId: data?.userId },
          {
            $pull: {
              address: { _id: data?.addressId },
            },
          }
        );
        let address = await Address.findOne({ userId: data?.userId });
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: address?.address,
          msg: "Address removed!",
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

module.exports.GetAddress = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (!this.voidCheck(data?.userId)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {userId}",
    };
  } else {
    let address = await Address.findOne({ userId: data?.userId });
    if (address) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: address?.address,
        msg: "Address fetched successfully!",
      };
    } else {
      return {
        ...processhandler?.returnJSONsuccess,
        msg: "No address found!",
      };
    }
  }
};

module.exports.ChangePassword = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (
    !this.voidCheck(data?.id) ||
    !this.voidCheck(data?.oldPass) ||
    !this.voidCheck(data?.newPass)
  ) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {id, oldPass, newPass}",
    };
  } else {
    let user = await Users.findById(data?.id);
    if (user?.password === data?.oldPass) {
      let result = await Users.updateOne(
        { _id: data?.id },
        {
          $set: {
            password: data?.newPass,
          },
        }
      );
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "Password updated!",
      };
    } else {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Invalid Password!",
      };
    }
  }
};

module.exports.ForgotPassword = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (
    !this.voidCheck(data?.phoneNumber) ||
    !this.voidCheck(data?.newPass)
  ) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {phoneNumber, newPass}",
    };
  } else {
    let result = await Users.updateOne(
      { phoneNumber: data?.phoneNumber },
      {
        $set: {
          password: data?.newPass,
        },
      }
    );
    return {
      ...processhandler?.returnJSONsuccess,
      returnData: result,
      msg: "Password updated!",
    };
  }
};

module.exports.DeletePhoto = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.mediaPath)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {mediaPath}",
      };
    }
    let result = await unlink(__dirname + "/media/photos/" + data?.mediaPath);
    return {
      ...processhandler?.returnJSONsuccess,
      returnData: result,
      msg: `Successfully deleted ${data?.mediaPath}`,
    };
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
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
      let paytmParams = {};
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
      let post_data = JSON.stringify(paytmParams);
      const requestAsyncFunc = () => {
        return new Promise((resolve, reject) => {
          let options = {
            hostname: process.env.PAYTM_HOST,
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${data?.mid}&orderId=${data?.oid}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          let response = "";
          let post_req = https.request(options, function (post_res) {
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

module.exports.TransactionVerify = async (data) => {
  try {
    let returnResponse = null;
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.mid) ||
      !this.voidCheck(data?.oid) ||
      !this.voidCheck(data?.mkey)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Please check datajson, required keys {mid, oid, mkey}",
      };
    } else {
      let paytmParams = {};
      paytmParams.body = {
        mid: data?.mid,
        orderId: data?.oid,
      };
      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        data?.mkey
      );
      paytmParams.head = {
        signature: checksum,
      };
      let post_data = JSON.stringify(paytmParams);
      const requestAsyncFunc = () => {
        return new Promise((resolve, reject) => {
          let options = {
            hostname: process.env.PAYTM_HOST,
            port: 443,
            path: "/v3/order/status",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };

          let response = "";
          let post_req = https.request(options, function (post_res) {
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
      returnResponse = myResponse;
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: returnResponse,
        msg: "Process completed successfully!",
      };
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
      !this.voidCheck(data?.catagoryArr) ||
      !this.voidCheck(data?.subCatagoryArr) ||
      !this.voidCheck(data?.unitValue)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {metaHead, metaDesc, title, description, catagoryArr, subCatagoryArr, unitValue}",
      };
    } else {
      const newProduct = new Products({
        metaHead: data?.metaHead,
        metaDesc: data?.metaDesc,
        title: data?.title,
        description: data?.description,
        catagory: data?.catagoryArr?.map((i) => {
          return { catagoryId: i?.value, catagoryName: i?.label };
        }),
        subCatagory: data?.subCatagoryArr?.map((i) => {
          return { subCatagoryId: i?.value, subCatagoryName: i?.label };
        }),
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
      await newProduct.save();
      let result = await Products.find();
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

module.exports.UpdateProduct = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.metaHead) ||
      !this.voidCheck(data?.metaDesc) ||
      !this.voidCheck(data?.title) ||
      !this.voidCheck(data?.description) ||
      !this.voidCheck(data?.unitValue) ||
      !this.voidCheck(data?.minWeight)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, metaHead, metaDesc, title, description, unitValue, minWeight}",
      };
    } else {
      await Products.updateOne(
        { _id: data?.productId },
        {
          $set: {
            metaHead: data?.metaHead,
            metaDesc: data?.metaDesc,
            title: data?.title,
            description: data?.description,
            unitValue: data?.unitValue,
            minWeight: data?.minWeight,
            productImage: data?.productImage,
          },
        }
      );

      let result = await Products.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "Product updated!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.DeleteProduct = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.productId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId}",
      };
    } else {
      await Products.deleteOne({ _id: data?.productId });

      let result = await Products.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "Product deleted!",
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
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.productId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, productId}",
      };
    } else {
      let findWishlist = await Wishlists.findOne({ userId: data?.userId });
      let itemDetails = await Products.findById(data?.productId);
      if (findWishlist === null) {
        const newWishlist = new Wishlists({
          userId: data?.userId,
          wishList: [
            {
              productId: itemDetails?._id,
              productTitle: itemDetails?.title,
              productImage: itemDetails?.productImage,
            },
          ],
        });
        let result = await newWishlist.save();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result?.wishList,
          msg: "Item added to wishlist!",
        };
      } else {
        await Wishlists.updateOne(
          { userId: data?.userId },
          {
            $push: {
              wishList: {
                productId: itemDetails?._id,
                productTitle: itemDetails?.title,
                productImage: itemDetails?.productImage,
              },
            },
          }
        );
        let result = await Wishlists.findOne({ userId: data?.userId });
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result?.wishList,
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
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.productId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, productId}",
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
          await Wishlists.deleteOne({
            userId: data?.userId,
          });
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: [],
            msg: "Deleted wishlist!",
          };
        } else {
          await Wishlists.updateOne(
            { userId: data?.userId },
            {
              $pull: {
                wishList: { productId: data?.productId },
              },
            }
          );
          let result = await Wishlists.findOne({
            userId: data?.userId,
          });
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: result?.wishList,
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
      if (wishlist) {
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: wishlist?.wishList,
          msg: "Wishlist fetched successfully!",
        };
      } else {
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: null,
          msg: "No wishlist found!",
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

module.exports.AddToCart = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.qty) ||
      !this.voidCheck(data?.weight) ||
      !this.voidCheck(data?.flavour) ||
      !this.voidCheck(data?.custom) ||
      !this.voidCheck(data?.message) ||
      !this.voidCheck(data?.allergy) ||
      !this.voidCheck(data?.delDate) ||
      !this.voidCheck(data?.delTime) ||
      !this.voidCheck(data?.subTotal)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, productId, qty, weight, flavour, custom, message, allergy, delDate, delTime, subTotal}",
      };
    } else {
      let product = await Products.findById(data?.productId);
      const cart = await Carts.findOne({ userId: data?.userId });
      if (cart) {
        await Carts.updateOne(
          { userId: data?.userId },
          {
            $push: {
              cart: {
                productId: data?.productId,
                productName: product?.title,
                productImage: product?.productImage,
                qty: data?.qty,
                weight: data?.weight,
                flavour: data?.flavour,
                custom: data?.custom,
                message: data?.message,
                allergy: data?.allergy,
                delDate: data?.delDate,
                delTime: data?.delTime,
                subTotal: data?.subTotal,
              },
            },
          }
        );
        const updatedCart = await Carts.findOne({ userId: data?.userId });
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: updatedCart?.cart,
          msg: "Item added to cart!",
        };
      } else {
        const newCart = new Carts({
          userId: data?.userId,
          cart: [
            {
              productId: data?.productId,
              productName: product?.title,
              productImage: product?.productImage,
              qty: data?.qty,
              weight: data?.weight,
              flavour: data?.flavour,
              custom: data?.custom,
              message: data?.message,
              allergy: data?.allergy,
              delDate: data?.delDate,
              delTime: data?.delTime,
              subTotal: data?.subTotal,
            },
          ],
        });
        let result = await newCart.save();
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: result?.cart,
          msg: "Item added to cart!",
        };
      }
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error.message}`,
    };
  }
};

module.exports.RemoveFromCart = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId) || !this.voidCheck(data?.cartId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, cartId}",
      };
    } else {
      let findCart = await Carts.findOne({ userId: data?.userId });
      if (findCart === null) {
        return {
          ...processhandler?.returnJSONfailure,
          msg: "No Cart found!",
        };
      } else {
        let cartArray = findCart?.cart;
        if (cartArray?.length === 1) {
          await Carts.deleteOne({
            userId: data?.userId,
          });
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: [],
            msg: "Deleted cart!",
          };
        } else {
          await Carts.updateOne(
            { userId: data?.userId },
            {
              $pull: {
                cart: { _id: data?.cartId },
              },
            }
          );
          let result = await Carts.findOne({
            userId: data?.userId,
          });
          return {
            ...processhandler?.returnJSONsuccess,
            returnData: result?.cart,
            msg: "Item removed from cart!",
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

module.exports.ClearCart = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId}",
      };
    } else {
      await Carts.deleteOne({
        userId: data?.userId,
      });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: [],
        msg: "Deleted cart!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.GetCart = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.userId)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId}",
      };
    } else {
      const cart = await Carts.findOne({ userId: data?.userId });
      if (cart) {
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: cart?.cart,
          msg: "Cart fetched successfully!",
        };
      } else {
        return {
          ...processhandler?.returnJSONsuccess,
          returnData: null,
          msg: "No cart found!",
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

module.exports.CreateOrder = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.userId) ||
      !this.voidCheck(data?.oid) ||
      !this.voidCheck(data?.txnId) ||
      !this.voidCheck(data?.items) ||
      !this.voidCheck(data?.shippingAddress) ||
      !this.voidCheck(data?.total) ||
      !this.voidCheck(data?.paymentStatus) ||
      !this.voidCheck(data?.orderStatus) ||
      !this.voidCheck(data?.orderTimeStamp)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {userId, oid, txnId, items, shippingAddress, total, paymentStatus, orderStatus, orderTimeStamp}",
      };
    } else {
      const newOrder = new Orders({
        userId: data?.userId,
        orderId: data?.oid,
        txnId: data?.txnId,
        items: data?.items,
        shippingAddress: data?.shippingAddress,
        total: data?.total,
        paymentStatus: data?.paymentStatus,
        orderStatus: data?.orderStatus,
        orderTimeStamp: data?.orderTimeStamp,
      });
      await newOrder.save();
      let result = await Orders.find({ userId: data?.userId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: "Order created successfully!",
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error}`,
    };
  }
};

module.exports.UpdateOrder = async (data) => {};

module.exports.GetOrders = async (data) => {
  if (!this.voidCheck(data)) {
    return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
  } else if (!this.voidCheck(data?.userId)) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: "Missing keys: {userId}",
    };
  } else {
    let orders = await Orders.find({ userId: data?.userId });
    if (orders) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: orders,
        msg: "Orders fetched successfully!",
      };
    } else {
      return {
        ...processhandler?.returnJSONsuccess,
        msg: "No orders found!",
      };
    }
  }
};

module.exports.CreateCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.label)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {label}",
      };
    } else {
      const newCatagory = new Catagory({
        catagory: data?.label,
      });
      await newCatagory.save();
      let result = await Catagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Catagory created`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.GetCatagory = async () => {
  try {
    let result = await Catagory.find();
    if (result) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Catagories fetched!`,
      };
    } else {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: [],
        msg: `No catagories in DB`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.UpdateCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.label) || !this.voidCheck(data?.value)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {label, value}",
      };
    } else {
      const findCatagory = await Catagory.findById(data?.value);
      await findCatagory.updateOne({ $set: { catagory: data?.label } });
      const result = await Catagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Catagory updated!`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.DeleteCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.value)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {value}",
      };
    } else {
      const findCatagory = await Catagory.findById(data?.value);
      await findCatagory.deleteOne();
      const result = await Catagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Catagory deleted!`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.CreateSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.label)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {label}",
      };
    } else {
      const newSubCatagory = new Subcatagory({
        subCatagory: data?.label,
      });
      await newSubCatagory.save();
      let result = await Subcatagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Sub Catagory created`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.GetSubCatagory = async () => {
  try {
    let result = await Subcatagory.find();
    if (result) {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Sub catagories fetched!`,
      };
    } else {
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: [],
        msg: `No sub catagories in DB`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.UpdateSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.label) || !this.voidCheck(data?.value)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {label, value}",
      };
    } else {
      const findSubCatagory = await Subcatagory.findById(data?.value);
      await findSubCatagory.updateOne({ $set: { subCatagory: data?.label } });
      const result = await Subcatagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Sub Catagory updated!`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.DeleteSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (!this.voidCheck(data?.value)) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {value}",
      };
    } else {
      const findSubCatagory = await Subcatagory.findById(data?.value);
      await findSubCatagory.deleteOne();
      const result = await Subcatagory.find();
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Sub catagory deleted!`,
      };
    }
  } catch (error) {
    return {
      ...processhandler?.returnJSONfailure,
      msg: `Error: ${error?.message}`,
    };
  }
};

module.exports.AddProductCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.label) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, label, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        {
          $push: {
            catagory: { catagoryId: data?.value, catagoryName: data?.label },
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product catagory added!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.EditProductCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.catagoryId) ||
      !this.voidCheck(data?.label) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, catagoryId, label, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
          catagory: { $elemMatch: { _id: data?.catagoryId } },
        },
        {
          $set: {
            "catagory.$.catagoryId": data?.value,
            "catagory.$.catagoryName": data?.label,
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product catagory updated!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.DeleteProductCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.catagoryId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, catagoryId}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        { $pull: { catagory: { _id: data?.catagoryId } } }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product catagory deleted!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.AddProductSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.label) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, label, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        {
          $push: {
            subCatagory: {
              subCatagoryId: data?.value,
              subCatagoryName: data?.label,
            },
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product sub catagory added!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.EditProductSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.subCatagoryId) ||
      !this.voidCheck(data?.label) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, subCatagoryId, label, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
          subCatagory: { $elemMatch: { _id: data?.subCatagoryId } },
        },
        {
          $set: {
            "catagory.$.subCatagoryId": data?.value,
            "catagory.$.subCatagoryName": data?.label,
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product sub catagory updated!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.DeleteProductSubCatagory = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.subCatagoryId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, subCatagoryId}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        { $pull: { subCatagory: { _id: data?.subCatagoryId } } }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product sub catagory deleted!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.AddFlavour = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.flavour) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, flavour, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        {
          $push: {
            availableFlavours: {
              flavour: data?.flavour,
              value: data?.value,
            },
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product flavour added!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.DeleteFlavour = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.flavourId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, flavourId}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        { $pull: { availableFlavours: { _id: data?.flavourId } } }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product flavour deleted!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.AddCustom = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.option) ||
      !this.voidCheck(data?.value)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, option, value}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        {
          $push: {
            customOptions: {
              option: data?.option,
              value: data?.value,
            },
          },
        }
      );
      let result = await Products.findOne({ _id: data?.productId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product customization added!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};

module.exports.DeleteCustom = async (data) => {
  try {
    if (!this.voidCheck(data)) {
      return { ...processhandler?.returnJSONfailure, msg: "Invalid body" };
    } else if (
      !this.voidCheck(data?.productId) ||
      !this.voidCheck(data?.customId)
    ) {
      return {
        ...processhandler?.returnJSONfailure,
        msg: "Missing keys: {productId, customId}",
      };
    } else {
      await Products.updateOne(
        {
          _id: data?.productId,
        },
        { $pull: { customOptions: { _id: data?.flavourId } } }
      );
      let result = await Products.findOne({ _id: data?.customId });
      return {
        ...processhandler?.returnJSONsuccess,
        returnData: result,
        msg: `Product flavour deleted!`,
      };
    }
  } catch (error) {
    return { ...processhandler?.returnJSONfailure, msg: `Error: ${error}` };
  }
};
