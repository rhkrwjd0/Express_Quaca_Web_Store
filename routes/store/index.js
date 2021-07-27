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
var {calendar,stockUseYn,stockInfo,store,Supdate,category,categoryDetail,categoryInsert,categoryUpdate,staffList,staffListDetail,staffInsert
    ,menucateday,menucateweek,menucatemonth3,menucatemonth,menucatemonthdetail,categorymenu,categorymid,staffUpdate,eventList,eventListDetail,eventInsert,eventUpdate,stockList,stockListDetail,stockInsert,stockUpdate
    ,menumonthdetail,menumonth3,menumonth,menuweek,menuday,payday,payweek,paymonth,paymonth3,paydetail,timeDetail,timeday,timeweek,timemonth,timemonth3,salesdetail,salesweek,salesmonth,salesmonth3,salesday,MonthTotalpayment,eventfrequencyList,eventfrequencyInsert,eventfrequencyUpdate} = require('../function/store');
//QSW_012 매장정보
router.post('/storeInfo', function (req, res) {
    let StoreId = req.body.StoreId;
    store(StoreId)
    .then((resstore)=>{
        if (resstore.code == 0) {
        res.json({ success: true, info: resstore.info });
        console.log("res store  Select 성공 -", Date());
        }else if(resstore.code == 1){
        res.json({ success: false, msg: null});
        console.log("res store 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstore.msg });
        console.log("res  store Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("store catch - store select 실패 :", error, " - ", Date());
    })
});


//QS_025, 매장정보 수정(통합)
router.post('/storeUpdate', function (req, res) {
    console.log('1');
    let StoreId = req.body.StoreId;
    let StoreName = req.body.StoreName;
    let OpenTime = req.body.OpenTime;
    let CloseTime = req.body.CloseTime;
    let DayOff = req.body.DayOff;
    let TelNo =  req.body.TelNo;
    let Addr1 =  req.body.Addr1;
    let Addr2 =  req.body.Addr2;
    let Lat =  req.body.Lat;
    let Lon =  req.body.Lon;
    let MainImgUrl =  req.body.MainImgUrl;
    console.log('2',StoreId,MainImgUrl);
    Supdate(StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId)
    .then((resupdate)=>{
        if (resupdate.code == 0 && resupdate.lenth > 0) {
        res.json({ success: true, rows: resupdate.rows });
        console.log("res Supdate  update 성공 -", Date());
        }else if(resupdate.code == 0 && resupdate.lenth == 0 ){
        res.json({ success: false, msg: null});
        console.log("res Supdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resupdate.msg });
        console.log("res  Supdate update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Supdate catch - Supdate update 실패 :", error, " - ", Date());
    })
});
//QSW_014 카테고리 목록
router.post('/category', function (req, res) {
    let StoreId = req.body.StoreId;
    let UseYn = req.body.UseYn;
    category(StoreId,UseYn)
    .then((rescategory)=>{
        if (rescategory.code == 0) {
        res.json({ success: true, info: rescategory.info });
        console.log("res category  Select 성공 -", Date());
        }else if(rescategory.code == 1){
        res.json({ success: false, msg: null});
        console.log("res category 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategory.msg });
        console.log("res  category Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("category catch - category select 실패 :", error, " - ", Date());
    })
});
//QSW_014_2 카테고리 목록 - 상세
router.post('/categoryDetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let SID = req.body.SID;
    console.log('categoryDetail',StoreId,SID);
    categoryDetail(StoreId,SID)
    .then((rescategoryDetail)=>{
        if (rescategoryDetail.code == 0) {
        res.json({ success: true, info: rescategoryDetail.info });
        console.log("res categoryDetail  Select 성공 -", Date());
        }else if(rescategoryDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res categoryDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategoryDetail.msg });
        console.log("res  categoryDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("categoryDetail catch - categoryDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_014_3 카테고리 목록 - 상세 - not in
router.post('/categorymenu', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('categorymenu',StoreId);
    categorymenu(StoreId)
    .then((rescategorymenu)=>{
        if (rescategorymenu.code == 0) {
        res.json({ success: true, info: rescategorymenu.info });
        console.log("res categorymenu  Select 성공 -", Date());
        }else if(rescategorymenu.code == 1){
        res.json({ success: false, msg: null});
        console.log("res categorymenu 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategorymenu.msg });
        console.log("res  categorymenu Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("categorymenu catch - categorymenu select 실패 :", error, " - ", Date());
    })
});
//QSW_014_4 카테고리 목록 - 상세 - 카테고리별 정렬
router.post('/categorymid', function (req, res) {
    let StoreId = req.body.StoreId;
    let CateCd = req.body.CateCd;
    console.log('categorymid',StoreId,CateCd);
    categorymid(StoreId,CateCd)
    .then((rescategorymid)=>{
        if (rescategorymid.code == 0) {
        res.json({ success: true, info: rescategorymid.info });
        console.log("res categorymid  Select 성공 -", Date());
        }else if(rescategorymid.code == 1){
        res.json({ success: false, msg: null});
        console.log("res categorymid 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategorymid.msg });
        console.log("res  categorymid Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("categoryDetail catch - categoryDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_015 카테고리 등록
router.post('/categoryInsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let CateCd = req.body.CateCd;
    let CateNm = req.body.CateNm;
    let MidCateCd = req.body.MidCateCd;
    let MidCateNm = req.body.MidCateNm;
    let CateDetail = req.body.CateDetail;
    categoryInsert(StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail)
    .then((rescategoryInsert)=>{
        if (rescategoryInsert.code == 0) {
        res.json({ success: true, info: rescategoryInsert.info });
        console.log("res categoryInsert  Select 성공 -", Date());
        }else if(rescategoryInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res categoryInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategoryInsert.msg });
        console.log("res  categoryInsert Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("categoryInsert catch - categoryInsert select 실패 :", error, " - ", Date());
    })
});
//QSW_015 카테고리 수정
router.post('/categoryUpdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let CateCd = req.body.CateCd;
    let CateNm = req.body.CateNm;
    let MidCateCd = req.body.MidCateCd;
    let MidCateNm = req.body.MidCateNm;
    let CateDetail = req.body.CateDetail;
    let UseYn = req.body.UseYn;
    categoryUpdate(StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn)
    .then((rescategoryUpdate)=>{
        if (rescategoryUpdate.code == 0) {
        res.json({ success: true, info: rescategoryUpdate.info });
        console.log("res categoryUpdate  Select 성공 -", Date());
        }else if(rescategoryUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res categoryUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescategoryUpdate.msg });
        console.log("res  categoryUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("categoryUpdate catch - categoryUpdate select 실패 :", error, " - ", Date());
    })
});
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
//QSW_018_2 직원목록-상세
router.post('/staffListDetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let EmployeeCd = req.body.EmployeeCd;
    staffListDetail(StoreId,EmployeeCd)
    .then((resstaffListDetail)=>{
        if (resstaffListDetail.code == 0) {
        res.json({ success: true, info: resstaffListDetail.info });
        console.log("res staffListDetail  Select 성공 -", Date());
        }else if(resstaffListDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res staffListDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstaffListDetail.msg });
        console.log("res  staffListDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("staffListDetail catch - staffListDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_019 직원 관리 - 등록 
router.post('/staffInsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let ClassCd = req.body.ClassCd;
    let ClassNm = req.body.ClassNm;
    let EmployeeNm = req.body.EmployeeNm;
    let PhoneNum = req.body.PhoneNum;
    let StartDt = req.body.StartDt;
    console.log('1',StoreId,ClassCd,ClassNm,EmployeeNm,PhoneNum,StartDt);
    staffInsert(StoreId,ClassCd,ClassNm,EmployeeNm,PhoneNum,StartDt)
    .then((resstaffInsert)=>{
        if (resstaffInsert.code == 0) {
        res.json({ success: true, info: resstaffInsert.info });
        console.log("res staffInsert  Select 성공 -", Date());
        }else if(resstaffInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res staffInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstaffInsert.msg });
        console.log("res  staffInsert Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("staffInsert catch - staffInsert select 실패 :", error, " - ", Date());
    })
});
//QSW_019_2 직원 관리 - 수정
router.post('/staffUpdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let ClassCd = req.body.ClassCd;
    let ClassNm = req.body.ClassNm;
    let EmployeeCd = req.body.EmployeeCd;
    let EmployeeNm = req.body.EmployeeNm;
    let PhoneNum = req.body.PhoneNum;
    let UseYn = req.body.UseYn;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    console.log('1',StoreId,ClassCd,ClassNm,EmployeeCd,EmployeeNm,PhoneNum,UseYn,StartDt,EndDt);
    staffUpdate(StoreId,ClassCd,ClassNm,EmployeeCd,EmployeeNm,PhoneNum,UseYn,StartDt,EndDt)
    .then((resstaffUpdate)=>{
        if (resstaffUpdate.code == 0) {
        res.json({ success: true, info: resstaffUpdate.info });
        console.log("res staffUpdate  Select 성공 -", Date());
        }else if(resstaffUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res staffUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstaffUpdate.msg });
        console.log("res  staffUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("staffUpdate catch - staffUpdate select 실패 :", error, " - ", Date());
    })
});
//QSW_020 행사 목록
router.post('/eventList', function (req, res) {
    let StoreId = req.body.StoreId;
    eventList(StoreId)
    .then((reseventList)=>{
        if (reseventList.code == 0) {
        res.json({ success: true, info: reseventList.info });
        console.log("res eventList  Select 성공 -", Date());
        }else if(reseventList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventList.msg });
        console.log("res  eventList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventList catch - eventList select 실패 :", error, " - ", Date());
    })
});
//QSW_020_2 행사 목록-상세
router.post('/eventListDetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let EventCd = req.body.EventCd;
    eventListDetail(StoreId,EventCd)
    .then((reseventListDetail)=>{
        if (reseventListDetail.code == 0) {
        res.json({ success: true, info: reseventListDetail.info });
        console.log("res eventListDetail  Select 성공 -", Date());
        }else if(reseventListDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventListDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventListDetail.msg });
        console.log("res  eventListDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventListDetail catch - eventListDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_021 행사 등록
router.post('/eventInsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let CateCd = req.body.CateCd;
    let MenuId = req.body.MenuId;
    let EventType = req.body.EventType;
    let EventNm = req.body.EventNm;
    let SaleType = req.body.SaleType;
    let SaleValue = req.body.SaleValue;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    console.log('1',StoreId,CateCd,MenuId,EventType,EventNm,SaleType,SaleValue,StartDt,EndDt);
    eventInsert(StoreId,CateCd,MenuId,EventType,EventNm,SaleType,SaleValue,StartDt,EndDt)
    .then((reseventInsert)=>{
        if (reseventInsert.code == 0) {
        res.json({ success: true, info: reseventInsert.info });
        console.log("res eventInsert  Select 성공 -", Date());
        }else if(reseventInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventInsert.msg });
        console.log("res  eventInsert Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventInsert catch - eventInsert select 실패 :", error, " - ", Date());
    })
});
//QSW_021_2 행사 수정
router.post('/eventUpdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let CateCd = req.body.CateCd;
    let MenuId = req.body.MenuId;
    let EventType = req.body.EventType;
    let EventCd = req.body.EventCd;
    let EventNm = req.body.EventNm;
    let SaleType = req.body.SaleType;
    let SaleValue = req.body.SaleValue;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    let UseYn = req.body.UseYn;
    console.log('1',StoreId,CateCd,MenuId,EventType,EventCd,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn);
    eventUpdate(StoreId,CateCd,MenuId,EventType,EventCd,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn)
    .then((reseventUpdate)=>{
        if (reseventUpdate.code == 0) {
        res.json({ success: true, info: reseventUpdate.info });
        console.log("res eventUpdate  Select 성공 -", Date());
        }else if(reseventUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventUpdate.msg });
        console.log("res  eventUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventUpdate catch - eventUpdate select 실패 :", error, " - ", Date());
    })
});
//QSW_020-1 행사-프리퀀시 관리 목록
router.post('/eventfrequencyList', function (req, res) {
    let EventCd = req.body.EventCd;
    eventfrequencyList(EventCd)
    .then((reseventfrequencyList)=>{
        if (reseventfrequencyList.code == 0) {
        res.json({ success: true, info: reseventfrequencyList.info });
        console.log("res eventfrequencyList  Select 성공 -", Date());
        }else if(reseventfrequencyList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventfrequencyList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventfrequencyList.msg });
        console.log("res  eventfrequencyList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventfrequencyList catch - eventfrequencyList select 실패 :", error, " - ", Date());
    })
});
//QSW_021-1 행사-프리퀀시 관리 등록
router.post('/eventfrequencyInsert', function (req, res) {
    let EventCd = req.body.EventCd;
    let OptionA = req.body.OptionA;
    let CntA = req.body.CntA;
    let OptionB = req.body.OptionB;
    let CntB = req.body.CntB;
    let OptionC = req.body.OptionC;
    let CntC = req.body.CntC;
    let Present = req.body.Present;
    console.log('1',EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present);
    eventfrequencyInsert(EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present)
    .then((reseventfrequencyInsert)=>{
        if (reseventfrequencyInsert.code == 0) {
        res.json({ success: true, info: reseventfrequencyInsert.info });
        console.log("res eventfrequencyInsert  Select 성공 -", Date());
        }else if(reseventfrequencyInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventfrequencyInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventfrequencyInsert.msg });
        console.log("res  eventfrequencyInsert Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventfrequencyInsert catch - eventfrequencyInsert select 실패 :", error, " - ", Date());
    })
});
//QSW_021-1_2 행사-프리퀀시 관리 수정
router.post('/eventfrequencyUpdate', function (req, res) {
    let EventCd = req.body.EventCd;
    let OptionA = req.body.OptionA;
    let CntA = req.body.CntA;
    let OptionB = req.body.OptionB;
    let CntB = req.body.CntB;
    let OptionC = req.body.OptionC;
    let CntC = req.body.CntC;
    let Present = req.body.Present;
    console.log('1',EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present);
    eventfrequencyUpdate(EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present)
    .then((reseventfrequencyUpdate)=>{
        if (reseventfrequencyUpdate.code == 0) {
        res.json({ success: true, info: reseventfrequencyUpdate.info });
        console.log("res eventfrequencyUpdate  Select 성공 -", Date());
        }else if(reseventfrequencyUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res eventfrequencyUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: reseventfrequencyUpdate.msg });
        console.log("res  eventfrequencyUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("eventfrequencyUpdate catch - eventfrequencyUpdate select 실패 :", error, " - ", Date());
    })
});
//QSW_022 재고 관리 - 목록
router.post('/stockList', function (req, res) {
    let StoreId = req.body.StoreId;
    stockList(StoreId)
    .then((resstockList)=>{
        if (resstockList.code == 0) {
        res.json({ success: true, info: resstockList.info });
        console.log("res stockList  Select 성공 -", Date());
        }else if(resstockList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockList.msg });
        console.log("res  stockList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockList catch - stockList select 실패 :", error, " - ", Date());
    })
});
//QSW_022_2 재고 관리 -상세 목록
router.post('/stockInfo', function (req, res) {
    let StoreId = req.body.StoreId;
    let StockCd = req.body.StockCd;
    stockInfo(StoreId,StockCd)
    .then((resstockInfo)=>{
        if (resstockInfo.code == 0) {
        res.json({ success: true, info: resstockInfo.info });
        console.log("res stockInfo  Select 성공 -", Date());
        }else if(resstockInfo.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockInfo 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockInfo.msg });
        console.log("res  stockInfo Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockInfo catch - stockInfo select 실패 :", error, " - ", Date());
    })
});
//QSW_022_3재고 히스토리 - 목록 - 상세
router.post('/stockHistoryList', function (req, res) {
    let StoreId = req.body.StoreId;
    let StockCd = req.body.StockCd;
    let WSType = req.body.WSType;
    stockListDetail(StoreId,StockCd,WSType)
    .then((resstockListDetail)=>{
        if (resstockListDetail.code == 0) {
        res.json({ success: true, info: resstockListDetail.info });
        console.log("res stockListDetail  Select 성공 -", Date());
        }else if(resstockListDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockListDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockListDetail.msg });
        console.log("res  stockListDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockListDetail catch - stockListDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_022 재고 관리 - 등록
router.post('/stockInsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let StockNm = req.body.StockNm;
    let StockCnt = req.body.StockCnt;
    let WarehousingDt = req.body.WarehousingDt;
    console.log('1',StoreId, StockNm, StockCnt,WarehousingDt);
    stockInsert(StoreId, StockNm, StockCnt,WarehousingDt)
    .then((resstockInsert)=>{
        if (resstockInsert.code == 0) {
        res.json({ success: true, info: resstockInsert.info });
        console.log("res stockInsert  Select 성공 -", Date());
        }else if(resstockInsert.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockInsert 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockInsert.msg });
        console.log("res  stockInsert Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockInsert catch - stockInsert select 실패 :", error, " - ", Date());
    })
});
//QSW_022 재고 관리 - 수정
router.post('/stockUpdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let StockCd = req.body.StockCd;
    let StockCnt = req.body.StockCnt;
    let WSType = req.body.WSType;
    let StockDt = req.body.StockDt;
    console.log('1',StoreId,StockCd, StockCnt,WSType, StockDt);
    stockUpdate(StoreId,StockCd, StockCnt,WSType, StockDt)
    .then((resstockUpdate)=>{
        if (resstockUpdate.code == 0) {
        res.json({ success: true, info: resstockUpdate.info });
        console.log("res stockUpdate  Select 성공 -", Date());
        }else if(resstockUpdate.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockUpdate 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockUpdate.msg });
        console.log("res  stockUpdate Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockUpdate catch - stockUpdate select 실패 :", error, " - ", Date());
    })
});
//QSW_022_2 재고 관리 - UseYn 수정
router.post('/stockUseYn', function (req, res) {
    let StoreId = req.body.StoreId;
    let StockCd = req.body.StockCd;
    let UseYn = req.body.UseYn;
    console.log('1',StoreId,StockCd, UseYn);
    stockUseYn(StoreId,StockCd, UseYn)
    .then((resstockUseYn)=>{
        if (resstockUseYn.code == 0) {
        res.json({ success: true, info: resstockUseYn.info });
        console.log("res stockUseYn  Select 성공 -", Date());
        }else if(resstockUseYn.code == 1){
        res.json({ success: false, msg: null});
        console.log("res stockUseYn 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resstockUseYn.msg });
        console.log("res  stockUseYn Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("stockUseYn catch - stockUseYn select 실패 :", error, " - ", Date());
    })
});
//QSW_008 매출 달력
router.post('/calendar', function (req, res) {
    let StoreId = req.body.StoreId;
    let InsertDt = req.body.InsertDt;
    calendar(StoreId,InsertDt)
    .then((rescalendar)=>{
        if (rescalendar.code == 0) {
        res.json({ success: true, info: rescalendar.info });
        console.log("res calendar  Select 성공 -", Date());
        }else if(rescalendar.code == 1){
        res.json({ success: false, msg: null});
        console.log("res calendar 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: rescalendar.msg });
        console.log("res  calendar Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("calendar catch - calendar select 실패 :", error, " - ", Date());
    })
});
//QSW 008_2 매출 달력 - 이번 달 총 매출 금액
router.post('/MonthTotalpayment', function (req, res) {
    let StoreId = req.body.StoreId;
    let InsertDt = req.body.InsertDt;
    MonthTotalpayment(StoreId,InsertDt)
    .then((resMonthTotalpayment)=>{
        if (resMonthTotalpayment.code == 0) {
        res.json({ success: true, info: resMonthTotalpayment.info });
        console.log("res MonthTotalpayment  Select 성공 -", Date());
        }else if(resMonthTotalpayment.code == 1){
        res.json({ success: false, msg: null});
        console.log("res MonthTotalpayment 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resMonthTotalpayment.msg });
        console.log("res  MonthTotalpayment Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("MonthTotalpayment catch - MonthTotalpayment select 실패 :", error, " - ", Date());
    })
});
//QSW 009 매출 분석 - 결제정보(1day)
router.post('/salesday', function (req, res) {
    let StoreId = req.body.StoreId;
    salesday(StoreId)
    .then((ressalesday)=>{
        if (ressalesday.code == 0) {
        res.json({ success: true, info: ressalesday.info });
        console.log("res salesday  Select 성공 -", Date());
        }else if(ressalesday.code == 1){
        res.json({ success: false, msg: null});
        console.log("res salesday 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: ressalesday.msg });
        console.log("res  salesday Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("salesday catch - salesday select 실패 :", error, " - ", Date());
    })
});
//QSW 009_2 매출 분석 - 결제정보(1week)
router.post('/salesweek', function (req, res) {
    let StoreId = req.body.StoreId;
    salesweek(StoreId)
    .then((ressalesweek)=>{
        if (ressalesweek.code == 0) {
        res.json({ success: true, info: ressalesweek.info });
        console.log("res salesweek  Select 성공 -", Date());
        }else if(ressalesweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res salesweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: ressalesweek.msg });
        console.log("res  salesweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("salesweek catch - salesweek select 실패 :", error, " - ", Date());
    })
});
//QSW 009_3 매출 분석 - 결제정보(1month)
router.post('/salesmonth', function (req, res) {
    let StoreId = req.body.StoreId;
    salesmonth(StoreId)
    .then((ressalesmonth)=>{
        if (ressalesmonth.code == 0) {
        res.json({ success: true, info: ressalesmonth.info });
        console.log("res salesmonth  Select 성공 -", Date());
        }else if(ressalesmonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res salesmonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: ressalesmonth.msg });
        console.log("res  salesmonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("salesmonth catch - salesmonth select 실패 :", error, " - ", Date());
    })
});
//QSW 009_4 매출 분석 - 결제정보(3month)
router.post('/salesmonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    salesmonth3(StoreId)
    .then((ressalesmonth3)=>{
        if (ressalesmonth3.code == 0) {
        res.json({ success: true, info: ressalesmonth3.info });
        console.log("res salesmonth3  Select 성공 -", Date());
        }else if(ressalesmonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res salesmonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: ressalesmonth3.msg });
        console.log("res  salesmonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("salesmonth3 catch - salesmonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW 009_5 매출 분석 - 결제정보(기간선택)
router.post('/salesdetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    salesdetail(StoreId,StartDt,EndDt)
    .then((ressalesdetail)=>{
        if (ressalesdetail.code == 0) {
        res.json({ success: true, info: ressalesdetail.info });
        console.log("res salesdetail  Select 성공 -", Date());
        }else if(ressalesdetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res salesdetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: ressalesdetail.msg });
        console.log("res  salesdetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("salesdetail catch - salesdetail select 실패 :", error, " - ", Date());
    })
});
//QSW 010 영업 분석 - 주문시간 (1day)
router.post('/timeday', function (req, res) {
    let StoreId = req.body.StoreId;
    timeday(StoreId)
    .then((restimeday)=>{
        if (restimeday.code == 0) {
        res.json({ success: true, info: restimeday.info });
        console.log("res timeday  Select 성공 -", Date());
        }else if(restimeday.code == 1){
        res.json({ success: false, msg: null});
        console.log("res timeday 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: restimeday.msg });
        console.log("res  timeday Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("timeday catch - timeday select 실패 :", error, " - ", Date());
    })
});
//QSW 010_2 영업 분석 - 주문시간 (1week)
router.post('/timeweek', function (req, res) {
    let StoreId = req.body.StoreId;
    timeweek(StoreId)
    .then((restimeweek)=>{
        if (restimeweek.code == 0) {
        res.json({ success: true, info: restimeweek.info });
        console.log("res timeweek  Select 성공 -", Date());
        }else if(restimeweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res timeweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: restimeweek.msg });
        console.log("res  timeweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("timeweek catch - timeweek select 실패 :", error, " - ", Date());
    })
});
//QSW 010_3 영업 분석 - 주문시간 (1month)
router.post('/timemonth', function (req, res) {
    let StoreId = req.body.StoreId;
    timemonth(StoreId)
    .then((restimemonth)=>{
        if (restimemonth.code == 0) {
        res.json({ success: true, info: restimemonth.info });
        console.log("res timemonth  Select 성공 -", Date());
        }else if(restimemonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res timemonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: restimemonth.msg });
        console.log("res  timemonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("timemonth catch - timemonth select 실패 :", error, " - ", Date());
    })
});
//QSW 010_4 영업 분석 - 주문시간 (month3)
router.post('/timemonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    timemonth3(StoreId)
    .then((restimemonth3)=>{
        if (restimemonth3.code == 0) {
        res.json({ success: true, info: restimemonth3.info });
        console.log("res timemonth3  Select 성공 -", Date());
        }else if(restimemonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res timemonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: restimemonth3.msg });
        console.log("res  timemonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("timemonth3 catch - timemonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW 010_5 영업 분석 - 주문시간 (기간선택)
router.post('/timeDetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    timeDetail(StoreId,StartDt,EndDt)
    .then((restimeDetail)=>{
        if (restimeDetail.code == 0) {
        res.json({ success: true, info: restimeDetail.info });
        console.log("res timeDetail  Select 성공 -", Date());
        }else if(restimeDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res timeDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: restimeDetail.msg });
        console.log("res  timeDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("timeDetail catch - timeDetail select 실패 :", error, " - ", Date());
    })
});
//QSW 010_6 매출 분석 - 결제수단별 매출 (1day)
router.post('/payday', function (req, res) {
    let StoreId = req.body.StoreId;
    payday(StoreId)
    .then((respayday)=>{
        if (respayday.code == 0) {
        res.json({ success: true, info: respayday.info });
        console.log("res payday  Select 성공 -", Date());
        }else if(respayday.code == 1){
        res.json({ success: false, msg: null});
        console.log("res payday 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respayday.msg });
        console.log("res  payday Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("payday catch - payday select 실패 :", error, " - ", Date());
    })
});
//QSW 010_7 매출 분석 - 결제수단별 매출 (1week)
router.post('/payweek', function (req, res) {
    let StoreId = req.body.StoreId;
    payweek(StoreId)
    .then((respayweek)=>{
        if (respayweek.code == 0) {
        res.json({ success: true, info: respayweek.info });
        console.log("res payweek  Select 성공 -", Date());
        }else if(respayweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res payweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respayweek.msg });
        console.log("res  payweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("payweek catch - payweek select 실패 :", error, " - ", Date());
    })
});
//QSW 010_8 매출 분석 - 결제수단별 매출 (1month)
router.post('/paymonth', function (req, res) {
    let StoreId = req.body.StoreId;
    paymonth(StoreId)
    .then((respaymonth)=>{
        if (respaymonth.code == 0) {
        res.json({ success: true, info: respaymonth.info });
        console.log("res paymonth  Select 성공 -", Date());
        }else if(respaymonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymonth.msg });
        console.log("res  paymonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymonth catch - paymonth select 실패 :", error, " - ", Date());
    })
});
//QSW 010_9 매출 분석 - 결제수단별 매출 (3month)
router.post('/paymonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    paymonth3(StoreId)
    .then((respaymonth3)=>{
        if (respaymonth3.code == 0) {
        res.json({ success: true, info: respaymonth3.info });
        console.log("res paymonth3  Select 성공 -", Date());
        }else if(respaymonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymonth3.msg });
        console.log("res  paymonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymonth3 catch - paymonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW 010_10 매출 분석 - 결제수단별 매출 (기간 선택)
router.post('/paydetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    paydetail(StoreId,StartDt,EndDt)
    .then((respaydetail)=>{
        if (respaydetail.code == 0) {
        res.json({ success: true, info: respaydetail.info });
        console.log("res paydetail  Select 성공 -", Date());
        }else if(respaydetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paydetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaydetail.msg });
        console.log("res  paydetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paydetail catch - paydetail select 실패 :", error, " - ", Date());
    })
});
//QSW 011 상품 분석 - (1 day)
router.post('/menuday', function (req, res) {
    let StoreId = req.body.StoreId;
    menuday(StoreId)
    .then((resmenuday)=>{
        if (resmenuday.code == 0) {
        res.json({ success: true, info: resmenuday.info });
        console.log("res menuday  Select 성공 -", Date());
        }else if(resmenuday.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menuday 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenuday.msg });
        console.log("res  menuday Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("payday catch - payday select 실패 :", error, " - ", Date());
    })
});
//QSW 011_2 상품 분석 - (week)
router.post('/menuweek', function (req, res) {
    let StoreId = req.body.StoreId;
    menuweek(StoreId)
    .then((resmenuweek)=>{
        if (resmenuweek.code == 0) {
        res.json({ success: true, info: resmenuweek.info });
        console.log("res menuweek  Select 성공 -", Date());
        }else if(resmenuweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menuweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenuweek.msg });
        console.log("res  menuweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menuweek catch - menuweek select 실패 :", error, " - ", Date());
    })
});
//QSW 011_3 상품 분석 - (month)
router.post('/menumonth', function (req, res) {
    let StoreId = req.body.StoreId;
    menumonth(StoreId)
    .then((resmenumonth)=>{
        if (resmenumonth.code == 0) {
        res.json({ success: true, info: resmenumonth.info });
        console.log("res menumonth  Select 성공 -", Date());
        }else if(resmenumonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menumonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenumonth.msg });
        console.log("res  menumonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menumonth catch - menumonth select 실패 :", error, " - ", Date());
    })
});
//QSW 011_4 상품 분석 - (3 month)
router.post('/menumonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    menumonth3(StoreId)
    .then((resmenumonth3)=>{
        if (resmenumonth3.code == 0) {
        res.json({ success: true, info: resmenumonth3.info });
        console.log("res menumonth3  Select 성공 -", Date());
        }else if(resmenumonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menumonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenumonth3.msg });
        console.log("res  menumonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menumonth3 catch - menumonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW 011_5 상품 분석 - (기간 선택)
router.post('/menumonthdetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    menumonthdetail(StoreId,StartDt,EndDt)
    .then((resmenumonthdetail)=>{
        if (resmenumonthdetail.code == 0) {
        res.json({ success: true, info: resmenumonthdetail.info });
        console.log("res menumonthdetail  Select 성공 -", Date());
        }else if(resmenumonthdetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menumonthdetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenumonthdetail.msg });
        console.log("res  menumonthdetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menumonthdetail catch - menumonthdetail select 실패 :", error, " - ", Date());
    })
});
//QSW 011_6 상품 분석 - 카테고리 (1day)
router.post('/menucateday', function (req, res) {
    let StoreId = req.body.StoreId;
    menucateday(StoreId)
    .then((resmenucateday)=>{
        if (resmenucateday.code == 0) {
        res.json({ success: true, info: resmenucateday.info });
        console.log("res menucateday  Select 성공 -", Date());
        }else if(resmenucateday.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menucateday 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenucateday.msg });
        console.log("res  menucateday Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menucateday catch - menucateday select 실패 :", error, " - ", Date());
    })
});
//QSW 011_7 상품 분석 - 카테고리 (week)
router.post('/menucateweek', function (req, res) {
    let StoreId = req.body.StoreId;
    menucateweek(StoreId)
    .then((resmenucateweek)=>{
        if (resmenucateweek.code == 0) {
        res.json({ success: true, info: resmenucateweek.info });
        console.log("res menucateweek  Select 성공 -", Date());
        }else if(resmenucateweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menucateweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenucateweek.msg });
        console.log("res  menucateweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menucateweek catch - menucateweek select 실패 :", error, " - ", Date());
    })
});
//QSW 011_8 상품 분석 - 카테고리 (month)
router.post('/menucatemonth', function (req, res) {
    let StoreId = req.body.StoreId;
    menucatemonth(StoreId)
    .then((resmenucatemonth)=>{
        if (resmenucatemonth.code == 0) {
        res.json({ success: true, info: resmenucatemonth.info });
        console.log("res menucatemonth  Select 성공 -", Date());
        }else if(resmenucatemonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menucatemonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenucatemonth.msg });
        console.log("res  menucatemonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menucatemonth catch - menucatemonth select 실패 :", error, " - ", Date());
    })
});
//QSW 011_9 상품 분석 - 카테고리 (3month)
router.post('/menucatemonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    menucatemonth3(StoreId)
    .then((resmenucatemonth3)=>{
        if (resmenucatemonth3.code == 0) {
        res.json({ success: true, info: resmenucatemonth3.info });
        console.log("res menucatemonth3  Select 성공 -", Date());
        }else if(resmenucatemonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menucatemonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenucatemonth3.msg });
        console.log("res  menucatemonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menucatemonth3 catch - menucatemonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW 011_10 상품 분석 - 카테고리 (기간 선택)
router.post('/menucatemonthdetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDt = req.body.StartDt;
    let EndDt = req.body.EndDt;
    menucatemonthdetail(StoreId,StartDt,EndDt)
    .then((resmenucatemonthdetail)=>{
        if (resmenucatemonthdetail.code == 0) {
        res.json({ success: true, info: resmenucatemonthdetail.info });
        console.log("res menucatemonthdetail  Select 성공 -", Date());
        }else if(resmenucatemonthdetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res menucatemonthdetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resmenucatemonthdetail.msg });
        console.log("res  menucatemonthdetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("menucatemonthdetail catch - menucatemonthdetail select 실패 :", error, " - ", Date());
    })
});

module.exports = router;

