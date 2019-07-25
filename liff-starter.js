const express = require('express')
const request = require('request')
const app = express();

window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

function initializeApp(data) {
    
  // openSCB call
  document.getElementById('OKbutton').addEventListener('click', async function () {
      var token = await getAccessToken()
      console.log(token)
      var deepLink = await getDeepLink(token, 999)
      console.log(deepLink)
    liff.openWindow({
            url:deepLink,
            external:true
    });
});

    // closeWindow call
    document.getElementById('Cancelbutton').addEventListener('click', function () {
        liff.closeWindow();
    });


}
  
  async function getAccessToken() {
    return new Promise(
      (resolve, reject) => {
        request.post('https://api.partners.scb/partners/sandbox/v1/oauth/token', {
          headers: {
            "Content-Type": "application/json",
            "resourceOwnerId": "faaa6e25-caac-4e6d-80f5-9e65cbd566b4",
            "requestUId": "1234",
            "accept-language": "EN"
          },
          json: {
            "applicationKey": "l799d03c6c733f43a182c3e2431fc19ccf",
            "applicationSecret": "9d20716eb17b4e559d30c806ca6ed9a8"
          }
        }, (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(`statusCode: ${res.statusCode}`)
          console.log(body.data.accessToken)
          accesstoken = body.data.accessToken
          resolve(accesstoken)
        })
      }
    );
  };
  
  async function getDeepLink(accesstoken, amount) {
    return new Promise(
      (resolve, reject) => {
        request.post('https://api.partners.scb/partners/sandbox/v2/deeplink/transactions', {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + accesstoken,
            "resourceOwnerId": "b88ba379-d60e-492f-8d7d-030b2147233a",
            "requestUId": "1234",
            "channel": "scbeasy",
            "accept-language": "EN"
          },
          json: {
            "paymentAmount": amount,
            "transactionType": "PAYMENT",
            "transactionSubType": "BPA",
            "ref1": "050634530588520",
            "ref2": "REFERENCE2",
            "ref3": "SCB",
            "accountTo": "730144857474658"
          }
        }, (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(`statusCode: ${res.statusCode}`)
          console.log(body.data.deeplinkUrl)
          var deepLink = body.data.deeplinkUrl
          resolve(deepLink)
        })
      }
    );
  };
  