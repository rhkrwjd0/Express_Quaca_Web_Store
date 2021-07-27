var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var multer = require('multer');
const { callbackify } = require('util');
const axios = require('axios')

//그룹화
const groupBy = function (data, key) {
    return data.reduce(function (carry, el) {
        var group = el[key];
        if (carry[group] === undefined) {
            carry[group] = []
        }
        carry[group].push(el)
        return carry
    },{} )
}
//액세스토큰 발급
const AccessToken = () => {
    return new Promise((resolve, reject) => {
      
      const tokenUrl = "https://api.iamport.kr/users/getToken";
      const params = {
        imp_key: '9894046956436840',
        imp_secret: 'wSAmK0LJNG8S5PPEtgX99pbnUT3QSWLpOmLzmxjads3jhSYL8WVil6Ff0J6SFRitd33AAmKOON86G6SP',
      };
  
      console.log('1.3 iamport 환경변수 > ',params)
  
      axios
        .post(tokenUrl, params)
        .then((response) => {
          resolve(response.data);
        }) // SUCCESS
        .catch((error) => {
          reject(error);
        }); // ERROR
    });
  };


exports.groupBy = groupBy;
exports.AccessToken = AccessToken;



