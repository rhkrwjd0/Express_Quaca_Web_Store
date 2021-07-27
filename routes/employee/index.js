var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = require('../../app');
var moment = require('moment');
var conn = require('../components/mariaDB');
var https = require('https');
var request = require('request');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var {staffList} = require('../function/emplyee');

//QSW_018 직원목록
router.post('/staffList', function (req, res) {
    let StoreId = req.body.StoreId;
    staffList(StoreId)
    .then((resstaffList)=>{
        if (resstaffList.code == 0) {
        res.json({ success: true, info: resstaffList.info });
        console.log("res staffList  Select 성공 -", Date());
        }else if(resstaffList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res staffList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstaffList.msg });
        console.log("res  staffList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("staffList catch - staffList select 실패 :", error, " - ", Date());
    })
});

module.exports = router;