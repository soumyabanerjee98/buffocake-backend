const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const processhandler = require('./processhandler');
const utilfunctions = require('./utilfunctions');

const app = express();
dotenv.config();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    let json = {}
    if(!utilfunctions?.voidCheck(req?.body?.processId)){
        json = {...processhandler?.returnJSONfailure, msg: 'Invalid request format, Process ID missing!'}
    }
    else{
        json = await processhandler?.ProcessIdHandler(req?.body?.processId, req?.body?.datajson)
    }
    res?.send(json)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});