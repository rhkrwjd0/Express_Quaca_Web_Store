const { name } = require('ejs');
var express = require('express');
var router = express.Router();
const app = express();
var moment = require('moment');
var conn = require('../components/mariaDB');
const axios = require('axios')
var {AccessToken} = require('../function/common');
var {MongoOrderUpdate,OrderUpdate,Orderselect,OCRCCP,CPLastList,CUPorderlist, CanclePayUpdate,MongoSelectPayInfo,CPorderlist,RCorderlist,allorderlist,orderlistDetail,OCorderlist,TotalOrderlist,OCRCchange,OCrollback,RCPCchange
    ,RCrollback,PCPUCchange,PCrollback,DashBoard,DashBoard2,paymentList,paymentListweek,paymentListmonth,paymentListmonth3,paymentListDetail,orderlistDetail
    ,OrderAlarm,CancleReward,CancleCoupon,CancleFreQuency,SearchFrequency,CancleFreQuency2
    ,stsPriceDay,stsPriceWeek,stsDivPriceDay,stsDivPriceWeek,stsDivPriceMonth,stsPriceMonth} = require('../function/order');

//QSW_003 DashBoard
//금일 총 주문 내역
router.post('/DashBoardTodayData', function (req, res) {
    let StoreId = req.body.StoreId;
    DashBoard(StoreId)
    .then((resDashBoard)=>{
        if (resDashBoard.code == 0) {
        res.json({ success: true, info: resDashBoard.info });
        console.log("res DashBoard  Select 성공 -", Date());
        }else if(resDashBoard.code == 1){
        res.json({ success: false, msg: null});
        console.log("res DashBoard 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resDashBoard.msg });
        console.log("res  DashBoard Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("DashBoard catch - DashBoard select 실패 :", error, " - ", Date());
    })
});
//QSW_003_2 DashBoard
//오늘기준 1주일 총 주문 금액
router.post('/DashBoardWeekData', function (req, res) {
    let StoreId = req.body.StoreId;
    DashBoard2(StoreId)
    .then((resDashBoard2)=>{
        if (resDashBoard2.code == 0) {
        res.json({ success: true, info: resDashBoard2.info });
        console.log("res DashBoard2  Select 성공 -", Date());
        }else if(resDashBoard2.code == 1){
        res.json({ success: false, msg: null});
        console.log("res DashBoard2 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resDashBoard2.msg });
        console.log("res  DashBoard2 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("DashBoard2 catch - DashBoard2 select 실패 :", error, " - ", Date());
    })
});

//QSW_004 제조완료 전 주문목록(OC)
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
//QSW_004_4  취소요청 된 주문 목록(CP)
router.post('/CPorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    CPorderlist(StoreId)
    .then((resCPorderlist)=>{
        if (resCPorderlist.code == 0) {
        res.json({ success: true, info: resCPorderlist.info });
        console.log("res CPorderlist  Select 성공 -", Date());
        }else if(resCPorderlist.code == 1){
        res.json({ success: false, msg: resCPorderlist.msg});
        console.log("res CPorderlist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resCPorderlist.msg });
        console.log("res  CPorderlist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("CPorderlist catch - CPorderlist select 실패 :", error, " - ", Date());
    })
  });
//QSW_004_5  취소완료 된 주문 목록(CUP)
router.post('/CUPorderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    CUPorderlist(StoreId)
    .then((resCUPorderlist)=>{
        if (resCUPorderlist.code == 0) {
        res.json({ success: true, info: resCUPorderlist.info });
        console.log("res CUPorderlist  Select 성공 -", Date());
        }else if(resCUPorderlist.code == 1){
        res.json({ success: false, msg: resCUPorderlist.msg});
        console.log("res CUPorderlist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resCUPorderlist.msg });
        console.log("res  CUPorderlist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("CUPorderlist catch - CUPorderlist select 실패 :", error, " - ", Date());
    })
  });
//QSW_004_6  취소요청된 주문목록 Last값 (CP last값)
router.post('/CPLastList', function (req, res) {
    let StoreId = req.body.StoreId;
    CPLastList(StoreId)
    .then((resCPLastList)=>{
        if (resCPLastList.code == 0) {
        res.json({ success: true, info: resCPLastList.info });
        console.log("res CPLastList  Select 성공 -", Date());
        }else if(resCPLastList.code == 1){
        res.json({ success: false, msg: resCPLastList.msg});
        console.log("res CPLastList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resCPLastList.msg });
        console.log("res  CPLastList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("CPLastList catch - CPLastList select 실패 :", error, " - ", Date());
    })
  });
//QSW_004 총 주문목록(OC+RC+PC)
router.post('/TotalOrderlist', function (req, res) {
    let StoreId = req.body.StoreId;
    TotalOrderlist(StoreId)
    .then((resTotalOrderlist)=>{
        if (resTotalOrderlist.code == 0) {
        res.json({ success: true, info: resTotalOrderlist.info });
        console.log("res TotalOrderlist  Select 성공 -", Date());
        }else if(resTotalOrderlist.code == 1){
        res.json({ success: false, msg: resTotalOrderlist.msg});
        console.log("res TotalOrderlist 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resTotalOrderlist.msg });
        console.log("res  TotalOrderlist Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("TotalOrderlist catch - TotalOrderlist select 실패 :", error, " - ", Date());
    })
  });
//QSW_004 주문접수OC->RC
router.post('/OCRCchange', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    console.log('0',StoreId,UserPayId);
    orderlistDetail(UserPayId)
        .then((ressorderlistDetail)=>{
            console.log("res orderlistDetail  select 성공 -", Date());
            console.log('OrderStatus > ',ressorderlistDetail.info.OrderStatus);
            let OrderStatus = ressorderlistDetail.info.OrderStatus;
            if(OrderStatus == 'OC'){
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
            }else if(OrderStatus == 'CP'){
                res.json({ success: false, msg: '사용자가 결제취소 요청을 하였습니다.'});
            }else{
                res.json({ success: false, msg: 'error'});
            }
        })
        .catch((error)=>{
            res.json({ code: 999, msg: "error" });
                console.log("orderlistDetail catch - orderlistDetail select 실패 :", error, " - ", Date());
        })

});
//QSW_004_2 주문접수 RC->OC rollback
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
//QSW_005 제조완료 전 주문목록(RC,PC)
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
//QSW_006 paymentList
//금일 총 주문 내역
router.post('/paymentList', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('0',StoreId);
    paymentList(StoreId)
    .then((respaymentList)=>{
        if (respaymentList.code == 0) {
        res.json({ success: true, info: respaymentList.info });
        console.log("res paymentList  Select 성공 -", Date());
        }else if(respaymentList.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymentList 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymentList.msg });
        console.log("res  paymentList Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymentList catch - paymentList select 실패 :", error, " - ", Date());
    })
});
//QSW_006_2 paymentListweek
//오늘기준 1주일 총 주문 금액
router.post('/paymentListweek', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('0',StoreId);
    paymentListweek(StoreId)
    .then((respaymentListweek)=>{
        if (respaymentListweek.code == 0) {
        res.json({ success: true, info: respaymentListweek.info });
        console.log("res paymentListweek  Select 성공 -", Date());
        }else if(respaymentListweek.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymentListweek 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymentListweek.msg });
        console.log("res  paymentListweek Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymentListweek catch - paymentListweek select 실패 :", error, " - ", Date());
    })
});
//QSW_006_3 paymentListmonth
//오늘 기준 1개월 총 주문 금액
router.post('/paymentListmonth', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('0',StoreId);
    paymentListmonth(StoreId)
    .then((respaymentListmonth)=>{
        if (respaymentListmonth.code == 0) {
        res.json({ success: true, info: respaymentListmonth.info });
        console.log("res paymentListmonth  Select 성공 -", Date());
        }else if(respaymentListmonth.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymentListmonth 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymentListmonth.msg });
        console.log("res  paymentListmonth Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymentListmonth catch - paymentListmonth select 실패 :", error, " - ", Date());
    })
});
//QSW_006_4 paymentListmonth3
//오늘 기준 3개월 총 주문 금액
router.post('/paymentListmonth3', function (req, res) {
    let StoreId = req.body.StoreId;
    console.log('0',StoreId);
    paymentListmonth3(StoreId)
    .then((respaymentListmonth3)=>{
        if (respaymentListmonth3.code == 0) {
        res.json({ success: true, info:respaymentListmonth3.info});
        console.log("res paymentListmonth3  Select 성공 -", Date());
        }else if(respaymentListmonth3.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymentListmonth3 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymentListmonth3.msg });
        console.log("res  paymentListmonth3 Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymentListmonth3 catch - paymentListmonth3 select 실패 :", error, " - ", Date());
    })
});
//QSW_006_5 기간 선택
router.post('/paymentListDetail', function (req, res) {
    let StoreId = req.body.StoreId;
    let StartDT = req.body.StartDT;
    let EndDT = req.body.EndDT;
    console.log('0',StoreId,StartDT,EndDT);
    paymentListDetail(StoreId,StartDT,EndDT)
    .then((respaymentListDetail)=>{
        if (respaymentListDetail.code == 0) {
        res.json({ success: true, info:respaymentListDetail.info});
        console.log("res paymentListDetail  Select 성공 -", Date());
        }else if(respaymentListDetail.code == 1){
        res.json({ success: false, msg: null});
        console.log("res paymentListDetail 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: respaymentListDetail.msg });
        console.log("res  paymentListDetail Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("paymentListDetail catch - paymentListDetail select 실패 :", error, " - ", Date());
    })
});
//QSW_007 3-2-2 주문내역 - 상세정보
router.post('/paymentInfo', function (req, res) {
    let UserPayid = req.body.UserPayId;
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


//결제취소
router.post('/PayCancle', function (req, res) {
    //상태값 업데이트시 페이아이디만 씀
    let UserPayId = req.body.UserPayId;
    //결제 취소 시 아래것들도 같이 씀
    let StoreId = req.body.StoreId;
    let OrderStatus = 'CUP';
    var d = new Date();
    let MenuCompleteTime = moment(d).format('YYYY-MM-DD HH:mm:ss');
    console.log('UserPayId > ',UserPayId);
    try {
      //MongoDB에 있는 결제정보 찾아옴 
      MongoSelectPayInfo(UserPayId)
        .then((resSelectUserPay)=>{
            if (resSelectUserPay.code == 0) {
                console.log("UserPay res Select 성공 -", Date());
                console.log("MongoDB에서 받아온 imp_uid값 > ", resSelectUserPay.rows.detail.paymentData.response.imp_uid);
                let imp_uid = resSelectUserPay.rows.detail.paymentData.response.imp_uid;
                //액세스 토큰 발급
                AccessToken()
                  .then((resToken) => {
                    console.log('1.1 액세스토큰', resToken);
                    //결제취소 (imp_uid, 액세스토큰 넣어줌)
                    const getCancelData = axios({
                        url: "https://api.iamport.kr/payments/cancel",
                        method: "post",
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": resToken.response.access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
                        },
                        data: {
                        reason: '메뉴변경', // 가맹점 클라이언트로부터 받은 환불사유
                        imp_uid : imp_uid // imp_uid를 환불 고유번호로 입력
                        }
                    });
                    console.log("결제 취소 성공 > ", Date());
                    console.log("MongoDB Update 시작 > ", Date());
                    //MongoDB 주문상태값:CUP,취소일자 update
                    MongoOrderUpdate(StoreId,UserPayId,OrderStatus,MenuCompleteTime)
                        .then((ResMongoOrderUpdate)=>{
                            if(ResMongoOrderUpdate.code == 0){
                                console.log("CanclePay 성공 -", Date());
                                console.log("UserPay Update 시작 > ", Date());
                                //UserPay, UserPayDetail 주문상태값:CUP,취소일자 update
                                CanclePayUpdate(UserPayId)
                                    .then((resCanclePayUpdate)=>{
                                        if ((resCanclePayUpdate.code == 0) && (resCanclePayUpdate.info != 'null')) {
                                            console.log("CanclePay 성공 -", Date());
                                            //Reward 취소 시작
                                            let SsoKey = resCanclePayUpdate.info.SsoKey;
                                            let PayInsertDt = resCanclePayUpdate.info.InsertDt;
                                            CancleReward(SsoKey,StoreId,PayInsertDt)
                                                .then((resCancleReward)=>{
                                                    if(resCancleReward.code == 0){
                                                        console.log("CancleReward 성공 -", Date());
                                                        //Coupon 취소 시작
                                                        CancleCoupon(SsoKey,StoreId,PayInsertDt)
                                                        .then((resCancleCoupon)=>{
                                                            //쿠폰이 쌓였다면 프리퀀시에 special = -3, basic = -10 계산해줌
                                                            if(resCancleCoupon.code == 0){
                                                                console.log("CancleCoupon 쿠폰데이터 있음");
                                                                //Frequnecy 조회
                                                                SearchFrequency(SsoKey,StoreId,PayInsertDt)
                                                                    .then((resSearchFrequency)=>{
                                                                        if(resSearchFrequency.code == 0){
                                                                            console.log("SearchFrequency 성공 -", Date());
                                                                            let FrequencySpecial = resSearchFrequency.info.Special;
                                                                            let FrequencyBasic = resSearchFrequency.info.Basic;
                                                                            //FreQuency 취소 시작
                                                                            CancleFreQuency(SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic)
                                                                            .then((resCancleFreQuency)=>{
                                                                                if(resCancleFreQuency.code == 0){
                                                                                    console.log("CancleFreQuency 성공 -", Date());
                                                                                    res.json({ success: true, InsertDt: resCancleFreQuency.InsertDt });
                                                                                }else{
                                                                                    res.json({ success: false, msg: resCancleFreQuency.msg });
                                                                                    console.log("CancleFreQuency 실패 -", Date());
                                                                                }
                                                                            })
                                                                            .catch((error)=>{
                                                                                console.log('CancleFreQuency delete  err > ', error)
                                                                                res.json({ success: false, msg: error });
                                                                            })
                                                                        }else{
                                                                            res.json({ success: false, msg: resSearchFrequency.msg });
                                                                            console.log("SearchFrequency 실패 -", Date());
                                                                        }
                                                                    })
                                                                    .catch((error)=>{
                                                                        console.log('SearchFrequency select  err > ', error)
                                                                        res.json({ success: false, msg: error });
                                                                    })
                                                            //쿠폰이 안쌓였다면 프리퀀시에 결제 한 만큼의 -special , - basic 해줌
                                                            }else if(resCancleCoupon.code == 1){
                                                                console.log("CancleCoupon 쿠폰데이터 없음");
                                                                //Frequnecy 조회
                                                                SearchFrequency(SsoKey,StoreId,PayInsertDt)
                                                                    .then((resSearchFrequency)=>{
                                                                        if(resSearchFrequency.code == 0){
                                                                            console.log("SearchFrequency 성공 -", Date());
                                                                            let FrequencySpecial = resSearchFrequency.info.Special;
                                                                            let FrequencyBasic = resSearchFrequency.info.Basic;
                                                                            //FreQuency 취소 시작
                                                                            CancleFreQuency2(SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic)
                                                                            .then((resCancleFreQuency2)=>{
                                                                                if(resCancleFreQuency2.code == 0){
                                                                                    console.log("CancleFreQuency 성공 -", Date());
                                                                                    res.json({ success: true, InsertDt: resCancleFreQuency2.InsertDt });
                                                                                }else{
                                                                                    res.json({ success: false, msg: resCancleFreQuency2.msg });
                                                                                    console.log("CancleFreQuency 실패 -", Date());
                                                                                }
                                                                            })
                                                                            .catch((error)=>{
                                                                                console.log('CancleFreQuency delete  err > ', error)
                                                                                res.json({ success: false, msg: error });
                                                                            })
                                                                        }else{
                                                                            res.json({ success: false, msg: resSearchFrequency.msg });
                                                                            console.log("SearchFrequency 실패 -", Date());
                                                                        }
                                                                    })
                                                                    .catch((error)=>{
                                                                        console.log('SearchFrequency select  err > ', error)
                                                                        res.json({ success: false, msg: error });
                                                                    })
                                                            }else{
                                                                res.json({ success: false, msg: resCancleCoupon.msg });
                                                                console.log("CancleCoupon 실패 -", Date());
                                                            }
                                                        })
                                                        .catch((error)=>{
                                                            console.log('CancleCoupon delete  err > ', error)
                                                            res.json({ success: false, msg: error });
                                                        })
                                                    }else{
                                                        res.json({ success: false, msg: resCancleReward.msg });
                                                        console.log("CancleReward 실패 -", Date());
                                                    }
                                                })
                                                .catch((error)=>{
                                                    console.log('CancleReward delete  err > ', error)
                                                    res.json({ success: false, msg: error });
                                                })
                                          }else if((resCanclePayUpdate.code == 0) && (resCanclePayUpdate.rows == 'null')){
                                            res.json({ success: false,  msg: resCanclePayUpdate.msg});
                                            console.log("CanclePay 데이터 값 없음 -", Date());
                                          } else {
                                            res.json({ success: false, msg: resCanclePayUpdate.msg });
                                            console.log("CanclePay 실패 -", Date());
                                          }
                                    })
                                    .catch((error)=>{
                                        console.log('UserPay update  err > ', error)
                                        res.json({ success: false, msg: error });
                                    })
                            }else{
                                res.json({ success: false, msg: ResMongoOrderUpdate.msg });
                                console.log("CanclePay 실패 -", Date());
                            }
                            
                        })
                        .catch((error)=>{
                            console.log('MongoDB update  err > ', error)
                            res.json({ success: false, msg: error });
                        })
                })
                  .catch((error) => {
                     console.log('access token err > ', error)
                     res.json({ success: false, msg: error });
                })
                }else {
                    res.json({ success: false, msg: resSelectUserPay.err });
                    console.log("UserPay res Select  실패 -", Date());
                }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("resSelectUserPay catch - UserPayId select 실패 :", error, " - ", Date());
          })





    }catch (e) {
        res.json({ success: false, msg: e });
    }
});

//속도테스트 OC,RC, CP
router.post('/OCRCCP', function (req, res) {
    let StoreId = req.body.StoreId;
    OCRCCP(StoreId)
    .then((resOCRCCP)=>{
        if (resOCRCCP.code == 0) {
        res.json({ success: true, info: resOCRCCP.info });
        console.log("res OCRCCP  Select 성공 -", Date());
        }else if(resOCRCCP.code == 1){
        res.json({ success: false, msg: resOCRCCP.msg});
        console.log("res OCRCCP 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resOCRCCP.msg });
        console.log("res  OCRCCP Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OCRCCP catch - OCRCCP select 실패 :", error, " - ", Date());
    })
  });
  router.post('/OrderUpdate', function (req, res) {
    let StoreId = req.body.StoreId;
    let UserPayId = req.body.UserPayId;
    let OrderStatus = req.body.OrderStatus;
    var d = new Date();
    let MenuCompleteTime = moment(d).format('YYYY-MM-DD HH:mm:ss');
    //프론트에서 RC값이 들어오다면 해당 주문의 상태값이 OC값  확인 
    if(OrderStatus == 'RC'){
        selectOrderStatus = 'OC'
    }else if(OrderStatus =='PC'){
        selectOrderStatus = 'RC'
    }else if(OrderStatus =='PUC'){
        selectOrderStatus = 'PC'
    }else if(OrderStatus =='CUP'){
        selectOrderStatus = 'CP'
    }
    console.log('OrderStatus > ',selectOrderStatus);
    Orderselect(StoreId,UserPayId,selectOrderStatus)
    .then((resOrderselect)=>{
        if (resOrderselect.code == 0) {          
        console.log("res Orderselect  Select 성공 -", Date()); 
        //상태값 맞다면 MariaDB 상태값 업데이트 시작
        OrderUpdate(StoreId,UserPayId,OrderStatus,MenuCompleteTime)
            .then((resOrderUpdate)=>{
                if (resOrderUpdate.code == 0) {   
                    console.log("res Orderselect  Select 성공 -", Date()); 
                    //MongoDB 상태값 업데이트 시작
                    MongoOrderUpdate(StoreId,UserPayId,OrderStatus,MenuCompleteTime)
                    .then((resMongoOrderUpdate)=>{
                        if (resMongoOrderUpdate.code == 0) {
                            res.json({ success: true,UserPayId:UserPayId,StoreId:StoreId ,OrderStatus: OrderStatus});
                            console.log("res MongoOrderUpdate  Select 성공 -", Date()); 
                        }else{
                            res.json({ success: false, msg: resMongoOrderUpdate.msg });
                            console.log("res MongoOrderUpdate update  실패 -", Date());
                            }   
                    })
                    .catch((error)=>{
                        res.json({ success: false, msg: resMongoOrderUpdate.msg });
                        console.log("OrderUpdate catch - OrderUpdate Update 실패 :", error, " - ", Date());
                    })
                }else{
                    res.json({ success: false, msg: resOrderUpdate.msg });
                    console.log("res OrderUpdate update  실패 -", Date());
                    }
            })
            .catch((error)=>{
                res.json({ code: 999, msg: "error" });
                console.log("OrderUpdate catch - OrderUpdate Update 실패 :", error, " - ", Date());
            })
        }else if(resOrderselect.code == 1){
        res.json({ success: false, msg: resOrderselect.msg});
        console.log("res Orderselect 데이터 값 없음 -", Date());
        } else {
        res.json({ success: false, msg: resOrderselect.msg });
        console.log("res  Orderselect Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("Orderselect catch - OrderUpdate select 실패 :", error, " - ", Date());
    })
  });


// 알람(주문정보, 주문취소정보, 갯수 통합)
router.get('/OrderAlarm', function (req, res) {
    let StoreId = req.query.StoreId;
    OrderAlarm(StoreId)
    .then((resData)=>{
        if (resData.code == 0) {
            console.log("~~~");
            res.json({ success: true, info:resData.info[0]});
            console.log("res OrderAlarm  Select 성공 -", Date());
        }else if(res.code == 1){
            res.json({ success: false, msg: res.msg});
            console.log("res OrderAlarm 데이터 값 없음 -", Date());
        } else {
            res.json({ success: false, msg: res.msg });
            console.log("res  OrderAlarm Select  실패 -", Date());
        }
    })
    .catch((error) => {
        res.json({ code: 999, msg: "error" });
        console.log("OrderAlarm catch - OrderAlarm select 실패 :", error, " - ", Date());
    })
});


module.exports = router;


