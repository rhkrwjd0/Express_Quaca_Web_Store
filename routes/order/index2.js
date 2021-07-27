const { name } = require('ejs');
var express = require('express');
var router = express.Router();
const app = express();
var moment = require('moment');
var conn = require('../components/mariaDB');
var { RCorderlist,allorderlist,orderlistDetail,OCorderlist,OCRCchange,OCrollback,RCPCchange,RCrollback,PCPUCchange,PCrollback,stsPriceDay,stsPriceWeek,stsDivPriceDay,stsDivPriceWeek,stsDivPriceMonth,stsPriceMonth} = require('../function/order');

//QS_017 제조완료 전 주문목록
router.post('/RCorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    RCorderlist(StoreId)
        .then((resRCorderlist)=>{
            if (resRCorderlist.code == 0) {
            res.json({ success: true, info: resRCorderlist.info });
            console.log("res RCorderlist  Select 성공 -", Date());
            }else if(resRCorderlist.code == 1){
            res.json({ success: false, msg: null});
            console.log("res RCorderlist 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resRCorderlist.msg });
            console.log("res  RCorderlist Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("RCorderlist catch - RCorderlist select 실패 :", error, " - ", Date());
        })
});

//QS_018 총 주문목록
router.post('/allorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    allorderlist(StoreId)
    .then((resallorderlist)=>{
        if ((resallorderlist.code == 0) && (resallorderlist.rows > 0)) {
        res.json({ success: true, info: resallorderlist.info });
        console.log("res allorderlist  Select 성공 -", Date());
        }else if((resallorderlist.code == 0) && (resallorderlist.rows == 0)){
        res.json({ success: false, msg: null});
        console.log("res allorderlist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resallorderlist.msg });
        console.log("res  allorderlist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("allorderlist catch - allorderlist select 실패 :", error, " - ", Date());
    })
});

//QS_019 주문상세
router.post('/orderlistDetail', function (req, res) {
    let UserPayid = req.body.UserPayid;
    orderlistDetail(UserPayid)
    .then((resorderlistDetail)=>{
        if (resorderlistDetail.code == 0) {
        res.json({ success: true, info: resorderlistDetail.info });
        console.log("res orderlistDetail  Select 성공 -", Date());
        }else if(resorderlistDetail.code == 1){
        res.json({ success: false, msg: resorderlistDetail.msg});
        console.log("res orderlistDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resorderlistDetail.msg });
        console.log("res  orderlistDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("orderlistDetail catch - orderlistDetail select 실패 :", error, " - ", Date());
    })
});
//QS_021 접수전 주문목록 (OC만 나옴)
router.post('/OCorderlist', function (req, res) {
  let StoreId = req.body.StoreId;
  OCorderlist(StoreId)
  .then((resOCorderlist)=>{
      if (resOCorderlist.code == 0) {
      res.json({ success: true, info: resOCorderlist.info });
      console.log("res OCorderlist  Select 성공 -", Date());
      }else if(resOCorderlist.code == 1){
      res.json({ success: false, msg: resOCorderlist.msg});
      console.log("res OCorderlist 데이터 값 없음 -", Date());
      } else {
      res.json({ success: false, msg: resOCorderlist.msg });
      console.log("res  OCorderlist Select  실패 -", Date());
      }
  })
  .catch((error) => {
      res.json({ code: 999, msg: "error" });
      console.log("OCorderlist catch - OCorderlist select 실패 :", error, " - ", Date());
  })
});
  // let StoreId = req.body.StoreId;
  // var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,c.OrderCnt AS OrderCnt, a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="OC" and a.StoreId = '
  // +'"'+StoreId+'"'
  // +'GROUP BY UserPayId';
  // console.log(StoreId);

  // //1. 선언
  // // pay Info
  // var payData = new Object();
  // var payDataTemp = new Object();
  // var arrPayData = new Array();
  // // pay Detail Info
  // var payDetailData = new Object();
  // var payDetailDataTmp = new Object();
  // var arrPayDetailData = new Array();
  // conn.connection.query(selectSql, function (err, rows, fields) {
  //     if (!err && rows.length > 0) {
  //         for(var i = 0; i < rows.length; i++){

  //             console.log(rows[i].UserPayId)
  //             // 데이터 입력 처리 
  //             payDataTemp = new Object();
              
  //             payDataTemp.UserPayId = rows[i].UserPayId;
  //             payDataTemp.UserPayDid = rows[i].UserPayDid;
  //             payDataTemp.InsertDT = rows[i].InsertDT;
  //             payDataTemp.NickName = rows[i].NickName;
             

  //             // 디테일 정보 조회 
  //             var detailSql = 'SELECT UserPayDid, UserPayId, StoreId, PayMethod, OrderCnt, MenuId, MenuName, Price, OptionA, OptionB, OptionC, OrderStatus FROM UserPayDetail'
  //             +' WHERE UserPayId = '+'"'+rows[i].UserPayId+'"'; 
  //             console.log(detailSql);
  //             conn.connection.query(detailSql, function (errSub, rowsSub, fieldsSub) {  
  //                 payDetailData = new Object();
  //                 arrPayDetailData = new Array();
  //                 for(var b = 0; b < rowsSub.length; b++){
  //                     payDetailDataTmp = new Object();
  //                     payDetailDataTmp.MenuName = rowsSub[b].MenuName;
  //                     arrPayDetailData.push(payDetailDataTmp);
  //                 }
  //                 payDataTemp.Menus = arrPayDetailData;
  //                 console.log(payDataTemp.Menus);
  //             });
  //             console.log("!@");
  //             //console.log(payDataTemp.Menus)
  //             arrPayData.push(payDataTemp);
  //             payData = arrPayData;
              
              
  //         }

               


  //         res.json({ success: true, info: payData });
  //     } else if (!err && rows.length == 0) {
  //         res.json({ success: false, msg: err });
  //     } else {
  //         res.json({ success: false, msg: err });
  //     }
  // });
  

//QS_022 주문접수OC->RC
router.post('/OCRCchange', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    OCRCchange(StoreId,UserPayId)
    .then((resOCRCchange)=>{
        if (resOCRCchange.code == 0) {
        res.json({ success: true, info: resOCRCchange.info });
        console.log("res OCRCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resOCRCchange.msg });
        console.log("res  OCRCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OCRCchange catch - OCRCchange select 실패 :", error, " - ", Date());
    })
});
//QS_022_1 주문접수 RC->OC rollback
router.post('/OCrollback', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    //수정
    OCrollback(StoreId,UserPayId)
    .then((resOCrollback)=>{
        if (resOCrollback.code == 0) {
        res.json({ success: true, info: resOCrollback.info });
        console.log("res OCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resOCrollback.msg });
        console.log("res  OCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OCrollback catch - OCrollback Update 실패 :", error, " - ", Date());
    })
});
//QS_023 주문접수RC->PC
router.post('/RCPCchange', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    var d = new Date();
    let MenuCompleteTime = moment(d).format('YYYY-MM-DD HH:mm:ss');
    RCPCchange(StoreId,UserPayId,MenuCompleteTime)
    .then((resRCPCchange)=>{
        if (resRCPCchange.code == 0) {
        res.json({ success: true, info: resRCPCchange.info });
        console.log("res RCPCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resRCPCchange.msg });
        console.log("res  RCPCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("RCPCchange catch - RCPCchange select 실패 :", error, " - ", Date());
    })
});
//QS_023_1 주문접수PC->RC rollback
router.post('/RCrollback', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    let MenuCompleteTime = (null);
    //수정
    RCrollback(StoreId,UserPayId,MenuCompleteTime)
    .then((resRCrollback)=>{
        if (resRCrollback.code == 0) {
        res.json({ success: true, info: resRCrollback.info });
        console.log("res RCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resRCrollback.msg });
        console.log("res  RCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("RCrollback catch - RCrollback Update 실패 :", error, " - ", Date());
    })
});
//QS_024 픽업완료PC->PUC
router.post('/PCPUCchange', function (req, res) {
    console.log("1");
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    PCPUCchange(StoreId,UserPayId)
    .then((resPCPUCchange)=>{
        if (resPCPUCchange.code == 0) {
        res.json({ success: true, info: resPCPUCchange.info });
        console.log("res PCPUCchange  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resPCPUCchange.msg });
        console.log("res  PCPUCchange Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("PCPUCchange catch - PCPUCchange select 실패 :", error, " - ", Date());
    })
});
//QS_024_1 주문접수PUC->PC rollback
router.post('/PCrollback', function (req, res) {
    console.log("2");
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    //수정
    PCrollback(StoreId,UserPayId)
    .then((resPCrollback)=>{
        if (resPCrollback.code == 0) {
        res.json({ success: true, info: resPCrollback.info });
        console.log("res PCrollback  Update 성공 -", Date());
        }else {
        res.json({ success: false, msg: resPCrollback.msg });
        console.log("res  PCrollback Update  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("PCrollback catch - PCrollback Update 실패 :", error, " - ", Date());
    })
});
//QS_005 일별 매출량
router.post('/stsPriceDay', function (req, res) {
    let StoreId = req.body.StoreId;
    let date = req.body.date;
    stsPriceDay(StoreId,date)
        .then((resstsPrice)=>{
            if (resstsPrice.code == 0) {
            res.json({ success: true, info: resstsPrice.info });
            console.log("res stsPriceDay  Select 성공 -", Date());
            }else if(resstsPrice.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsPriceDay 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resstsPrice.msg });
            console.log("res  stsPriceDay Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsPriceDay catch - stsPriceDay select 실패 :", error, " - ", Date());
        })
});
//QS_006 주간 매출량
router.post('/stsPriceWeek', function (req, res) {
    let StoreId = req.body.StoreId;
    let date = req.body.date;
    console.log("111111111",StoreId,date);
    stsPriceWeek(StoreId,date)
        .then((resstsPriceWeek)=>{
            if (resstsPriceWeek.code == 0) {
            res.json({ success: true, first: resstsPriceWeek.firstWeek,last:resstsPriceWeek.lastWeek });
            console.log("res stsPriceWeek  Select 성공 -", Date());
            }else if(resstsPriceWeek.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsPriceWeek 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resstsPriceWeek.msg });
            console.log("res stsPriceWeek Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsPriceWeek catch - stsPriceWeek select 실패 :", error, " - ", Date());
        })
});
//QS_006 월별 매출량
router.post('/stsPriceMonth', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log("111111111",StoreId);
    stsPriceMonth(StoreId)
        .then((resstsPriceMonth)=>{
            if (resstsPriceMonth.code == 0) {
            res.json({ success: true, first: resstsPriceMonth.firstMonth,last:resstsPriceMonth.lastMonth });
            console.log("res stsPriceMonth  Select 성공 -", Date());
            }else if(resstsPriceMonth.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsPriceMonth 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resstsPriceMonth.msg });
            console.log("res stsPriceMonth Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsPriceMonth catch - stsPriceMonth select 실패 :", error, " - ", Date());
        })
});
//QS_007 종류별 일별 매출량
router.post('/stsDivPriceDay', function (req, res) {
    let StoreId = req.body.StoreId;
    let date = req.body.date;
    stsDivPriceDay(StoreId, date)
        .then((resStsDivPriceDay)=>{
            if (resStsDivPriceDay.code == 0) {
            res.json({ success: true, info: resStsDivPriceDay.info });
            console.log("res stsDivPriceDay  Select 성공 -", Date());
            }else if(resStsDivPriceDay.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsDivPriceDay 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resStsDivPriceDay.msg });
            console.log("res  stsDivPriceDay Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsDivPriceDay catch - stsDivPriceDay select 실패 :", error, " - ", Date());
        })
});
//QS_008 종류별 주간별 매출량
router.post('/stsDivPriceWeek', function (req, res) {
    let StoreId = req.body.StoreId;
    let date = req.body.date;
    stsDivPriceWeek(StoreId, date)
        .then((resstsDivPriceWeek)=>{
            if (resstsDivPriceWeek.code == 0) {
            res.json({ success: true, info: resstsDivPriceWeek.info });
            console.log("res stsDivPriceWeek  Select 성공 -", Date());
            }else if(resstsDivPriceWeek.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsDivPriceWeek 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resstsDivPriceWeek.msg });
            console.log("res  stsDivPriceWeek Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsDivPriceWeek catch - stsDivPriceWeek select 실패 :", error, " - ", Date());
        })
});
//QS_009 종류별 월별 매출량
router.post('/stsDivPriceMonth', function (req, res) {
    let StoreId = req.body.StoreId;
    let date = req.body.date;
    stsDivPriceMonth(StoreId, date)
        .then((resstsDivPriceMonth)=>{
            if (resstsDivPriceMonth.code == 0) {
            res.json({ success: true, info: resstsDivPriceMonth.info });
            console.log("res stsDivPriceMonth  Select 성공 -", Date());
            }else if(resstsDivPriceMonth.code == 1){
            res.json({ success: false, msg: null});
            console.log("res stsDivPriceMonth 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resstsDivPriceMonth.msg });
            console.log("res  stsDivPriceMonth Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("stsDivPriceMonth catch - stsDivPriceMonth select 실패 :", error, " - ", Date());
        })
});
module.exports = router;