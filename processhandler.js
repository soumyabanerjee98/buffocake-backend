const utilfunctions = require('./utilfunctions');

module.exports.ProcessIdHandler = async (req_addr, process_id, data_json) => {
    switch (process_id) {
        case 'phone_verify':
            return  utilfunctions?.PhoneVerify(data_json)
            break;
        case 'otp_verify':
            return  utilfunctions?.OTPVerify(data_json)
            break;
        case 'get-own-network-ip':
            return  utilfunctions?.GetOwnNetworkIP(req_addr)
            break;
        case 'get-other-network-ip':
            return  utilfunctions?.GetOtherNetworkIP(data_json)
            break;
        case 'upload-media-photos':
            return utilfunctions?.UploadPhotos(data_json)
            break;
        default:
            return {...this.returnJSONfailure, msg: 'No Process Id found'}
            break;
    }
}

module.exports.returnJSONsuccess = {
    returnCode: true,
    returnData: null,
    msg: null
}

module.exports.returnJSONfailure = {
    returnCode: false,
    returnData: null,
    msg: null
}