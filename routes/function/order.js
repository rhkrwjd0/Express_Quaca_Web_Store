var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_021 접수전 주문목록 (OC만 나옴)
var OCorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('OCorderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="OC" and a.StoreId = '
        +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("OCorderlist select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                console.log("UserPayDetail select success - ",rows);
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j< memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });
        });
    }
  //QSW_004_4  취소요청 된 주문 목록(CP)
var CPorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('CP orderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,date_format(a.CancleTime, "%Y-%m-%d %H:%i") AS CancleTime,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="CP" and a.StoreId = '
        +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("CP orderlist select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.CancleTime = UserPayId[Object.keys(UserPayId)[i]][0].CancleTime;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j< memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });
        });
    }
//QSW_004_5  취소완료 된 주문 목록(CUP)
var CUPorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('CUP orderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,date_format(a.CancleTime, "%Y-%m-%d %H:%i") AS CancleTime,date_format(a.CancleCompleteTime, "%Y-%m-%d %H:%i") AS CancleCompleteTime,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="CUP" and a.StoreId = '
        +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("CUP orderlist select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.CancleTime = UserPayId[Object.keys(UserPayId)[i]][0].CancleTime;
                        memberData.CancleCompleteTime = UserPayId[Object.keys(UserPayId)[i]][0].CancleCompleteTime;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j< memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });
        });
    }
//QSW_004_6  취소요청된 주문목록 Last값 (CP last값)
var CPLastList = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('CPLastList StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i:%s") AS InsertDt,date_format(a.CancleTime, "%Y-%m-%d %H:%i:%s") AS CancleTime,date_format(a.CancleCompleteTime, "%Y-%m-%d %H:%i:%s") AS CancleCompleteTime,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus ="CP" and a.StoreId = '
        +'"'+StoreIdData+'"'+' order by CancleTime desc'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("CPLastList select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.CancleTime = UserPayId[Object.keys(UserPayId)[i]][0].CancleTime;
                        memberData.CancleCompleteTime = UserPayId[Object.keys(UserPayId)[i]][0].CancleCompleteTime;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j< memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData[0] ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });
        });
    }
//QSW_004 총 주문목록(OC+RC+PC)
var TotalOrderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('TotalOrderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus in ("OC","RC","PC","CP") and a.StoreId = '
        +'"'+StoreIdData+'"'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("TotalOrderlist select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j< memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
            });``
        });
    }
    //QSW_004 주문접수OC->RC
var OCRCchange = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('OCRCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="RC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="RC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error);
                        reject({ code: error, msg: error });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QSW_004_2 주문접수OC->RC
var OCrollback = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('OC-rollback Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="OC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="OC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_017 제조완료 전 주문목록
var RCorderlist = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('RCorderlist StoreId 데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,c.OrderCnt AS OrderCnt, (SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount ,c.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.OrderStatus in ("RC","PC") and a.StoreId = '
                         +'"'+StoreIdData+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("RCorderlist select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
                    var arrmemberData = new Array();
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for(i=0; i<rowslenth; i++){
                        memberData = new Object();
                        memberData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                        memberData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                        memberData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
                        memberData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                        memberData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                        memberData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                        memberData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                        arrPointHistory = new Array();
                        for(j=0; j<memberData.realCount; j++){
                            var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                            if( memberData.UserPayId == UserPayIdData ){
                                pointHistoryItem = new Object();        
                                pointHistoryItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                pointHistoryItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                pointHistoryItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                pointHistoryItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                pointHistoryItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                pointHistoryItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCnt;

                                arrPointHistory.push(pointHistoryItem);
                            }
                            memberData.OrderMenu = arrPointHistory;                      
                        }
                        arrmemberData.push(memberData);    
                        memberData = arrmemberData; 
                    }
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_023 주문접수RC->PC
var RCPCchange = (StoreId,UserPayId,MenuCompleteTime) =>{
    let QueryData = [StoreId,UserPayId,MenuCompleteTime];
    return new Promise((resolve, reject) => {
        console.log('RCPCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var params =[MenuCompleteTime,StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_023_1 주문접수PC->RC rollback
var RCrollback = (StoreId,UserPayId,MenuCompleteTime) =>{
    let QueryData = [StoreId,UserPayId,MenuCompleteTime];
    return new Promise((resolve, reject) => {
        console.log('RCrollback Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="RC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="RC",MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
        var params =[MenuCompleteTime,StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_024 픽업완료PC->PUC
var PCPUCchange = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('PCPUCchange Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PUC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PUC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error.errno);
                        console.log("sqlMessage > " + error.sqlMessage);
                        reject({ code: error.errno, msg: error.sqlMessage });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QS_024_1 주문접수PUC->PC rollback
var PCrollback = (StoreId,UserPayId) =>{
    let QueryData = [StoreId,UserPayId];
    return new Promise((resolve, reject) => {
        console.log('PCrollback Query 데이터 >',  QueryData);
        var sql1 = 'UPDATE UserPay SET OrderStatus="PC" where StoreId=? and UserPayId = ?';
        var sql2 = 'UPDATE UserPayDetail SET OrderStatus="PC" where StoreId=? and UserPayId = ?';
        var params =[StoreId,UserPayId];
        conn.connection.query(sql1,params, function (error, rows, fields) {
            if (error) {
                console.log("UserPay테이블 Update error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
            }else {
                conn.connection.query(sql2,params, function (error, rows, fields) { 
                    if(error) {
                        console.log("UserPay테이블 Update error - ", Date());
                        console.log("errno > " + error);
                        reject({ msg: error });
                    }else{ 
                        console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                        resolve({ code: 0, info:rows[0] });
                    }
                }); 
            } 
        });
    });
}
//QSW_003 DashBoard
//금일 총 주문 내역
var DashBoard = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('StoreIdData  데이터 >',  StoreIdData);
        var selectSql ='SELECT UserPayId,SsoKey,StoreId,MenuId,FirstMenuName,OrderCnt,OrderStatus,date_format(PayCompleteTime, "%Y-%m-%d") as PayCompleteTime,date_format(MenuCompleteTime, "%Y-%m-%d") as MenuCompleteTime,TotalPrice, PGUid,date_format(InsertDT, "%Y-%m-%d") as InsertDT  FROM UserPay WHERE StoreId = '
                      + "'" + StoreId+"'"+'  and date_format(InsertDT, "%Y-%m-%d") = CURDATE()' ;
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("DashBoard select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
  //QSW_003_2 DashBoard2
  //오늘기준 1주일 총 주문 금액
  var DashBoard2 = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('StoreIdData  데이터 >',  StoreIdData);
        var selectSql = 'SELECT '+"'"+StoreIdData+"'"+  ' AS StoreId,  IFNULL(UP.TotalPrice, 0) AS TotalPrice, DATE_FORMAT(dt.Date, "%Y-%m-%d") AS InsertDT FROM  ( select a.Date FROM ( select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a) + (1000 * d.a) ) DAY as Date from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) AS a cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) AS b cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) AS c cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) AS d ) a where a.Date between DATE_FORMAT(date_add(now(),INTERVAL -6 DAY) , "%Y-%m-%d") AND DATE_FORMAT(now(), "%Y-%m-%d") ) AS dt LEFT JOIN  ( SELECT StoreId, sum(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDT,"%Y-%m-%d") AS InsertDT FROM UserPay WHERE StoreId = '
                         +"'"+StoreIdData+"'"+' and OrderStatus = "PUC" '+' GROUP BY DATE_FORMAT(InsertDT,"%Y-%m-%d") ) AS UP ON DATE_FORMAT(UP.InsertDT,"%Y-%m-%d") = dt.Date ORDER BY InsertDT asc'; 
        conn.connection.query(selectSql, function (error, rows, fields) {
            console.log('111',rows)
            if (error) {
                console.log("DashBoard2 select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                if (!error && rows.length > 0) {
                    // var memberData = new Object();
                    // var arrmemberData = new Array();
                    // for(i=0; i<7; i++){
                    //     if(!rows[i]){
                    //         console.log('1');
                    //         memberData = new Object();
                    //         memberData.UserPayId = 'null';
                    //         memberData.OrderNum = 'null';
                    //         memberData.InsertDt = 'null';
                    //         arrmemberData.push(memberData);    
                    //         memberData = arrmemberData; 
                    //     }else{
                    //         console.log('2');
                    //         memberData = new Object();
                    //         memberData.UserPayId = rows[i].StoreId;
                    //         memberData.OrderNum = rows[i].TotalPrice;
                    //         memberData.InsertDt = rows[i].InsertDT;
                    //         arrmemberData.push(memberData);    
                    //         memberData = arrmemberData; 
                    //     }
                    // }
                    resolve({ success: true, info: rows ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
//QSW_006 paymentList
//금일 총 주문 내역
var paymentList = (StoreId) =>{
    let StoreIdData = [StoreId];

    return new Promise((resolve, reject) => {
        console.log('StoreIdData  데이터 >',  StoreIdData);
        var selectSql ='SELECT a.UserPayId,a.SsoKey,b.NickName,a.StoreId,a.MenuId,a.FirstMenuName,a.OrderCnt,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i:%s") as PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i:%s") as MenuCompleteTime,a.TotalPrice, a.PGUid,DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") AS InsertDT FROM UserPay a ,User b WHERE a.SsoKey=b.SsoKey AND a.StoreId =  '
                      + "'" + StoreId+"'"+'  and DATE_FORMAT(a.InsertDT, "%Y-%m-%d") = CURDATE() GROUP BY a.UserPayId ORDER BY DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") DESC' ;
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("DashBoard select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
  //QSW_006_2 paymentListweek
  //오늘기준 1주일 주문목록
  var paymentListweek = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('StoreIdData  데이터 >',  StoreIdData);
        var selectSql = 'SELECT a.UserPayId,a.SsoKey,b.NickName,a.StoreId,a.MenuId,a.FirstMenuName,a.OrderCnt,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i:%s") as PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i:%s") as MenuCompleteTime,a.TotalPrice, a.PGUid,DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") as InsertDT FROM UserPay a, User b WHERE a.SsoKey=b.SsoKey AND a.StoreId = '
                           +'"'+StoreId+'"'+ ' and DATE_FORMAT(a.InsertDT,"%Y-%m-%d") BETWEEN DATE_ADD(NOW(),INTERVAL -1 WEEK ) AND NOW() order by DATE_FORMAT(a.InsertDT,"%Y-%m-%d %H:%i:%s") desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("DashBoard2 select error - ", Date());
                console.log("errno > " + error);
                reject({  msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
    //QSW_006_3 paymentListmonth
//오늘 기준 1개월 주문목록
  var paymentListmonth = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('stsPriceMonth StoreId 데이터 >',  StoreIdData);
        var selectSql = 'select a.UserPayId,a.SsoKey,b.NickName,a.StoreId,a.MenuId,a.FirstMenuName,a.OrderCnt,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i:%s") as PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i:%s") as MenuCompleteTime,a.TotalPrice, a.PGUid,DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") as InsertDT FROM UserPay a, User b WHERE a.SsoKey=b.SsoKey and a.StoreId = '
        +'"'+StoreId+'"'+ '  and DATE_FORMAT(a.InsertDT,"%Y-%m-%d") BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW() order by DATE_FORMAT(a.InsertDT,"%Y-%m-%d %H:%i%s") desc'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("stsPriceMonth select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info:rows,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
//QSW_006_4 paymentListmonth3
//오늘 기준 3개월 주문목록
  var paymentListmonth3 = (StoreId) =>{
    let StoreIdData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('stsPriceMonth StoreId 데이터 >',  StoreIdData);
        var selectSql = 'select a.UserPayId,a.SsoKey,b.NickName,a.StoreId,a.MenuId,a.FirstMenuName,a.OrderCnt,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i:%s") as PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i:%s") as MenuCompleteTime,a.TotalPrice, a.PGUid,DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") as InsertDT FROM UserPay a, User b WHERE a.SsoKey=b.SsoKey and a.StoreId = '
        +'"'+StoreId+'"'+ ' and DATE_FORMAT(a.InsertDT,"%Y-%m-%d") BETWEEN DATE_ADD(NOW(),INTERVAL -3 MONTH ) AND NOW() order by DATE_FORMAT(a.InsertDT,"%Y-%m-%d %H:%i%s") desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("stsPriceMonth select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info:rows,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
  //QSW_006_5 기간 선택
var paymentListDetail = (StoreId,StartDT,EndDT) =>{
    let StoreIdData = [StoreId,StartDT,EndDT];
    return new Promise((resolve, reject) => {
        console.log('stsPriceMonth StoreId 데이터 >',  StoreIdData);
        var selectSql = 'select a.UserPayId,a.SsoKey,b.NickName,a.StoreId,a.MenuId,a.FirstMenuName,a.OrderCnt,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i:%s") as PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i:%s") as MenuCompleteTime,a.TotalPrice, a.PGUid,DATE_FORMAT(a.InsertDT, "%Y-%m-%d %H:%i:%s") as InsertDT FROM UserPay a, User b WHERE a.SsoKey=b.SsoKey and a.StoreId = '
                         +'"'+StoreId+'"'
                         +' AND DATE_FORMAT(a.InsertDT,"%Y-%m-%d") BETWEEN '
                         +'"'+ StartDT+'"'+ ' and ' + '"'+ EndDT+ '"'+' order by DATE_FORMAT(a.InsertDT,"%Y-%m-%d %H:%i:%s") desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("stsPriceMonth select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {                
                    resolve({ success: true, info:rows,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
  //QS_019 주문상세
var orderlistDetail = (UserPayid) =>{
    let UserPayidData = [UserPayid];
    return new Promise((resolve, reject) => {
        console.log('orderlistDetail UserPayid 데이터 >',  UserPayidData);
        var selectSql = 'SELECT a.UserPayDid,a.UserPayId,b.NickName,a.StoreId, a.PayMethod , a.OrderCnt, a.MenuId,a.MenuName,a.Price,a.OptionA,a.OptionB,a.OptionC,a.OrderStatus,DATE_FORMAT(a.PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime,DATE_FORMAT(a.MenuCompleteTime, "%Y-%m-%d %H:%i") AS MenuCompleteTime,a.TotalPrice,a.PGUid FROM UserPayDetail a, User b, UserPay c WHERE a.UserPayId = c.UserPayId AND b.SsoKey = c.SsoKey and a.UserPayId = '
        + '"' + UserPayidData + '"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            console.log('UserPayDetail select rows.length > ',rows.length,rows);
            if (error) {
                console.log("UserPayDetail select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                console.log("UserPayDetail select success - ",Date());
                if (!error && rows.length > 0) {
                    var memberData = new Object();
                    memberData.UserPayId = rows[0].UserPayId;
                    memberData.StoreId = rows[0].StoreId;
                    memberData.NickName = rows[0].NickName;
                    memberData.PayMethod = rows[0].PayMethod;
                    memberData.OrderCnt = rows[0].OrderCnt;
                    var pointHistoryItem = new Object();
                    var arrPointHistory = new Array();
                    for (var i = 0; i < rows.length; i++) {
                        pointHistoryItem = new Object();
                        pointHistoryItem.UserPayDid = rows[i].UserPayDid;
                        pointHistoryItem.MenuId = rows[i].MenuId;
                        pointHistoryItem.MenuName = rows[i].MenuName;
                        pointHistoryItem.Price = rows[i].Price;
                        pointHistoryItem.OrderCnt = rows[i].OrderCnt;
                        pointHistoryItem.OptionA = rows[i].OptionA;
                        pointHistoryItem.OptionB = rows[i].OptionB;
                        pointHistoryItem.OptionC = rows[i].OptionC;
                        memberData.OrderStatus = rows[i].OrderStatus;
                        memberData.PayCompleteTime = rows[i].PayCompleteTime;
                        memberData.MenuCompleteTime = rows[i].MenuCompleteTime;
                        arrPointHistory.push(pointHistoryItem);
                    }
                    memberData.OrderMenu = arrPointHistory;
                    memberData.TotalPrice = rows[0].TotalPrice;
                    memberData.PGUid = rows[0].PGUid;
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
////QU_011_1 - import결제정보 조회
var MongoSelectPayInfo = (UserPayId) =>{
    let selectData = UserPayId;
    return new Promise((resolve,reject)=> {
        console.log("Mongo UserPayId selectData data > ", selectData);
        MongoClient.connect(url, { useUnifiedTopology: true }, function (error, client) {
            if(error){
                console.log("errno > " + error);
                reject({ code: error, msg: error });
            }else{
                console.log("Connected successfully to server");   
                var db = client.db('Quaca');
                var query = {UserPayId : UserPayId};
                console.log(query);
                db.collection('Quaca').findOne(query,function(err,doc){
                    console.log("데이터 조회 !",doc);
                    resolve({ code: 0, err:err, rows:doc});
                });
            }
        });
    });
}
//QU_018 결제취소요청
var CanclePayUpdate = (UserPayId) =>{
    let selectData = [UserPayId];
    var d = new Date();
    let CancleCompleteTime = moment(d).format('YYYY-MM-DD HH:mm:ss');
    return new Promise((resolve, reject) => {
        console.log('CanclePay 데이터 >',  selectData);
        var sql = 'Update UserPay set OrderStatus = "CUP",CancleCompleteTime= ? where UserPayId = ?';
        var params = [CancleCompleteTime,UserPayId];
        conn.connection.query(sql, params, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              }else {
                var sql = 'Update UserPayDetail set OrderStatus = "CUP",CancleCompleteTime= ? where UserPayId = ?';
                var params = [CancleCompleteTime,UserPayId];
                conn.connection.query(sql, params, function (error, rows, fields) {
                    if (error) {
                        console.log("selectData select error - ", Date());
                        console.log("errno > " + error);
                        reject({msg: error });
                      }else {
                        var sql = 'select UserPayId, SsoKey,OrderStatus,date_format(CancleCompleteTime, "%Y-%m-%d %H:%i:%s") as CancleCompleteTime ,date_format(InsertDt, "%Y-%m-%d %H:%i:%s") as InsertDt from UserPay where UserPayId = '
                        +"'"+UserPayId+"'"+' Order By CancleCompleteTime desc;';
                        conn.connection.query(sql, function (error, rows, fields) {
                            if (!error && rows.length > 0) {                
                                resolve({ success: true, info:rows[0],code:0});
                              } else if (!error && rows.length == 0) {
                                resolve({ success: false, msg: null ,code:1});
                              } else {
                                resolve({ success: false, msg: error,code:2 });
                              }
                        });    
                      }
                });
              }  
        });
    });
}

//OCRCPCCP 리스트 (속도테스트)
var OCRCCP = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('OCRCCP StoreId 데이터 >',  StoreIdData);
      MongoClient.connect(url, { useUnifiedTopology: true }, function (error, client) {
        if(error){
            console.log("errno > " + error);
            reject({ code: error, msg: error });
        }else{
              console.log("Connected successfully to server");   
              var db = client.db('Quaca');
              var query = {StoreId : StoreId};
              db.collection('Quaca').find(query).toArray(function(err,rows){
                
                if(err){
                  console.log("데이터 에러 > ",err);
                }else{
                  if (!error && rows.length > 0) {
                    let UserPayId = groupBy(rows,'UserPayId');
                    var rowslenth = Object.keys(UserPayId).length;
                    var memberData = new Object();
  
                    var arrmemberOCData = new Array();
                    var arrmemberRCData = new Array();
                    var arrmemberCPData = new Array();
  
                    var pointHistoryOCItem = new Object();
                    var pointHistoryRCItem = new Object();
                    var pointHistoryCPItem = new Object();
  
                    var arrPointOCHistory = new Array();
                    var arrPointRCHistory = new Array();
                    var arrPointCPHistory = new Array();
                    
                    for(i=0; i<rowslenth; i++){
                      if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'OC'){
                            memberOCData = new Object();
                            memberOCData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                            memberOCData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                            memberOCData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDT;
                            memberOCData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                            memberOCData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                            memberOCData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                            memberOCData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                            arrPointOCHistory = new Array();
                            for(j=0; j< memberOCData.realCount; j++){
                                var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                                if( memberOCData.UserPayId == UserPayIdData ){
                                    pointHistoryOCItem = new Object();        
                                    pointHistoryOCItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                    pointHistoryOCItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                    pointHistoryOCItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                    pointHistoryOCItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                    pointHistoryOCItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                    pointHistoryOCItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
                                    arrPointOCHistory.push(pointHistoryOCItem);
                                }
                                memberOCData.OrderMenu = arrPointOCHistory;                      
                            }
                            arrmemberOCData.push(memberOCData);       
                          }else if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'RC' || UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'PC'){
                            memberRCData = new Object();
                            memberRCData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                            memberRCData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                            memberRCData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDT;
                            memberRCData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                            memberRCData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                            memberRCData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                            memberRCData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                            arrPointRCHistory = new Array();
                            for(j=0; j< memberRCData.realCount; j++){
                                var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                                if( memberRCData.UserPayId == UserPayIdData ){
                                    pointHistoryRCItem = new Object();        
                                    pointHistoryRCItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                    pointHistoryRCItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                    pointHistoryRCItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                    pointHistoryRCItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                    pointHistoryRCItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                    pointHistoryRCItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
                                    arrPointRCHistory.push(pointHistoryRCItem);
                                }
                                memberRCData.OrderMenu = arrPointRCHistory;                      
                            }
                            arrmemberRCData.push(memberRCData);   
                          }else if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'CP'){
                            memberCPData = new Object();
                            memberCPData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
                            memberCPData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
                            memberCPData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDT;
                            memberCPData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
                            memberCPData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
                            memberCPData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
                            memberCPData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
                            arrPointCPHistory = new Array();
                            for(j=0; j< memberCPData.realCount; j++){
                                var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
                                if( memberCPData.UserPayId == UserPayIdData ){
                                    pointHistoryCPItem = new Object();        
                                    pointHistoryCPItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
                                    pointHistoryCPItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
                                    pointHistoryCPItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
                                    pointHistoryCPItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
                                    pointHistoryCPItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
                                    pointHistoryCPItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
                                    arrPointCPHistory.push(pointHistoryCPItem);
                                }
                                memberCPData.OrderMenu = arrPointCPHistory;                      
                            }
                            arrmemberCPData.push(memberCPData);   
                          }
                      }
                      memberData.OCOrder = arrmemberOCData; 
                      memberData.RCOrder = arrmemberRCData;
                      memberData.CPOrder = arrmemberCPData;
                    resolve({ success: true, info: memberData ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
                }
            });
            }   
          });
      });
  }
  //통합 상태값 업데이트 전 조회
  var Orderselect = (StoreId,UserPayId,selectOrderStatus) =>{
    let StoreIdData = [StoreId,UserPayId,selectOrderStatus];
    return new Promise((resolve, reject) => {
        console.log('Orderselect 데이터 >',  StoreIdData);
        var selectSql = 'SELECT UserPayId,StoreId,OrderStatus FROM UserPay WHERE UserPayId = '
        +'"'+UserPayId+'"'+ ' AND StoreId = '
        +'"'+StoreId+'"'+' AND OrderStatus = '
        +'"'+selectOrderStatus+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("stsPriceMonth select error - ", Date());
                console.log("errno > " + error);
                reject({msg: error });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info:rows[0],code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
  }
//통합 상태값 업데이트 
var OrderUpdate = (StoreId,UserPayId,OrderStatus,MenuCompleteTime) =>{
  let QueryData = [StoreId,UserPayId,OrderStatus,MenuCompleteTime];
  return new Promise((resolve, reject) => {
      console.log('OrderUpdate Query 데이터 >',  QueryData);
      var sql1 = 'UPDATE UserPay SET OrderStatus=?,MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
      var sql2 = 'UPDATE UserPayDetail SET OrderStatus=?,MenuCompleteTime = ?  where StoreId=? and UserPayId = ?';
      var params =[OrderStatus,MenuCompleteTime,StoreId,UserPayId];
      conn.connection.query(sql1,params, function (error, rows, fields) {
          if (error) {
              console.log("UserPay Update error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          }else {
              conn.connection.query(sql2,params, function (error, rows, fields) { 
                  if(error) {
                      console.log("UserPayDetail Update error - ", Date());
                      console.log("errno > " + error);
                      reject({ code: error, msg: error });
                  }else{ 
                      console.log("UserPay,UserPayDetail테이블 Update success - ", Date());
                      resolve({ code: 0});
                  }
              }); 
          } 
      });
  });
}
//MongoDB 상태값 업데이트
var MongoOrderUpdate = (StoreId,UserPayId,OrderStatus,MenuCompleteTime) =>{
  let UpdateData = [StoreId,UserPayId,OrderStatus,MenuCompleteTime];
  return new Promise((resolve,reject)=> {
      console.log("Mongo OrderStatus Update data > ", UpdateData);
      MongoClient.connect(url, { useUnifiedTopology: true }, function (error, client) {
          if(error){
              console.log("errno > " + error);
              reject({ code: error, msg: error });
          }else{
              console.log("Mongo Connected successfully to server");
              var db = client.db('Quaca');
              var myquery = { UserPayId: UserPayId };
              var newvalues = { $set: {OrderStatus:OrderStatus, InsertDT: MenuCompleteTime } };
              db.collection('Quaca').updateMany(myquery, newvalues,function(err, res) {
                if(err) throw err;
                console.log("Mongo OrderStatus 수정 !");
                resolve({ code: 0});
              });
              
          }
      });
  });
};

var OrderAlarm = (StoreId) =>{
  let values=[StoreId,StoreId,StoreId]
  let sql = 'SELECT'
  +'(SELECT DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i:%s") FROM UserPay WHERE StoreId = ? AND OrderStatus = "OC" ORDER BY InsertDt DESC LIMIT 1) AS orderTime'
  +',(SELECT DATE_FORMAT(CancleTime, "%Y-%m-%d %H:%i:%s") FROM UserPay WHERE StoreId = ? AND OrderStatus = "CP" ORDER BY InsertDt DESC LIMIT 1) AS cancelTime'
  +',(SELECT COUNT(0) FROM UserPay WHERE StoreId = ? AND OrderStatus IN ("OC", "RC", "PC", "CP")) AS orderCnt';
  return new Promise((resolve, reject) => {
      conn.connection.query(sql, values, function (error, rows, fields) {

        if (error) {
            console.log("OrderAlarm select error - ", Date());
            console.log("errno > " + error);
            reject({  msg: error });
        } else {
          console.log("OrderAlarm select success - ",Date());
          console.log("OrderAlarm select success - ",rows);
          
          
          if (!error && rows.length > 0) {
            resolve({ success: true, info: rows ,code:0});
          } else if (!error && rows.length == 0) {
            resolve({ success: false, msg: null ,code:1});
          } else {
            resolve({ success: false, msg: error,code:2 });
          }
        }
      });
  });
}
//결제 취소 시 리워드 삭제
var CancleReward = (SsoKey,StoreId,PayInsertDt) =>{
  let CancleRewardData = [SsoKey,StoreId,PayInsertDt];
  return new Promise((resolve, reject) => {
      console.log('CancleReward Query 데이터 >',  CancleRewardData);
      var selectsql = 'select * from Reward where SsoKey = ?  and StoreId=? and InsertDt = ?';
      var params =[SsoKey,StoreId,PayInsertDt];
      //리워드 데이터 조회
      conn.connection.query(selectsql,params, function (error, rows, fields) {
          if (error) {
              console.log("Reward select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          //데이터 존재하면 삭제
          }else if(rows.length > 0  && !error){
              var deletesql = 'delete from Reward where SsoKey = ? and StoreId=? and InsertDt = ?';
              var params =[SsoKey,StoreId,PayInsertDt];
              conn.connection.query(deletesql,params, function (error, rows, fields) { 
                  if(error) {
                      console.log("Reward delete error - ", Date());
                      console.log("errno > " + error);
                      reject({ code: error, msg: error });
                  }else{ 
                      resolve({ success: true,code:0});
                  }; 
              });
          }else{
            console.log("Reward select - null ");
            resolve({  msg: null,code:0 });
          }
        });
    });
  };
  //결제 취소 시 쿠폰 삭제
var CancleCoupon = (SsoKey,StoreId,PayInsertDt) =>{
  let CancleCouponData = [SsoKey,StoreId,PayInsertDt];
  return new Promise((resolve, reject) => {
      console.log('CancleCoupon Query 데이터 >',  CancleCouponData);
      var selectsql = 'select * from Coupon where SsoKey = ?  and StoreId=? and InsertDt = ?';
      var params =[SsoKey,StoreId,PayInsertDt];
      //쿠폰 데이터 조회
      conn.connection.query(selectsql,params, function (error, rows, fields) {
          if (error) {
              console.log("Coupon select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          //데이터 존재하면 삭제
          }else if(rows.length > 0 && !error){
              var deletesql = 'delete from Coupon where SsoKey = ? and StoreId=? and InsertDt = ?';
              var params =[SsoKey,StoreId,PayInsertDt];
              conn.connection.query(deletesql,params, function (error, rows, fields) { 
                  if(error) {
                      console.log("Coupon delete error - ", Date());
                      console.log("errno > " + error);
                      reject({ code: error, msg: error });
                  }else{ 
                      resolve({ success: true,code:0});
                  }; 
              });
          }else{
            console.log("Coupon select - null ");
            resolve({  msg: null ,code:1});
          }
        });
    });
  };
//결제 취소 시 프리퀀시 조회
var SearchFrequency = (SsoKey,StoreId) =>{
  let SearchFrequencyData = [SsoKey,StoreId];
  return new Promise((resolve, reject) => {
      console.log('CancleReward Query 데이터 >',  SearchFrequencyData);
      var selectsql = 'select * from Frequency where SsoKey = ?  and StoreId=?';
      var params =[SsoKey,StoreId];
      //프리퀀시 데이터 조회
      conn.connection.query(selectsql,params, function (error, rows, fields) {
          if (error) {
              console.log("Frequnecy select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          }else{
            console.log("Frequnecy select - ",Date());
            resolve({  msg: null ,code:0,info:rows[0]});
          }
        });
    });
  };
//결제 취소 시 프리퀀시 삭제 - 쿠폰 값 존재
var CancleFreQuency = (SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic) =>{
  let CancleFreQuencyData = [SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic];
  return new Promise((resolve, reject) => {
      console.log('CancleFreQuency Query 데이터 >',  CancleFreQuencyData);
      var selectsql = 'select * from UserPayDetail where UserPayId=? and InsertDt = ?';
      var params =[UserPayId,PayInsertDt];
      //UserPayDetail 데이터 조회
      conn.connection.query(selectsql,params, function (error, rows, fields) {
          if (error) {
              console.log("FreQuency select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          //데이터 존재
          }else if(rows.length > 0 && !error){
              let MenuId = '';
              let OrderCnt = 0;
              let PaySpecial = 0;
              let PayBasic = 0;
              for(var i=0; i<rows.length; i++ ){
                MenuId = rows[i].MenuId;
                OrderCnt = Number(rows[i].OrderCnt);
                if(MenuId.substr(0,1) == 'S'){
                  PaySpecial += OrderCnt;
                  PayBasic += 0;
                }else{
                  PaySpecial += 0;
                  PayBasic += OrderCnt;
                }
              }
              let OriginSpecial = (Number(FrequencySpecial)+3)-(Number(PaySpecial))
              let OriginBasic = (Number(FrequencyBasic)+10)-(Number(PayBasic))
              //프리퀀시 삭제
              var deletesql = 'Update Frequency set  Special = ?,Basic=? where SsoKey = ? and StoreId = ? and InsertDt =?';
              var params =[OriginSpecial,OriginBasic,SsoKey,StoreId,PayInsertDt];
              conn.connection.query(deletesql,params, function (error, rows, fields) { 
                  if(error) {
                      console.log("FreQuency delete error - ", Date());
                      console.log("errno > " + error);
                      reject({ code: error, msg: error });
                  }else{ 
                      resolve({ success: true,code:0,InsertDt:PayInsertDt});
                  }; 
              });
          }else{
            console.log("FreQuency select - null ");
            reject({  msg: null,code:0 });
          }
        });
    });
  };
//결제 취소 시 프리퀀시 삭제 - 쿠폰값 존재 안함
var CancleFreQuency2 = (SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic) =>{
  let CancleFreQuencyData2 = [SsoKey,StoreId,PayInsertDt,UserPayId,FrequencySpecial,FrequencyBasic];
  return new Promise((resolve, reject) => {
      console.log('CancleFreQuency2 Query 데이터 >',  CancleFreQuencyData2);
      var selectsql = 'select * from UserPayDetail where UserPayId=? and InsertDt = ?';
      var params =[UserPayId,PayInsertDt];
      //UserPayDetail 데이터 조회
      conn.connection.query(selectsql,params, function (error, rows, fields) {
          if (error) {
              console.log("FreQuency select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
          //데이터 존재
          }else if(rows.length > 0 && !error){
              let MenuId = '';
              let OrderCnt = 0;
              let PaySpecial = 0;
              let PayBasic = 0;
              for(var i=0; i<rows.length; i++ ){
                MenuId = rows[i].MenuId;
                OrderCnt = Number(rows[i].OrderCnt);
                if(MenuId.substr(0,1) == 'S'){
                  PaySpecial += OrderCnt;
                  PayBasic += 0;
                }else{
                  PaySpecial += 0;
                  PayBasic += OrderCnt;
                }
              }
              let OriginSpecial = Number(FrequencySpecial)-Number(PaySpecial);
              let OriginBasic = Number(FrequencyBasic)-Number(PayBasic);
              //프리퀀시 삭제
              var deletesql = 'Update Frequency set  Special = ?,Basic=? where SsoKey = ? and StoreId = ? and InsertDt =?';
              var params =[OriginSpecial,OriginBasic,SsoKey,StoreId,PayInsertDt];
              conn.connection.query(deletesql,params, function (error, rows, fields) { 
                  if(error) {
                      console.log("FreQuency delete error - ", Date());
                      console.log("errno > " + error);
                      reject({ code: error, msg: error });
                  }else{ 
                      resolve({ success: true,code:0,InsertDt:PayInsertDt});
                  }; 
              });
          }else{
            console.log("FreQuency select - null ");
            reject({  msg: null,code:0 });
          }
        });
    });
  };
exports.OCorderlist = OCorderlist
exports.TotalOrderlist = TotalOrderlist
exports.OCRCchange = OCRCchange
exports.OCrollback = OCrollback
exports.RCorderlist = RCorderlist
exports.RCPCchange = RCPCchange
exports.RCrollback = RCrollback
exports.PCPUCchange = PCPUCchange
exports.PCrollback = PCrollback
exports.DashBoard = DashBoard
exports.DashBoard2 = DashBoard2
exports.paymentList = paymentList
exports.paymentListweek = paymentListweek
exports.paymentListmonth = paymentListmonth
exports.paymentListmonth3 = paymentListmonth3
exports.paymentListDetail = paymentListDetail
exports.orderlistDetail = orderlistDetail
exports.CPorderlist = CPorderlist
exports.MongoSelectPayInfo = MongoSelectPayInfo
exports.CanclePayUpdate = CanclePayUpdate
exports.CUPorderlist = CUPorderlist
exports.OCRCCP = OCRCCP
exports.CPLastList = CPLastList
exports.Orderselect = Orderselect
exports.OrderUpdate = OrderUpdate
exports.MongoOrderUpdate = MongoOrderUpdate
exports.OrderAlarm = OrderAlarm
exports.CancleReward = CancleReward
exports.CancleCoupon = CancleCoupon
exports.SearchFrequency = SearchFrequency
exports.CancleFreQuency = CancleFreQuency
exports.CancleFreQuency2 = CancleFreQuency2


// exports.allorderlist = allorderlist
// exports.orderlistDetail = orderlistDetail

// exports.stsPriceDay = stsPriceDay
// exports.stsPriceWeek = stsPriceWeek
// exports.stsPriceMonth = stsPriceMonth
// exports.stsDivPriceDay = stsDivPriceDay
// exports.stsDivPriceWeek = stsDivPriceWeek
// exports.stsDivPriceMonth = stsDivPriceMonth

//OCRCPCCP 리스트 (속도테스트)
// var OCRCCP = (StoreId) =>{
//   let StoreIdData = [StoreId];
//   return new Promise((resolve, reject) => {
//       console.log('OCRCCP StoreId 데이터 >',  StoreIdData);
//       var selectSql = 'SELECT a.UserPayId AS UserPayId,c.UserPayDid AS UserPayDid,SUBSTRING(c.UserPayDid,9,3) AS OrderNum ,date_format(a.insertDt, "%Y-%m-%d %H:%i") AS InsertDt,b.NickName AS NickName, c.MenuName AS MenuName,a.OrderCnt AS OrderCnt,c.OrderCnt AS OrderCntDetail ,a.OrderStatus as OrderStatus, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC  ,(SELECT COUNT(0) FROM UserPayDetail UPD WHERE UPD.UserPayId = a.UserPayId ) AS realCount  	FROM UserPay a, User b, UserPayDetail c WHERE a.SsoKey=b.SsoKey AND a.UserPayId = c.UserPayid AND a.StoreId = '
//       +'"'+StoreIdData+'"'
//       conn.connection.query(selectSql, function (error, rows, fields) {
//           if (error) {
//               console.log("OCRCCP select error - ", Date());
//               console.log("errno > " + error);
//               reject({  msg: error });
//             } else {
//               if (!error && rows.length > 0) {
//                   let UserPayId = groupBy(rows,'UserPayId');
//                   var rowslenth = Object.keys(UserPayId).length;
//                   var memberData = new Object();

//                   var arrmemberOCData = new Array();
//                   var arrmemberRCData = new Array();
//                   var arrmemberCPData = new Array();

//                   var pointHistoryOCItem = new Object();
//                   var pointHistoryRCItem = new Object();
//                   var pointHistoryCPItem = new Object();

//                   var arrPointOCHistory = new Array();
//                   var arrPointRCHistory = new Array();
//                   var arrPointCPHistory = new Array();
                  
//                   for(i=0; i<rowslenth; i++){
//                     if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'OC'){
//                           memberOCData = new Object();
//                           memberOCData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
//                           memberOCData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
//                           memberOCData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
//                           memberOCData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
//                           memberOCData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
//                           memberOCData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
//                           memberOCData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
//                           arrPointOCHistory = new Array();
//                           for(j=0; j< memberOCData.realCount; j++){
//                               var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
//                               if( memberOCData.UserPayId == UserPayIdData ){
//                                   pointHistoryOCItem = new Object();        
//                                   pointHistoryOCItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
//                                   pointHistoryOCItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
//                                   pointHistoryOCItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
//                                   pointHistoryOCItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
//                                   pointHistoryOCItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
//                                   pointHistoryOCItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
//                                   arrPointOCHistory.push(pointHistoryOCItem);
//                               }
//                               memberOCData.OrderMenu = arrPointOCHistory;                      
//                           }
//                           arrmemberOCData.push(memberOCData);       
//                         }else if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'RC' || UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'PC'){
//                           memberRCData = new Object();
//                           memberRCData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
//                           memberRCData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
//                           memberRCData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
//                           memberRCData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
//                           memberRCData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
//                           memberRCData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
//                           memberRCData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
//                           arrPointRCHistory = new Array();
//                           for(j=0; j< memberRCData.realCount; j++){
//                               var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
//                               if( memberRCData.UserPayId == UserPayIdData ){
//                                   pointHistoryRCItem = new Object();        
//                                   pointHistoryRCItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
//                                   pointHistoryRCItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
//                                   pointHistoryRCItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
//                                   pointHistoryRCItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
//                                   pointHistoryRCItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
//                                   pointHistoryRCItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
//                                   arrPointRCHistory.push(pointHistoryRCItem);
//                               }
//                               memberRCData.OrderMenu = arrPointRCHistory;                      
//                           }
//                           arrmemberRCData.push(memberRCData);   
//                         }else if(UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus == 'CP'){
//                           memberCPData = new Object();
//                           memberCPData.UserPayId = UserPayId[Object.keys(UserPayId)[i]][0].UserPayId;
//                           memberCPData.OrderNum = UserPayId[Object.keys(UserPayId)[i]][0].OrderNum;
//                           memberCPData.InsertDt = UserPayId[Object.keys(UserPayId)[i]][0].InsertDt;
//                           memberCPData.NickName = UserPayId[Object.keys(UserPayId)[i]][0].NickName;
//                           memberCPData.OrderStatus = UserPayId[Object.keys(UserPayId)[i]][0].OrderStatus;
//                           memberCPData.OrderCnt = UserPayId[Object.keys(UserPayId)[i]][0].OrderCnt;
//                           memberCPData.realCount = UserPayId[Object.keys(UserPayId)[i]][0].realCount;
//                           arrPointCPHistory = new Array();
//                           for(j=0; j< memberCPData.realCount; j++){
//                               var UserPayIdData = UserPayId[Object.keys(UserPayId)[i]][j].UserPayId;
//                               if( memberCPData.UserPayId == UserPayIdData ){
//                                   pointHistoryCPItem = new Object();        
//                                   pointHistoryCPItem.MenuName = UserPayId[Object.keys(UserPayId)[i]][j].MenuName;
//                                   pointHistoryCPItem.UserPayDid = UserPayId[Object.keys(UserPayId)[i]][j].UserPayDid;
//                                   pointHistoryCPItem.OptionA = UserPayId[Object.keys(UserPayId)[i]][j].OptionA;
//                                   pointHistoryCPItem.OptionB = UserPayId[Object.keys(UserPayId)[i]][j].OptionB;
//                                   pointHistoryCPItem.OptionC = UserPayId[Object.keys(UserPayId)[i]][j].OptionC;
//                                   pointHistoryCPItem.OrderCntDetail = UserPayId[Object.keys(UserPayId)[i]][j].OrderCntDetail;
//                                   arrPointCPHistory.push(pointHistoryCPItem);
//                               }
//                               memberCPData.OrderMenu = arrPointCPHistory;                      
//                           }
//                           arrmemberCPData.push(memberCPData);   
//                         }
//                     }
//                     memberData.OCOrder = arrmemberOCData; 
//                     memberData.RCOrder = arrmemberRCData;
//                     memberData.CPOrder = arrmemberCPData;
//                   resolve({ success: true, info: memberData ,code:0});
//                 } else if (!error && rows.length == 0) {
//                   resolve({ success: false, msg: null ,code:1});
//                 } else {
//                   resolve({ success: false, msg: error,code:2 });
//                 }
//             }  
//           });
//       });
//   }

