var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { json } = require('express');
var moment = require('moment');
var conn = require('../components/mariaDB');
var https = require('https');
var request = require('request');
let serverurl = "https://tera-energy.github.io/Tera_Quaca_Common/server.json";
var {MDelete,ImagesInsert,ImagesInfo,ImagesDelete,menulist,Minsert,Mupdate,menuInfo,menuOption} = require('../function/menu');
var {storage} = require('../function/common');
var multer = require('multer');
const app = require('../../app');


//QS_008 매장 메뉴정보 (카테고리별 메뉴목록-메뉴아이디,이름,가격,이미지,옵션, 추천메뉴T/F, 숨김T/F)
router.post('/menulist', function (req, res) {
    let StoreId = req.body.StoreId;
    menulist(StoreId)
    .then((resmenulist)=>{
        if (resmenulist.code == 0) {
        res.json({ success: true, info: resmenulist.info });
        console.log("res menulist  Select 성공 -", Date());
        }else if(resmenulist.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menulist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenulist.msg });
        console.log("res  menulist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menulist catch - menulist select 실패 :", error, " - ", Date());
    })
});
//QSW_017 매장 메뉴 상세정보
router.post('/menuinfo', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;
    console.log('menuinfo',StoreId,MenuId);
    menuInfo(StoreId,MenuId)
    .then((resmenuInfo)=>{
        if (resmenuInfo.code == 0) {
        res.json({ success: true, info: resmenuInfo.info });
        console.log("res menuInfo  Select 성공 -", Date());
        }else if(resmenuInfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menuInfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenuInfo.msg });
        console.log("res  menuInfo Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menuInfo catch - menuInfo select 실패 :", error, " - ", Date());
    })
});
//QSW_017 메뉴 옵션 상세정보
router.post('/menuOption', function (req, res) {
    let StoreId = req.body.StoreId;
    let LargeDivCd = req.body.LargeDivCd;
    console.log('menuOption',StoreId,LargeDivCd);
    menuOption(StoreId,LargeDivCd)
    .then((resmenuOption)=>{
        if (resmenuOption.code == 0) {
        res.json({ success: true, info: resmenuOption.info });
        console.log("res menuOption  Select 성공 -", Date());
        }else if(resmenuOption.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menuOption 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenuOption.msg });
        console.log("res  menuOption Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menuOption catch - menuOption select 실패 :", error, " - ", Date());
    })
});
//QSW_017_1 메뉴 등록
const uploader = multer({storage:storage});
router.post('/Minsert', uploader.single('ImgUrl'),function (req, res) {
    let StoreId = req.body.StoreId;
    let LargeDivCd = req.body.LargeDivCd;
    let MidDivCd = req.body.MidDivCd;
    let MenuName = req.body.MenuName;
    let Price =  req.body.Price;
    let ImgUrl =  req.body.ImgUrl;
    let OptionA =  req.body.OptionA;
    let OptionB =  req.body.OptionB;
    let OptionC =  req.body.OptionC;
    let Contents =  req.body.Contents;
    let Best =  req.body.Best;
    let UseYn =  req.body.UseYn;
    var InsertDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('0000',StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,InsertDate);
    Minsert(StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,InsertDate)
    .then((resMinsert)=>{
        if (resMinsert.code == 0) {
        res.json({ success: true, info: resMinsert.rows });
        console.log("res Minsert  insert 성공 -", Date());
        }else if(resMinsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res Minsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMinsert.msg });
        console.log("res  Minsert insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Minsert catch - menulist Minsert 실패 :", error, " - ", Date());
    })
});
//QSW_017_2 메뉴 수정
//이름, 가격, 이미지, 옵션, 추천메뉴 설정해제, 메뉴숨김 설정/해제
router.post('/Mupdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;
    let LargeDivCd = req.body.LargeDivCd;
    let MidDivCd = req.body.MidDivCd;
    let MenuName = req.body.MenuName;
    let Price =  req.body.Price;
    let ImgUrl =  req.body.ImgUrl;
    let OptionA =  req.body.OptionA;
    let OptionB =  req.body.OptionB;
    let OptionC =  req.body.OptionC;
    let Contents =  req.body.Contents;
    let Best =  req.body.Best;
    let UseYn =  req.body.UseYn;
    Mupdate(MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,StoreId,MenuId)
    .then((resMupdate)=>{
        if (resMupdate.code == 0) {
        res.json({ success: true, info: resMupdate.rows });
        console.log("res Mupdate  insert 성공 -", Date());
        }else if(resMupdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res Mupdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMupdate.msg });
        console.log("res  Mupdate insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Mupdate catch - menulist Mupdate 실패 :", error, " - ", Date());
    })
});
//QSW_017_3 메뉴 삭제
//이름, 가격, 이미지, 옵션, 추천메뉴 설정해제, 메뉴숨김 설정/해제
router.post('/MDelete', function (req, res) {
    let StoreId = req.body.StoreId;
    let MenuId = req.body.MenuId;
    let DelYn =  req.body.DelYn;
    MDelete(StoreId,MenuId,DelYn)
    .then((resMDelete)=>{
        if (resMDelete.code == 0) {
        res.json({ success: true, info: resMDelete.rows });
        console.log("res MDelete  insert 성공 -", Date());
        }else if(resMDelete.code == 1){
        res.json({ success: false, msg: null});
        console.log("res MDelete 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMDelete.msg });
        console.log("res  MDelete insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("MDelete catch - menulist MDelete 실패 :", error, " - ", Date());
    })
});
//파일 업로드(Info)
router.post('/ImagesInfo', function (req, res) {
    console.log('ImagesInfo index.js in');
    let FileId = req.body.FileId;
    ImagesInfo(FileId)
    .then((resImagesInfo)=>{
        if (resImagesInfo.code == 0) {
        res.json({ success: true, rows: resImagesInfo.info });
        console.log("res ImagesInfo  insert 성공 -", Date());
        }else if(resImagesInfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res ImagesInfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resImagesInfo.msg });
        console.log("res  ImagesInfo insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("ImagesInfo catch - ImagesInfo insert 실패 :", error, " - ", Date());
    })
});

//파일 업로드(Insert)
router.post('/ImagesInsert', function (req, res) {
    console.log('ImagesInsert index.js in');
    let FileEncNm = req.body.FileEncNm;
    let FileOrgNm = req.body.FileOrgNm;
    let FilePath = req.body.FilePath;
    let FileSize = req.body.FileSize;
    let FileType =  req.body.FileType;
    let StoreId =  req.body.StoreId;
    let Type =  req.body.Type;
    let RefId =  req.body.RefId;
    let DelYn =  req.body.DelYn;
    let InsertId =  req.body.InsertId;
    ImagesInsert(FileEncNm,FileOrgNm,FilePath,FileSize,FileType,StoreId,Type,RefId,DelYn,InsertId)
    .then((resImagesInsert)=>{
        if (resImagesInsert.code == 0) {
        res.json({ success: true, rows: resImagesInsert.info });
        console.log("res ImagesInsert  insert 성공 -", Date());
        }else if(resImagesInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res ImagesInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resImagesInsert.msg });
        console.log("res  ImagesInsert insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("ImagesInsert catch - ImagesInsert insert 실패 :", error, " - ", Date());
    })
});
//파일 업로드(Info) delYn
router.post('/ImagesDelete', function (req, res) {
    console.log('ImagesDelete index.js in');
    let FileId = req.body.FileId;
    let DelYn = req.body.DelYn;
    ImagesDelete(FileId,DelYn)
    .then((resImagesDelete)=>{
        if (resImagesDelete.code == 0) {
        res.json({ success: true, rows: resImagesDelete.info });
        console.log("res ImagesDelete  insert 성공 -", Date());
        }else if(resImagesDelete.code == 1){
        res.json({ success: false, msg: null});
        console.log("res ImagesDelete 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resImagesDelete.msg });
        console.log("res  ImagesDelete insert  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("ImagesDelete catch - ImagesDelete insert 실패 :", error, " - ", Date());
    })
});


// //파일업로드
// const uploader = multer({storage:storage});
// router.post('/save11',uploader.array('images'), function (req, res,next) {
//     console.log(req.file);
//     console.log('파일 업로드');
//     res.redirect('/');

// });


module.exports = router;




















// //QQSW_017_3  메뉴 삭제
// router.post('/Mdelete', function (req, res) {
//     let StoreId = req.body.StoreId;
//     let MenuId = req.body.MenuId;
//     Mdelete(StoreId,MenuId)
//     .then((resMdelete)=>{
//         if (resMdelete.code == 0) {
//         res.json({ success: true, rows: resMdelete.rows });
//         console.log("res Mdelete  delete 성공 -", Date());
//         }else {
//         res.json({ success: false, msg: resMdelete.msg });
//         console.log("res  Mdelete delete  실패 -", Date());
//         }
//     })
//     .catch((error) => {
//         res.json({ code: 999, msg: "error" });
//         console.log("Mdelete catch - Mdelete delete 실패 :", error, " - ", Date());
//     })
// });
