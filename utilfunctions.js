const processhandler = require('./processhandler');
const dotenv = require('dotenv');
const IP = require('ip');
const axios = require('axios');
const multer  = require('multer')

dotenv.config();

const twilio_client = require('twilio')(process.env.TWILIO_AID, process.env.TWILIO_TOKEN)

module.exports.voidCheck = (data) => {
    if(data !== undefined && data !== null){
        return true;
    }
    return false;
}

module.exports.PhoneVerify = async (data) => {
    let response = {}
    if(!this.voidCheck(data)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body'}
    }
    if(!this.voidCheck(data?.phone)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body format, Phone number missing!'}
    }    
    await twilio_client?.verify?.services(process.env.TWILIO_SID)?.verifications?.create({
        to: data?.phone,
        channel: 'sms'
    }).then((res) => {
        response = {...processhandler?.returnJSONsuccess, returnData: res, msg: 'Process completed successfully!'}
    }).catch((err) => {
        response = {...processhandler?.returnJSONfailure, msg: `Process failed with status code ${err?.status}!`}
    })
    return response
    
} 

module.exports.OTPVerify = async (data) => {
    let response = {}
    if(!this.voidCheck(data)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body'}
    }
    if(!this.voidCheck(data?.phone) && !this.voidCheck(data?.otp)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body format, Phone number and OTP missing!'}
    }
    if(!this.voidCheck(data?.phone)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body format, Phone number missing!'}
    }
    if(!this.voidCheck(data?.otp)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body format, OTP missing!'}
    }
    await twilio_client?.verify?.services(process.env.TWILIO_SID)?.verificationChecks?.create({
        to: data?.phone,
        code: data?.otp
    }).then((res) => {
        response = {...processhandler?.returnJSONsuccess, returnData: res, msg: 'Process completed successfully!'}
    }).catch((err) => {
        response = {...processhandler?.returnJSONfailure, msg: `Process failed with status code ${err?.status}!`}
    })
    return response
} 

module.exports.GetDeviceNetworkIP = async () => {
    let ip = IP?.address('public', 'ipv4');
    return {...processhandler?.returnJSONsuccess, returnData: ip, msg: 'Process completed successfully!'}
}

module.exports.GetDeviceNetworkLocation = async (data) => {
    let response = null;
    const header = {
        method: 'GET',
        url: `http://ip-api.com/json/${data?.ip}?fields=94207` //https://ip-api.com/
    }
    if(!this.voidCheck(data?.ip)){
        return {...processhandler?.returnJSONfailure, msg: 'Invalid body format, IP missing!'}
    }
    await axios(header)
    .then((res) => {
        response = {...processhandler?.returnJSONsuccess, returnData: res?.data, msg: 'Process completed successfully!'}
    })
    .catch((err) => {
        response = {...processhandler?.returnJSONfailure, msg: `Process failed : ${err}!`}
    })
    return response
}

module.exports.UploadPhotos = async (data) => {
    let response = null;
    try {
        let upload = multer({
            dest: './media/photos/'
        })
        response = {...processhandler?.returnJSONsuccess, returnData: data, msg: 'Process completed successfully!'}
        return response
    } catch (error) {
        response = {...processhandler?.returnJSONfailure, msg: `Process failed : ${error}!`}
        return response
    }
}