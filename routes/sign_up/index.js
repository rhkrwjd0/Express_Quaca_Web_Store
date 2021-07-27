var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = require('../../app');
var conn = require('../components/mariaDB');
var moment = require('moment');
var https = require('https');
var request = require('request');
const { title } = require('process');
const { Console } = require('console');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var { CouponList,PreCardInfo,memberOrderList,login,signup,memberUpdate,forgetpassword,updatepw,forgetSID,tokenupdate,memberList,memberinfo} = require('../function/signup');

//QS_001 매장아이디/패스워드로 로그인 기능
router.post('/login', function (req, res) {
    let SID = req.body.SID;
    let PassWord = req.body.PassWord;
    console.log('1',PassWord,SID)
    login(SID,PassWord)
        .then((reslogin)=>{
            if (reslogin.code == 0) {
            res.json({ success: true, info: reslogin.info });

            
            console.log("res login  Select 성공 -", Date());
            }else if(reslogin.code == 1){
            res.json({ success: false, msg: null});
            console.log("res login 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: reslogin.msg });
            console.log("res  login Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("login catch - login select 실패 :", error, " - ", Date());
        })
});
//QS_031 회원가입
router.post('/signup', function (req, res) {
    let SID = req.body.SID;
    let PassWord = req.body.PassWord;
    let Token = req.body.Token;
    let StoreId = req.body.StoreId;
    let TelNo = req.body.TelNo;
    let UseYn = req.body.UseYn;
    var d = new Date();
    let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    signup(SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt)
        .then((ressignup)=>{
            if (ressignup.code == 0) {
            res.json({ success: true, info: ressignup.info });
            console.log("res signup  Insert 성공 -", Date());
            }else {
            res.json({ success: false, msg: ressignup.msg });
            console.log("res  signup Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("signup catch - signup Insert 실패 :", error, " - ", Date());
        })
});


//QS_032 비밀번호 찾기
router.post('/forgetpassword', function (req, res) {
    console.log('1');
    let SID = req.body.SID;
    let TelNo = req.body.TelNo;
    forgetpassword(SID,TelNo)
        .then((resforgetpassword)=>{
            if (resforgetpassword.code == 0) {
            res.json({ success: true, info: resforgetpassword.info });
            console.log("res forgetpassword  Select 성공 -", Date());
            }else if(resforgetpassword.code == 1){
            res.json({ success: false, msg: null});
            console.log("res forgetpassword 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resforgetpassword.msg });
            console.log("res  forgetpassword Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("forgetpassword catch - forgetpassword select 실패 :", error, " - ", Date());
        })
});
//QSW_002_1 비밀번호 변경
router.post('/updatepw', function (req, res) {
    let SID = req.body.SID;
    let PassWord = req.body.PassWord;
    updatepw(SID,PassWord)
        .then((resupdatepw)=>{
            if (resupdatepw.code == 0) {
            res.json({ success: true,info:resupdatepw.info });
            console.log("res updatepw  Insert 성공 -", Date());
            }else if(resupdatepw.code == 1){
            res.json({ success: false, msg: null});
            console.log("res updatepw 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resupdatepw.msg });
            console.log("res  updatepw Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("updatepw catch - updatepw Insert 실패 :", error, " - ", Date());
        })
});
//QSW_002_2 아이디 찾기
router.post('/forgetSID', function (req, res) {
    let StoreId = req.body.StoreId;
    let TelNo = req.body.TelNo;
    forgetSID(StoreId,TelNo)
    .then((resforgetSID)=>{
        if (resforgetSID.code == 0) {
        res.json({ success: true, info: resforgetSID.info });
        console.log("res forgetSID  Select 성공 -", Date());
        }else if(resforgetSID.code == 1){
        res.json({ success: false, msg: null});
        console.log("res forgetSID 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resforgetSID.msg });
        console.log("res  forgetSID Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("forgetSID catch - forgetSID select 실패 :", error, " - ", Date());
    })
});








//QS_027 사용자 토큰 수정
//사용자 아이디, 토큰 보내면 DB에서 사용자 토큰 수정
router.post('/tokenupdate', function (req, res) {
    let SID = req.body.SID;
    let Token = req.body.Token;
    tokenupdate(SID,Token)
        .then((restokenupdate)=>{
            if (restokenupdate.code == 0) {
            res.json({ success: true,info:restokenupdate.info });
            console.log("res tokenupdate  Insert 성공 -", Date());
            }else if(restokenupdate.code == 1){
            res.json({ success: false, msg: null});
            console.log("res tokenupdate 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: restokenupdate.msg });
            console.log("res  tokenupdate Insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("tokenupdate catch - tokenupdate Insert 실패 :", error, " - ", Date());
        })
});
//QSW_025 회원 관리 - 목록 
router.post('/memberList', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('1',StoreId);
    memberList(StoreId)
    .then((resmemberList)=>{
        if (resmemberList.code == 0) {
        res.json({ success: true, info: resmemberList.info });
        console.log("res memberList  Select 성공 -", Date());
        }else if(resmemberList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res memberList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmemberList.msg });
        console.log("res  memberList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("memberList catch - memberList select 실패 :", error, " - ", Date());
    })
});
//QSW_025 회원 관리 - 목록 - 상세
router.post('/memberinfo', function (req, res) {
    let UserId = req.body.UserId;
    let StoreId = req.body.StoreId;
    console.log('1',UserId,StoreId);
    memberinfo(UserId,StoreId)
    .then((resmemberinfo)=>{
        if (resmemberinfo.code == 0) {
        res.json({ success: true, info: resmemberinfo.info });
        console.log("res memberinfo  Select 성공 -", Date());
        }else if(resmemberinfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res memberinfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmemberinfo.msg });
        console.log("res  memberinfo Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("memberinfo catch - memberinfo select 실패 :", error, " - ", Date());
    })
});
//QSW_026 회원 관리 - 수정
router.post('/memberUpdate', function (req, res) {
    let UserId = req.body.UserId;
    let NickName = req.body.NickName;
    let TelNo = req.body.TelNo;
    console.log('1',UserId,NickName,TelNo);
    memberUpdate(UserId,NickName,TelNo)
    .then((resmemberUpdate)=>{
        if (resmemberUpdate.code == 0) {
        res.json({ success: true, info: resmemberUpdate.info });
        console.log("res memberUpdate  Select 성공 -", Date());
        }else if(resmemberUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res memberUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmemberUpdate.msg });
        console.log("res  memberUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("memberUpdate catch - memberUpdate select 실패 :", error, " - ", Date());
    })
});
//QSW_027 회원 관리 - 주문내역
router.post('/memberOrderList', function (req, res) {
    let UserId = req.body.UserId;
    let StoreId = req.body.StoreId;
    console.log('memberOrderList',UserId,StoreId);
    memberOrderList(UserId,StoreId)
    .then((resmemberOrderList)=>{
        if (resmemberOrderList.code == 0) {
        res.json({ success: true, info: resmemberOrderList.info });
        console.log("res memberOrderList  Select 성공 -", Date());
        }else if(resmemberOrderList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res memberOrderList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmemberOrderList.msg });
        console.log("res  memberOrderList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("memberOrderList catch - memberOrderList select 실패 :", error, " - ", Date());
    })
});
//QSW_028  회원 관리 - 선불 카드 내역
router.post('/PreCardInfo', function (req, res) {
    let UserId = req.body.UserId;
    let StoreId = req.body.StoreId;
    console.log('PreCardInfo',UserId,StoreId);
    PreCardInfo(UserId,StoreId)
    .then((resPreCardInfo)=>{
        if (resPreCardInfo.code == 0) {
        res.json({ success: true, info: resPreCardInfo.info });
        console.log("res PreCardInfo  Select 성공 -", Date());
        }else if(resPreCardInfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res PreCardInfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resPreCardInfo.msg });
        console.log("res  PreCardInfo Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("PreCardInfo catch - PreCardInfo select 실패 :", error, " - ", Date());
    })
});
//QSW_029  회원 관리 - 쿠폰 내역
router.post('/CouponList', function (req, res) {
    let UserId = req.body.UserId;
    let StoreId = req.body.StoreId;
    console.log('CouponList',UserId,StoreId);
    CouponList(UserId,StoreId)
    .then((resCouponList)=>{
        if (resCouponList.code == 0) {
        res.json({ success: true, info: resCouponList.info });
        console.log("res CouponList  Select 성공 -", Date());
        }else if(resCouponList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res CouponList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resCouponList.msg });
        console.log("res  CouponList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("CouponList catch - CouponList select 실패 :", error, " - ", Date());
    })
});
module.exports = router;