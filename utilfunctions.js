const processhandler = require("./processhandler");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");
const https = require("https");
const PaytmChecksum = require("paytmchecksum");

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
        returnData: res,
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
      response = {
        ...processhandler?.returnJSONsuccess,
        returnData: res,
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

module.exports.UploadPhotos = async (data) => {
  let response = null;
  try {
    let upload = multer({
      dest: "./media/photos/",
    });
    response = {
      ...processhandler?.returnJSONsuccess,
      returnData: data,
      msg: "Process completed successfully!",
    };
    return response;
  } catch (error) {
    response = {
      ...processhandler?.returnJSONfailure,
      msg: `Process failed : ${error}!`,
    };
    return response;
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
        orderId: data?.oid,
        callbackUrl: "",
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
              console.log("Response: ", response);
              resolve(JSON.parse(response).body);
            });
          });

          post_req.write(post_data);
          post_req.end();
        });
      };
      let myResponse = await requestAsyncFunc();
      returnResponse = {
        ...processhandler?.returnJSONsuccess,
        returnData: myResponse,
        msg: "Process completed successfully!",
      };
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
