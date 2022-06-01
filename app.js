require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const con = require('./config/db');
const request = require('request');
const { head } = require('request');
const socketIo = require("socket.io");
// dotenv.config({path:'./.env'});


const app = express();



const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

var callbackBody
app.get('/', (req, res) => {
    // console.log(req)
    // console.log(res)
    res.send(callbackBody)
})

app.post('/payment/callback', (req, res) => {
    console.log(req.body)
    callbackBody = req.body
    res.end()
    // console.log(res)
    // res.send('Hi1')
})

app.post('/generateQr', (req, res) => {
    console.log(req.body)
    const uid = req.body.Uid
    const amount = req.body.Amount
    const ref1 = req.body.Ref1;
    headers = {
        'Content-type': 'application/json',
        'authorization': 'Bearer 56d4289a-1161-4f3e-9954-c3d60f290084',
        'resourceOwnerId': 'l747c6fead8c514e63beab1dd05e642057',
        'requestUId': uid,//'mock123456',//TODO: this is mocke UID must be edit later
        'accept-language': 'EN',
    };
    request({
        method: 'POST',
        headers: headers,
        uri: 'https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create',
        body: JSON.stringify({
            "qrType": "PPCS",
            "ppType": "BILLERID",
            "ppId": "211707429983269",
            "amount": amount,
            "ref1": ref1.toUpperCase(),
            "ref2": "REFERENCE2",
            "ref3": "SCB",
            "merchantId": "315794760019179",
            "terminalId": "965874183735859",
            "invoice": "INVOICE",
            "csExtExpiryTime": "60"
        }),
        // json: true
    }, function (error, response, body) {
        if (error) {
            console.log('error', error);
            return { 'status': 500, 'msg': 'server error' };
        }
        const result = JSON.parse(body)
        console.log('response', result)

        // console.log('response', result.data.qrImage)
        res.send(result)
        // res.json({ 'img': response.body.data.qrImage })
        // 
    });
});

app.get('/getslip', (req, res) => {
    console.log(req.body)
    const uid = 'mock123456'
    // const amount = req.body.Amount
    headers = {
        'Content-type': 'application/json',
        'authorization': 'Bearer a5b5621a-ec2d-4e23-9da0-7889475f3588',
        'resourceOwnerId': 'l747c6fead8c514e63beab1dd05e642057',
        'requestUId': uid,//'mock123456',//TODO: this is mocke UID must be edit later
        'accept-language': 'EN',
    };
    request({
        method: 'GET',
        headers: headers,
        uri: 'https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/' + callbackBody.transactionId + '?sendingBank=014',
        // json: true
    }, function (error, response, body) {
        if (error) {
            console.log('error', error);
            return { 'status': 500, 'msg': 'server error' };
        }
        res.json(JSON.parse(body))



    });
});







//Define Routes
// app.use('/',require('./routes/pages'));
// app.use('/auth',require('./routes/auth'));




app.listen('30000', () => {
    console.log('Server started on port 30000');
});