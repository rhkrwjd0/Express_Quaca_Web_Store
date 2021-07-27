var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_001 로그인
var login = (SID,PassWord) =>{
    let loginData = [SID,PassWord];
    return new Promise((resolve, reject) => {
        console.log('login  데이터 >',  loginData);
        var selectSql = 'SELECT m.Seq,m.SID,m.PassWord,m.Token,m.StoreId,m.TelNo,m.UseYn,DATE_FORMAT(m.InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,m.Theme ,s.StoreName FROM MUser m LEFT JOIN StoreInfo s ON m.StoreId = s.StoreId where m.SID = '
                    + '"' + SID + '"' + 'and m.PassWord = ' + "'" + PassWord + "'"+' and m.UseYn = "Y"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("login select error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error.sqlMessage });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows[0] ,code:0});
                  } else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QS_031 회원가입
var signup = (SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt) =>{
    let signupData = [SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt];
    return new Promise((resolve, reject) => {
        console.log('signup  데이터 >',  signupData);
        var sql = 'insert into MUser(SID,PassWord,Token,StoreId,TelNo,UseYn,Theme,InsertDt)  values(?,?,?,?,?,?,?,?)';
        var params =[SID,PassWord,Token,StoreId,TelNo,UseYn,InsertDt];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if (error) {
            console.log("boardinsert insert error - ", Date());
            console.log("errno > " + error);
            reject({  msg: error });
          }else{
              resolve({ success: true  ,code:0});
          }  
        });
    });
}
//QSW_002_2 아이디 찾기
var forgetSID = (StoreId,TelNo) =>{
  let forgetSIDData = [StoreId,TelNo];
  return new Promise((resolve, reject) => {
      console.log(' forgetSIDData 데이터 >',  forgetSIDData);
      var selectSql ='SELECT SID FROM MUser WHERE StoreId = '
                     +"'" + StoreId + "'"+ 'and TelNo = ' + "'" + TelNo + "'";;
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("forgetSIDData select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QS_032 비밀번호 찾기
var forgetpassword = (SID,TelNo) =>{
  let forgetpasswordData = [SID,TelNo];
  return new Promise((resolve, reject) => {
      console.log('login  데이터 >',  forgetpasswordData);
      var selectSql ='SELECT PassWord FROM MUser WHERE SID = '
                    + "'" + SID+"'"+' and TelNo = '+"'" + TelNo + "'";
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("forgetpassword select error - ", Date());
              console.log("errno > " + error);
              reject({  msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW_002_1 비밀번호 변경
var updatepw = (SID,PassWord) =>{
  let PassWordData = [SID,PassWord];
  return new Promise((resolve, reject) => {
      console.log('비밀번호 데이터 >',  PassWordData);
      var sql = 'UPDATE MUser SET PassWord=? WHERE SID= ?';
      var params =[PassWord,SID];
      conn.connection.query(sql,params, function (error, rows, fields) {
        var selectSql = 'SELECT SEQ,SID,PassWord,StoreId,Token,TelNo,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM MUser where SId = '
                    + '"' + SID + '"' + 'and PassWord = ' + "'" + PassWord + "'";
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("login select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
      });
  });
}

//QS_027 사용자 토큰 수정
var tokenupdate = (SID,Token) =>{
  let tokenData = [SID,Token];
  return new Promise((resolve, reject) => {
      console.log('토큰  데이터 >',  tokenData);
      var sql = 'UPDATE MUser SET Token=? WHERE SID= ?';
      var params =[Token,SID];
      conn.connection.query(sql,params, function (error, rows, fields) {
        var selectSql = 'SELECT SEQ,SID,PassWord,StoreId,Token,TelNo,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM MUser where SId = '
                    + '"' + SID + '"' + 'and Token = ' + "'" + Token + "'";
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("login select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
      });
  });
}
//QSW_025 회원 관리 - 목록 - 
var memberList = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('memberList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT a.UserId,a.NickName, a.TelNo AS TelNo,date_format(a.InsertDt, "%Y-%m-%d %H:%i") AS InsertDt, b.StoreId AS StoreId,date_format(b.InsertDt, "%Y-%m-%d %H:%i") AS lastOrderDt,count(b.UserPayId) AS TotalOrderCnt FROM User a left join UserPay b  ON a.SsoKey=b.SsoKey WHERE b.StoreId = '
          + "'"  +StoreIdData +"'"+' GROUP BY a.UserId';
      
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("memberList select error - ", Date());
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
//QSW_025 회원 관리_3 - 목록 - 사용자 매장별 - 상세
var memberinfo = (UserId,StoreId) =>{
  let StoreIdData = [UserId,StoreId];
  return new Promise((resolve, reject) => {
      console.log('memberinfo 데이터 >',  StoreIdData);
      var selectSql = 'SELECT a.UserId as UserId,a.SsoKey as SsoKey,a.NickName AS NickName, a.Token as Token,a.Email as Email,a.LoginType as LoginType,a.TelNo AS TelNo,a.UseYn as UseYn,b.StoreId as StoreId,date_format(a.InsertDt, "%Y-%m-%d %H:%i") AS InsertDt, date_format(b.InsertDt, "%Y-%m-%d %H:%i") AS lastOrderDt,count(b.UserPayId) AS TotalOrderCnt FROM User a left join UserPay b ON a.SsoKey = b.SsoKey WHERE a.UserId = '
          + "'" +UserId+"'"+' and b.StoreId = '+"'"+StoreId+"'"+' Group By b.StoreId';
      
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("memberinfo select error - ", Date());
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
//QSW_026 회원 관리 - 수정
var memberUpdate = (UserId,NickName,TelNo) =>{
  let memberUpdateData = [UserId,NickName,TelNo];
  return new Promise((resolve, reject) => {
      console.log('memberUpdate 데이터 >',  memberUpdateData);
      var sql = 'UPDATE User SET NickName=?,TelNo = ? WHERE UserId= ?';
      var params =[NickName,TelNo,UserId];
      conn.connection.query(sql,params, function (error, rows, fields) {
        var selectSql = 'SELECT UserId,SsoKey,Token,Email,LoginType,NickName,TelNo,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM User where UserId = '
                    +'"'+UserId+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("memberUpdate select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
            } else {
              if (!error && rows.length > 0) {
                  resolve({ success: true, info: rows[0] ,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
      });
  });
}
//QSW_027 회원 관리 - 주문내역
var memberOrderList = (UserId,StoreId) =>{
  let StoreIdData = [UserId,StoreId];
  return new Promise((resolve, reject) => {
      console.log('memberOrderList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT a.FirstMenuName AS FirstMenuName, a.OrderCnt AS OrderCnt, a.TotalPrice AS TotalPrice, date_format(a.PayCompleteTime, "%Y-%m-%d %H:%i") AS PayCompleteTime, a.OrderStatus AS OrderStatus FROM UserPay a, User b WHERE a.SsoKey = b.SsoKey AND b.UserId =  '
          + "'" +UserId+"'"+' and a.StoreId = '+"'"+StoreId+"'"+' ORDER BY PayCompleteTime DESC';
      
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("memberOrderList select error - ", Date());
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
//QSW_028  회원 관리 - 선불 카드 내역
var PreCardInfo = (UserId,StoreId) =>{
  let StoreIdData = [UserId,StoreId];
  return new Promise((resolve, reject) => {
      console.log('PreCardInfo 데이터 >',  StoreIdData);
      var selectSql = 'SELECT StoreId, UserId, CardCode, CardNum,PayMethod, UseAmount, ReAmount,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM PreCardInfo WHERE UserId =  '
          + "'" +UserId+"'"+' and StoreId = '+"'"+StoreId+"'"+' ORDER BY UpdateDt DESC';
      
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("PreCardInfo select error - ", Date());
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
//QSW_029  회원 관리 - 쿠폰 내역
var CouponList = (UserId,StoreId) =>{
  let StoreIdData = [UserId,StoreId];
  return new Promise((resolve, reject) => {
      console.log('CouponList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT a.StoreId AS StoreId,b.UserId, a.SsoKey AS SsoKey, a.Title AS Title, a.Contents AS Contents,CONCAT(a.InsertDt," ~ ",a.EndDate) AS StartEndDate,a.Used AS Used,a.UseDate AS UseDate FROM Coupon a, User b WHERE a.SsoKey = b.SsoKey AND a.StoreId =  '
          + "'" +StoreId+"'"+' and b.UserId = '+"'"+UserId+"'"+' ORDER BY a.EndDate desc';
      
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("CouponList select error - ", Date());
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
exports.login = login
exports.signup = signup
exports.forgetpassword = forgetpassword
exports.updatepw = updatepw
exports.forgetSID = forgetSID
exports.tokenupdate = tokenupdate
exports.memberList = memberList
exports.memberinfo = memberinfo
exports.memberUpdate = memberUpdate
exports.memberOrderList = memberOrderList
exports.PreCardInfo = PreCardInfo
exports.CouponList = CouponList