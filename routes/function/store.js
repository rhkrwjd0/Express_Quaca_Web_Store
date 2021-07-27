var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QSW_012 매장정보
var store = (StoreId) =>{
    let StoreData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('store  데이터 >',  StoreData);
        var selectSql = 'SELECT StoreId,StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,SigunguCode,MainImgUrl,DetailImgUrl,UseYn,date_format(insertDt, "%Y-%m-%d %H:%i") AS insertDt '
        +' , ('
        +'     SELECT caf.FileId '
        +'     FROM CommAttachFile caf '
        +'     WHERE caf.DelYn = "N"'
        +'     AND caf.Type = "S"'
        +'     AND caf.StoreId = s.StoreId'
        +'     ORDER BY caf.InsertDT DESC LIMIT 1 '
        +'   ) AS FileId'
        +'   , ( '
        +'     SELECT caf.FilePath '
        +'     FROM CommAttachFile caf '
        +'     WHERE caf.DelYn = "N"'
        +'     AND caf.Type = "S"'
        +'     AND caf.StoreId = s.StoreId'
        +'     ORDER BY caf.InsertDT DESC LIMIT 1'
        +'   ) AS FilePath'
        +'   , ('
        +'     SELECT caf.FileEncNm '
        +'     FROM CommAttachFile caf '
        +'     WHERE caf.DelYn = "N"'
        +'     AND caf.Type = "S"'
        +'     AND caf.StoreId = s.StoreId'
        +'     ORDER BY caf.InsertDT DESC LIMIT 1'
        +'   ) AS FileEncNm'
        +'   , ('
        +'     SELECT caf.FileOrgNm'
        +'     FROM CommAttachFile caf '
        +'     WHERE caf.DelYn = "N"'
        +'     AND caf.Type = "S"'
        +'     AND caf.StoreId = s.StoreId'
        +'     ORDER BY caf.InsertDT DESC LIMIT 1'
        +'   ) AS FileOrgNm '
        +'   FROM StoreInfo s where StoreId = '
        + '"' +StoreId + '"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("store select error - ", Date());
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
}
//QS_025, 매장정보 수정(통합)
var Supdate = (StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId) =>{
  let SupdateData = [StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId];
  return new Promise((resolve, reject) => {
      console.log('SupdateData  데이터 >',  SupdateData);
      //수정
      var sql = 'UPDATE StoreInfo SET StoreName = ?,OpenTime=?,CloseTime=?,DayOff=?,TelNo=?,Addr1=?,Addr2=?,Lat=?,Lon=?,MainImgUrl=? WHERE StoreId = ?'
      var params =[StoreName,OpenTime,CloseTime,DayOff,TelNo,Addr1,Addr2,Lat,Lon,MainImgUrl,StoreId];
      conn.connection.query(sql,params, function (error, rows, fields) {
        //수정 후 재조회
        var selectSql = 'SELECT b.StoreId AS StoreId,b.StoreName AS StoreName, b.OpenTime AS OpenTime,b.CloseTime AS CloseTime,b.DayOff AS DayOff,b.TelNo AS TelNo,b.Addr1 AS Addr1,b.Addr2 AS Addr2,b.Lat AS Lat,b.Lon AS Lon,b.SigunguCode AS SigunguCode,b.MainImgUrl AS MainImgUrl,b.DetailImgUrl AS DetailImgUrl,b.UseYn AS UseYn,DATE_FORMAT(b.InsertDT, "%Y-%m-%d %H:%i") AS InsertDT FROM MUser a, StoreInfo b WHERE a.StoreId = b.StoreId and a.StoreId= '
                     + "'" + StoreId+"'";
        conn.connection.query(selectSql, function (err, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("salestimeData update error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
          }else{
            resolve({ success: true  ,code:0, rows:rows, lenth:rows.length});
          }  
      });
  }); 
  })
}
//QSW_014 카테고리 목록
var category = (StoreId) =>{
  let StoreData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('category store  데이터 >',  StoreData);
      var selectSql = 'SELECT SID,StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,Useyn,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM Category where StoreId = '
                      +'"' +StoreId + '"'+'Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("category select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
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
//QSW_014 카테고리 목록
var category = (StoreId,UseYn) =>{
  let StoreData = [StoreId,UseYn];
  return new Promise((resolve, reject) => {
      console.log('category store  데이터 >',  StoreData);
      var selectSql = 'SELECT SID,StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM Category where StoreId = '
                      +'"' +StoreId + '"'+' and UseYn like '+"'%"+UseYn+"%'" +'Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("category select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
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
//QSW_014_2 카테고리 목록-상세
var categoryDetail = (StoreId,SID) =>{
  let StoreData = [StoreId,SID];
  return new Promise((resolve, reject) => {
      console.log('categoryDetail store  데이터 >',  StoreData);
      var selectSql = 'SELECT SID,StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM Category where StoreId = '
                      +'"' +StoreId + '"'+' and SID = '+'"'+SID+'"' +' Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("categoryDetail select error - ", Date());
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
}
//QSW_014_3 카테고리 목록-상세- not in
var categorymenu = (StoreId) =>{
  let StoreData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('categorymenu store  데이터 >',  StoreData);
      var selectSql = 'SELECT * FROM Category WHERE cateCd NOT IN ("F", "O") AND StoreId = '
                      +'"' +StoreId + '"'+ ' GROUP BY CateCd Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("categorymenu select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
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
//QSW_014_4 카테고리 목록-상세- 카테고리별 정렬
var categorymid = (StoreId,CateCd) =>{
  let StoreData = [StoreId,CateCd];
  return new Promise((resolve, reject) => {
      console.log('categorymid store  데이터 >',  StoreData);
      var selectSql = 'SELECT * FROM Category WHERE cateCd = '
                      +'"' +CateCd + '"'+' and StoreId = '+'"'+StoreId+'"' +' and UseYn = "Y" GROUP BY MidCateCD Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("categorymid select error - ", Date());
              console.log("errno > " + error);
              reject({ msg: error });
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
//QSW_015 카테고리 등록 
var categoryInsert = (StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDtail) =>{
  let StoreData = [StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDtail];
  let UpdateDt = (null);
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  let UseYn = 'Y';
  return new Promise((resolve, reject) => {
    console.log('categoryInsert  데이터 >',  StoreData);
    //등록
    var sql = 'INSERT INTO Category(StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn,UpdateDt,InsertDt) SELECT ?,?,?,?,?,?,?,?,? FROM DUAL;';
    var params =[StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDtail,UseYn,UpdateDt,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      //등록 후 재조회
      var selectSql = 'SELECT StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,Useyn,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM Category where StoreId = '
      +'"' +StoreId + '"'+'Order By InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
        if (error || rows.length == 0  ||rows.length == undefined ) {
          console.log("categoryInsert - select  error - ", Date());
          console.log("error > " + error);
          reject({ msg: error });
          }else{
             resolve({ success: true  ,code:0, info:rows[0]});
          }  
        });
     }); 
  });
}
//QSW_015_2 카테고리 수정
var categoryUpdate = (StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn) =>{
  let StoreData = [StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('categoryUpdate  데이터 >',  StoreData);
    //수정
    var sql = 'UPDATE Category SET CateCd = ?, CateNm = ?,MidCateCd=?,MidCateNm=?,CateDetail=?,UseYn=?,UpdateDt=? WHERE StoreId = ? and CateCd = ? and MidCateCd=? '
    var params =[CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,UseYn,UpdateDt,StoreId,CateCd,MidCateCd];
    conn.connection.query(sql,params, function (error, rows, fields) {
      //수정 후 재조회
      var selectSql = 'SELECT StoreId,CateCd,CateNm,MidCateCd,MidCateNm,CateDetail,Useyn,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM Category where StoreId = '
      +'"' +StoreId +'"'+' and CateCd = '+'"' +CateCd + '"'+' and MidCateCd = '+'"' +MidCateCd + '"' +'Order By UpdateDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
        if (error || rows.length == 0  ||rows.length == undefined ) {
          console.log("categoryUpdate - select  error - ", Date());
          console.log("error > " + error);
          reject({ msg: error });
          }else{
             resolve({ success: true  ,code:0, info:rows[0]});
          }  
        });
     }); 
  });
}
//QSW_018 직원목록
var staffList = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('staffList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT SID,StoreId,ClassCd, ClassNm, EmployeeCd,EmployeeNm, PhoneNum, UseYn, date_format(StartDt, "%Y-%m-%d") as StartDt,date_format(EndDt, "%Y-%m-%d") as EndDt,date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM Employee WHERE StoreId = '
      +'"'+StoreId+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("staffList select error - ", Date());
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
//QSW_018_2 직원목록 - 상세
var staffListDetail = (StoreId,EmployeeCd) =>{
  let StoreIdData = [StoreId,EmployeeCd];
  return new Promise((resolve, reject) => {
      console.log('staffList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT SID,StoreId,ClassCd, ClassNm, EmployeeCd,EmployeeNm, PhoneNum, UseYn, date_format(StartDt, "%Y-%m-%d") as StartDt,date_format(EndDt, "%Y-%m-%d") as EndDt,date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM Employee WHERE StoreId = '
      +'"'+StoreId+'"'+' and EmployeeCd = '+'"'+EmployeeCd+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("staffList select error - ", Date());
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
//QSW_019 직원 관리 - 등록 
var staffInsert = (StoreId,ClassCd,ClassNm,EmployeeNm,PhoneNum,StartDt) =>{
  let StoreData = [StoreId,ClassCd,ClassNm,EmployeeNm,PhoneNum,StartDt];
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  let UseYn = 'Y';
  return new Promise((resolve, reject) => {
    console.log('staffInsert  데이터 >',  StoreData);
    //등록
    var sql = 'INSERT INTO Employee(StoreId,ClassCd,ClassNm,EmployeeCd,EmployeeNm,PhoneNum,UseYn,StartDt,InsertDt) SELECT ?,?,?,(select CONCAT(? ,LPAD((SELECT COUNT(*)+1 FROM Employee WHERE StoreId = ?),3,"0")) AS ClassCd FROM DUAL),?,?,?,?,? FROM DUAL';
    var params =[StoreId,ClassCd,ClassNm,StoreId,StoreId,EmployeeNm,PhoneNum,UseYn,StartDt,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //등록 후 재조회
        var selectSql = 'SELECT StoreId,ClassCd, ClassNm, EmployeeCd,EmployeeNm, PhoneNum, UseYn, date_format(StartDt, "%Y-%m-%d") as StartDt,date_format(EndDt, "%Y-%m-%d") as EndDt,date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM Employee WHERE StoreId = '
        +'"'+StoreId+'"'+' Order By InsertDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("staffInsert - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
        }
     }); 
     
  });
}
//QSW_019_2 직원 관리 - 수정
var staffUpdate = (StoreId,ClassCd,ClassNm,EmployeeCd,EmployeeNm,PhoneNum,UseYn,StartDt,EndDt) =>{
  let StoreData = [StoreId,ClassCd,ClassNm,EmployeeCd,EmployeeNm,PhoneNum,UseYn,StartDt,EndDt];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  console.log('1. endDt = ',EndDt);
  if(EndDt == '' || null){
    EndDt = null;
  }
  console.log('2. endDt = ',EndDt);
  return new Promise((resolve, reject) => {
    console.log('staffUpdate  데이터 >',  StoreData);
    //수정
    var sql = 'UPDATE Employee SET ClassCd = ?,ClassNm=?,EmployeeNm=?,PhoneNum=?,UseYn=?,StartDt=?,EndDt=?,UpdateDt=? WHERE StoreId = ? and EmployeeCd = ?'
    var params =[ClassCd,ClassNm,EmployeeNm,PhoneNum,UseYn,StartDt,EndDt,UpdateDt,StoreId,EmployeeCd];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //수정 후 재조회
        var selectSql = 'SELECT StoreId,ClassCd, ClassNm, EmployeeCd,EmployeeNm, PhoneNum, UseYn, date_format(StartDt, "%Y-%m-%d") as StartDt,date_format(EndDt, "%Y-%m-%d") as EndDt,date_format(UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM Employee WHERE StoreId = '
        +'"'+StoreId+'"'+' Order By UpdateDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("categoryUpdate - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
      }
     }); 
  });
}
//QSW_020 행사 목록
var eventList = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('eventList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT e.SID,e.StoreId,e.CateCd,e.MenuId,e.EventType, e.EventCd,e.EventNm, e.SaleType, e.SaleValue, e.UseYn, DATE_FORMAT(e.StartDt, "%Y-%m-%d") as StartDt, DATE_FORMAT(e.EndDt, "%Y-%m-%d") as EndDt, DATE_FORMAT(e.UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt,DATE_FORMAT(e.InsertDt, "%Y-%m-%d %H:%i") as InsertDt , IF( e.EventType = "F", NULL, (	 SELECT m.MenuName FROM Menu m WHERE m.StoreId = e.StoreId AND m.MenuId = e.MenuId ) ) AS MenuName FROM Event e WHERE e.StoreId = '
      +'"'+StoreId+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("eventList select error - ", Date());
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
//QSW_020_2 행사 목록-상세
var eventListDetail = (StoreId,EventCd) =>{
  let StoreIdData = [StoreId,EventCd];
  return new Promise((resolve, reject) => {
      console.log('eventListDetail 데이터 >',  StoreIdData);
      var selectSql = 'SELECT e.SID,e.StoreId,e.CateCd,e.MenuId,e.EventType, e.EventCd,e.EventNm, e.SaleType, e.SaleValue, e.UseYn, DATE_FORMAT(e.StartDt, "%Y-%m-%d") as StartDt, DATE_FORMAT(e.EndDt, "%Y-%m-%d") as EndDt, DATE_FORMAT(e.UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt,DATE_FORMAT(e.InsertDt, "%Y-%m-%d %H:%i") as InsertDt , IF( e.EventType = "F", NULL, (	 SELECT m.MenuName FROM Menu m WHERE m.StoreId = e.StoreId AND m.MenuId = e.MenuId ) ) AS MenuName FROM Event e WHERE e.StoreId = '
      +'"'+StoreId+'"'+' and EventCd = '+'"'+EventCd+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("eventListDetail select error - ", Date());
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
//QSW_021 행사 등록
var eventInsert = (StoreId,CateCd,MenuId,EventType,EventNm,SaleType,SaleValue,StartDt,EndDt) =>{
  let StoreData = [StoreId,CateCd,MenuId,EventType,EventNm,SaleType,SaleValue,StartDt,EndDt];
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  let UseYn = 'Y';
  return new Promise((resolve, reject) => {
    console.log('eventInsert  데이터 >',  StoreData);
    //등록
    var sql = 'INSERT INTO Event(StoreId,CateCd,MenuId,EventType,EventCd,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn,InsertDt) SELECT ?,?,?,?,(select CONCAT(? ,LPAD((SELECT COUNT(*)+1 FROM Event WHERE StoreId = ?),4,"0")) AS ClassCd FROM DUAL),?,?,?,?,?,?,? FROM DUAL';
    var params =[StoreId,CateCd,MenuId,EventType,StoreId,StoreId,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //등록 후 재조회
        var selectSql = 'SELECT e.SID,e.StoreId,e.CateCd,e.MenuId,e.EventType, e.EventCd,e.EventNm, e.SaleType, e.SaleValue, e.UseYn, DATE_FORMAT(e.StartDt, "%Y-%m-%d") as StartDt, DATE_FORMAT(e.EndDt, "%Y-%m-%d") as EndDt, DATE_FORMAT(e.UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt,DATE_FORMAT(e.InsertDt, "%Y-%m-%d %H:%i") as InsertDt , IF( e.EventType = "F", NULL, (	 SELECT m.MenuName FROM Menu m WHERE m.StoreId = e.StoreId AND m.MenuId = e.MenuId ) ) AS MenuName FROM Event e WHERE e.StoreId = '
      +'"'+StoreId+'"'+' ORDER BY e.InsertDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("eventInsert - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
        }
     }); 
     
  });
}
//QSW_021_2 행사 수정
var eventUpdate = (StoreId,CateCd,MenuId,EventType,EventCd,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn) =>{
  let StoreData = [StoreId,CateCd,MenuId,EventType,EventCd,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('eventUpdate  데이터 >',  StoreData);
    //수정
    var sql = 'UPDATE Event SET CateCd = ?,MenuId=?,EventType=?,EventNm=?,SaleType=?,SaleValue=?,StartDt=?,EndDt=?,UseYn=?,UpdateDt=? WHERE StoreId = ? and EventCd = ?'
    var params =[CateCd,MenuId,EventType,EventNm,SaleType,SaleValue,StartDt,EndDt,UseYn,UpdateDt,StoreId,EventCd];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //수정 후 재조회
        var selectSql = 'SELECT e.SID,e.StoreId,e.CateCd,e.MenuId,e.EventType, e.EventCd,e.EventNm, e.SaleType, e.SaleValue, e.UseYn, DATE_FORMAT(e.StartDt, "%Y-%m-%d") as StartDt, DATE_FORMAT(e.EndDt, "%Y-%m-%d") as EndDt, DATE_FORMAT(e.UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt,DATE_FORMAT(e.InsertDt, "%Y-%m-%d %H:%i") as InsertDt , IF( e.EventType = "F", NULL, (	 SELECT m.MenuName FROM Menu m WHERE m.StoreId = e.StoreId AND m.MenuId = e.MenuId ) ) AS MenuName FROM Event e WHERE e.StoreId =  '
      +'"'+StoreId+'"'+' ORDER BY e.UpdateDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("eventUpdate - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
      }
     }); 
  });
}
//QSW_020-1 행사-프리퀀시 관리 목록
var eventfrequencyList = (EventCd) =>{
  let StoreIdData = [EventCd];
  return new Promise((resolve, reject) => {
      console.log('eventfrequencyList 데이터 >',  EventCd);
      var selectSql = 'SELECT a.StoreId,a.CateCd,a.EventCd AS EventCd,a.EventNm,b.OptionA AS OptionA ,b.CntA AS CntA, b.OptionB AS OptionB, b.CntB AS CntB,b.OptionC AS OptionC,b.CntC AS CntC,b.Present,DATE_FORMAT(a.StartDt, "%Y-%m-%d") as StartDt,DATE_FORMAT(a.EndDt, "%Y-%m-%d") as EndDt,DATE_FORMAT(a.UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt ,DATE_FORMAT(a.InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM Event a, EventFrequency b WHERE a.EventCd = b.EventCd AND a.EventCd=  '
      +'"'+StoreIdData+'"'+' ORDER BY a.InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("eventfrequencyList select error - ", Date());
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
//QSW_021-1 행사-프리퀀시 관리 등록
var eventfrequencyInsert = (EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present) =>{
  let StoreData = [EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present];
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('eventfrequencyInsert  데이터 >',  StoreData);
    //등록
    var sql = 'INSERT INTO EventFrequency(EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present,InsertDt) SELECT ?,?,?,?,?,?,?,?,? FROM DUAL';
    var params =[EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //등록 후 재조회
        var selectSql = 'SELECT EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present,date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM EventFrequency WHERE EventCd = '
      +'"'+EventCd+'"'+' ORDER BY InsertDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("eventfrequencyInsert - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
        }
     }); 
     
  });
}
//QSW_021-1_2 행사-프리퀀시 관리 수정
var eventfrequencyUpdate = (EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present) =>{
  let StoreData = [EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('eventfrequencyUpdate  데이터 >',  StoreData);
    //수정
    var sql = 'UPDATE EventFrequency SET OptionA = ?,CntA=?,OptionB=?,CntB=?,OptionC=?,CntC=?,Present=?,UpdateDt=? WHERE EventCd = ?'
    var params =[OptionA,CntA,OptionB,CntB,OptionC,CntC,Present,UpdateDt,EventCd];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //수정 후 재조회
        var selectSql = 'SELECT EventCd,OptionA,CntA,OptionB,CntB,OptionC,CntC,Present,date_format(UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt FROM EventFrequency WHERE EventCd = '
        +'"'+EventCd+'"'+' ORDER BY UpdateDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("eventfrequencyUpdate - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
      }
     }); 
  });
}
//QSW_022 재고 관리 - 목록
var stockList = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('stockList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT SID,StoreId,StockCd, StockNm, StockCnt,date_format(WarehousingDt, "%Y-%m-%d") as WarehousingDt,date_format(ShipmentDt, "%Y-%m-%d") as ShipmentDt,UseYn, date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM StockInfo WHERE StoreId = '
      +'"'+StoreId+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("stockList select error - ", Date());
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
//QSW_022 재고 관리 - 목록
var stockInfo = (StoreId,StockCd) =>{
  let StoreIdData = [StoreId,StockCd];
  return new Promise((resolve, reject) => {
      console.log('stockInfo 데이터 >',  StoreIdData);
      var selectSql = 'SELECT SID,StoreId,StockCd, StockNm, StockCnt,date_format(WarehousingDt, "%Y-%m-%d") as WarehousingDt,date_format(ShipmentDt, "%Y-%m-%d") as ShipmentDt,UseYn, date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM StockInfo WHERE StoreId = '
      +'"'+StoreId+'"'+'and StockCd = '+'"'+StockCd+'"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("stockInfo select error - ", Date());
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
//QSW_022 재고 관리 - 상세 목록
var stockListDetail = (StoreId,StockCd,WSType) =>{
  let StoreIdData = [StoreId,StockCd,WSType];
  return new Promise((resolve, reject) => {
      console.log('stockList 데이터 >',  StoreIdData);
      var selectSql = 'SELECT SID,StoreId,StockCd, StockCnt,WSType,date_format(StockDt, "%Y-%m-%d") as StockDt, date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM StockHistory WHERE StoreId = '
      +'"'+StoreId+'"'+' and StockCd = '+'"'+StockCd+'"'+' and WSType like '+'"%'+WSType+'%"';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("stockList select error - ", Date());
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
//QSW_022 재고 관리 - 등록
var stockInsert = (StoreId, StockNm, StockCnt,WarehousingDt) =>{
  let StoreData = [StoreId, StockNm, StockCnt,WarehousingDt];
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  let UseYn = 'Y';
  let WSType = 'W';
  return new Promise((resolve, reject) => {
    console.log('stockInsert  데이터 >',  StoreData);
    //재고정보 등록
    var sql = 'INSERT INTO StockInfo(StoreId,StockCd,StockNm,StockCnt,WarehousingDt,UseYn,InsertDt) SELECT ?,(select CONCAT(? ,LPAD((SELECT COUNT(*)+1 FROM StockInfo WHERE StoreId = ?),4,"0")) AS StockCd FROM DUAL),?,?,?,?,? FROM DUAL';
    var params =[StoreId,StoreId,StoreId, StockNm, StockCnt,WarehousingDt,UseYn,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        console.log('StockInfo - Insert Success !!')
        //재고 히스토리 등록
        var sql = 'INSERT INTO StockHistory(StoreId,StockCd,StockCnt,WSType,StockDt,InsertDt) SELECT ?,(SELECT StockCd FROM StockInfo WHERE StoreId = ? ORDER BY StockCd DESC LIMIT 1),?,?,?,? FROM DUAL';
        var params =[StoreId, StoreId, StockCnt,WSType,WarehousingDt,InsertDt];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if(error){
            console.log('error > ' + error)
          }else{
            console.log('StockHistory - Insert Success !!')
            //등록 후 재조회
            var selectSql = 'SELECT SID,StoreId,StockCd, StockNm, StockCnt,date_format(WarehousingDt, "%Y-%m-%d") as WarehousingDt,date_format(ShipmentDt, "%Y-%m-%d") as ShipmentDt,UseYn, date_format(InsertDt, "%Y-%m-%d %H:%i") as InsertDt FROM StockInfo WHERE StoreId = '
            +'"'+StoreId+'"'+' ORDER BY InsertDt desc';
            conn.connection.query(selectSql, function (error, rows, fields) {
              if (error || rows.length == 0  ||rows.length == undefined ) {
                console.log("stockInsert - select  error - ", Date());
                console.log("error > " + error);
                reject({ msg: error });
              }else{
                resolve({ success: true  ,code:0, info:rows[0]});
              }  
            });
          }
        });
        }
     }); 
     
  });
}
//QSW_022 재고 관리 - 수정
var stockUpdate = (StoreId,StockCd, StockCnt,WSType, StockDt) =>{
  let StoreData = [StoreId,StockCd, StockCnt,WSType, StockDt];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('stockUpdate  데이터 >',  StoreData);
    //StockHistroy 등록
    var sql = 'Insert into StockHistory(StoreId,StockCd,StockCnt,WSType,StockDt,InsertDt) SELECT ?,?,?,?,?,? FROM DUAL'
    var params =[StoreId,StockCd, StockCnt,WSType, StockDt,InsertDt];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else if(WSType =='W'){
        //WSType = W(입고)일때 update
        var sql = 'UPDATE StockInfo SET StockCnt =(SELECT StockCnt+? FROM StockInfo WHERE StockCd = ?),WarehousingDt=?,UpdateDt=? WHERE StockCd = ? and StoreId = ?'
        var params =[StockCnt,StockCd,StockDt,UpdateDt,StockCd,StoreId];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if(error){
            console.log('error > ' + error)
          }else{
            //수정 후 재조회
            var selectSql = 'SELECT a.StoreId AS StoreId, a.StockCd AS StockCd, b.StockCnt AS StockCnt, a.WSType AS WSType, date_format(b.WarehousingDt, "%Y-%m-%d") as WarehousingDt FROM StockHistory a LEFT join StockInfo b ON a.StockCd = b.StockCd WHERE a.StoreId = '
            +'"'+StoreId+'"'+' and a.StockCd = '+'"'+StockCd+'"'+' ORDER BY a.InsertDt desc limit 1';
            conn.connection.query(selectSql, function (error, rows, fields) {
              if (error || rows.length == 0  ||rows.length == undefined ) {
                console.log("stockUpdate - select  error - ", Date());
                console.log("error > " + error);
                reject({ msg: error });
                }else{
                  resolve({ success: true  ,code:0, info:rows[0]});
                }  
              });
          }
        }); 
      }else if(WSType == 'S'){
        //WSType = S(출고)일때 update
        var sql = 'UPDATE StockInfo SET StockCnt =(SELECT StockCnt-? FROM StockInfo WHERE StockCd = ?),ShipmentDt=?,UpdateDt=? WHERE StockCd = ? and StoreId = ?'
        var params =[StockCnt,StockCd,StockDt,UpdateDt,StockCd,StoreId];
        conn.connection.query(sql,params, function (error, rows, fields) {
          if(error){
            console.log('error > ' + error)
          }else{
            //수정 후 재조회
            var selectSql = 'SELECT a.StoreId AS StoreId, a.StockCd AS StockCd, b.StockCnt AS StockCnt, a.WSType AS WSType,date_format(b.ShipmentDt, "%Y-%m-%d") as ShipmentDt FROM StockHistory a LEFT join StockInfo b ON a.StockCd = b.StockCd WHERE a.StoreId = '
            +'"'+StoreId+'"'+' and a.StockCd = '+'"'+StockCd+'"'+' ORDER BY a.InsertDt desc limit 1';
            conn.connection.query(selectSql, function (error, rows, fields) {
              if (error || rows.length == 0  ||rows.length == undefined ) {
                console.log("stockUpdate - select  error - ", Date());
                console.log("error > " + error);
                reject({ msg: error });
                }else{
                  resolve({ success: true  ,code:0, info:rows[0]});
                }  
              });
          }
        }); 
      }
     }); 
  });
}
//QSW_022_2 재고관리 use yn 수정
var stockUseYn = (StoreId,StockCd, UseYn) =>{
  let StoreData = [StoreId,StockCd, UseYn];
  var d = new Date();
  let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    console.log('stockUseYn  데이터 >',  StoreData);
    //수정
    var sql = 'UPDATE StockInfo SET UseYn = ?,UpdateDt=? WHERE StoreId = ? and StockCd =?'
    var params =[UseYn,UpdateDt,StoreId,StockCd];
    conn.connection.query(sql,params, function (error, rows, fields) {
      if(error){
        console.log('error > ' + error)
      }else{
        //수정 후 재조회
        var selectSql = 'SELECT UseYn,date_format(UpdateDt, "%Y-%m-%d %H:%i") as UpdateDt FROM StockInfo WHERE StoreId = '
        +'"'+StoreId+'"'+' and StockCd = '+'"'+StockCd+'"'+' ORDER BY UpdateDt desc';
        conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
            console.log("stockUseYn - select  error - ", Date());
            console.log("error > " + error);
            reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
          });
      }
     }); 
  });
}
//QSW_008 매출 달력
var calendar = (StoreId,InsertDt) =>{
  let StoreIdData = [StoreId,InsertDt];
  return new Promise((resolve, reject) => {
      console.log('calendar 데이터 >',  StoreIdData);
      var selectSql = 'SELECT StoreId, sum(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDT,"%Y-%m-%d") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" AND DATE_FORMAT(InsertDT,"%Y-%m") = ? GROUP BY DATE_FORMAT(InsertDT,"%Y-%m-%d"); ';
      let sql1 = require('mysql').format(selectSql , StoreIdData);

      var selectSq2 = 'SELECT StoreId, sum(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDT,"%Y-%m-%d") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "CUP" AND DATE_FORMAT(InsertDT,"%Y-%m") = ? GROUP BY DATE_FORMAT(InsertDT,"%Y-%m-%d"); ';
      let sql2 = require('mysql').format(selectSq2 , StoreIdData);

      console.log(sql1+sql2)
      conn.connection.query(sql1+sql2, function (error, rows, fields) {
          if (error) {
              console.log("calendar select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
                if (!error && rows.length > 0) {
                  var calendarData = new Object();  
                  calendarData.Order = rows[0]; 
                  calendarData.cancelOrder = rows[1];
                  resolve({ success: true, info:calendarData,code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW_008 매출 달력
var MonthTotalpayment = (StoreId,InsertDt) =>{
  let StoreIdData = [StoreId,InsertDt];
  return new Promise((resolve, reject) => {
      console.log('MonthTotalpayment 데이터 >',  StoreIdData);
      var selectSql = 'SELECT StoreId,OrderStatus,SUM(TotalPrice) AS TotalPrice,date_format(InsertDT, "%Y-%m") as InsertDT FROM UserPay WHERE StoreId =  '
      +'"'+StoreId+'"'+ ' AND DATE_FORMAT(InsertDT,"%Y-%m") = '+'"'+InsertDt+'"'+' and OrderStatus = "PUC" GROUP BY date_format(InsertDT, "%Y-%m")';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error) {
              console.log("MonthTotalpayment select error - ", Date());
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
//QSW 009 매출 분석 - 결제정보(1day)
var salesday = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('salesday 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT SUM(TotalPrice) AS TotalPrice, COUNT(0) AS OrderCnt, AVG(TotalPrice) AS AvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      
      var selectSql2 = 'SELECT SUM(TotalPrice) AS CancelTotalPrice, COUNT(0) AS CancelOrderCnt, AVG(TotalPrice) AS CancelAvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "CUP" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls2 = require('mysql').format(selectSql2 , StoreIdData);
      
      conn.connection.query(sqls1+sqls2, function (error, rows, fields) {
          if (error) {
              console.log("salesday select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
              if (!error && rows.length > 0) {
                  var salesData = new Object();  
                  salesData.Order = rows[0][0]; 
                  salesData.cancelOrder = rows[1][0];
                  resolve({ success: true, info : salesData, code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW 009_2 매출 분석 - 결제정보(1week)
var salesweek = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('salesweek 데이터 >',  StoreIdData);
      
      var selectSql1 = 'SELECT SUM(TotalPrice) AS TotalPrice, COUNT(0) AS OrderCnt, AVG(TotalPrice) AS AvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      
      var selectSql2 = 'SELECT SUM(TotalPrice) AS CancelTotalPrice, COUNT(0) AS CancelOrderCnt, AVG(TotalPrice) AS CancelAvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "CUP" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls2 = require('mysql').format(selectSql2 , StoreIdData);

      console.log(sqls1+sqls2)
      conn.connection.query(sqls1+sqls2, function (error, rows, fields) {
          if (error) {
              console.log("salesweek select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
              if (!error && rows.length > 0) {
                  var salesData = new Object();  
                  salesData.Order = rows[0][0]; 
                  salesData.cancelOrder = rows[1][0];
                  resolve({ success: true, info : salesData, code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW 009_3 매출 분석 - 결제정보(1month)
var salesmonth = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('salesmonth 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT SUM(TotalPrice) AS TotalPrice, COUNT(0) AS OrderCnt, AVG(TotalPrice) AS AvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      
      var selectSql2 = 'SELECT SUM(TotalPrice) AS CancelTotalPrice, COUNT(0) AS CancelOrderCnt, AVG(TotalPrice) AS CancelAvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "CUP" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls2 = require('mysql').format(selectSql2 , StoreIdData);

      conn.connection.query(sqls1+sqls2, function (error, rows, fields) {
          if (error) {
              console.log("salesmonth select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
              if (!error && rows.length > 0) {
                  var salesData = new Object();  
                  salesData.Order = rows[0][0]; 
                  salesData.cancelOrder = rows[1][0];
                  resolve({ success: true, info : salesData, code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW 009_4 매출 분석 - 결제정보(3month)
var salesmonth3 = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('salesmonth3 데이터 >',  StoreIdData);
      
      var selectSql1 = 'SELECT SUM(TotalPrice) AS TotalPrice, COUNT(0) AS OrderCnt, AVG(TotalPrice) AS AvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      
      var selectSql2 = 'SELECT SUM(TotalPrice) AS CancelTotalPrice, COUNT(0) AS CancelOrderCnt, AVG(TotalPrice) AS CancelAvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "CUP" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d"); ';
      let sqls2 = require('mysql').format(selectSql2 , StoreIdData);

      conn.connection.query(sqls1+sqls2, function (error, rows, fields) {
          if (error) {
              console.log("salesmonth3 select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
              if (!error && rows.length > 0) {
                  var salesData = new Object();  
                  salesData.Order = rows[0][0]; 
                  salesData.cancelOrder = rows[1][0];
                  resolve({ success: true, info : salesData, code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW 009_5 매출 분석 - 결제정보(기간검색))
var salesdetail = (StoreId,StartDt,EndDt) =>{
  let StoreIdData = [StoreId,StartDt,EndDt];
  return new Promise((resolve, reject) => {
      console.log('salesdetail 데이터 >',  StoreIdData);
      
      var selectSql1 = 'SELECT SUM(TotalPrice) AS TotalPrice, COUNT(0) AS OrderCnt, AVG(TotalPrice) AS AvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d"); ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      
      var selectSql2 = 'SELECT SUM(TotalPrice) AS CancelTotalPrice, COUNT(0) AS CancelOrderCnt, AVG(TotalPrice) AS CancelAvgPrice '
      +'FROM UserPay WHERE StoreId =  ? AND OrderStatus = "CUP" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d"); ';
      let sqls2 = require('mysql').format(selectSql2 , StoreIdData);

      conn.connection.query(sqls1+sqls2, function (error, rows, fields) {
          if (error) {
              console.log("salesdetail select error - ", Date());
              console.log("errno > " + error);
              reject({msg: error });
            } else {
              if (!error && rows.length > 0) {
                  var salesData = new Object();  
                  salesData.Order = rows[0][0]; 
                  salesData.cancelOrder = rows[1][0];
                  resolve({ success: true, info : salesData, code:0});
                } else if (!error && rows.length == 0) {
                  resolve({ success: false, msg: null ,code:1});
                } else {
                  resolve({ success: false, msg: error,code:2 });
                }
            }  
      });
  });
}
//QSW 010 영업 분석 - 주문시간 (1day)
var timeday = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('timeday 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT COUNT(0) AS OrderCnt, SUM(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDt, "%H") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY DATE_FORMAT(InsertDt, "%H") ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("timeday select error - ", Date());
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
//QSW 010_2 영업 분석 - 주문시간 (1week)
var timeweek = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('timeweek 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT COUNT(0) AS OrderCnt, SUM(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDt, "%H") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY DATE_FORMAT(InsertDt, "%H") ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("timeweek select error - ", Date());
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
//QSW 010_3 영업 분석 - 주문시간 (1month)
var timemonth = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('timemonth 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT COUNT(0) AS OrderCnt, SUM(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDt, "%H") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY DATE_FORMAT(InsertDt, "%H") ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("timemonth select error - ", Date());
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
//QSW 010_4 영업 분석 - 주문시간 (month3)
var timemonth3 = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('timemonth3 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT COUNT(0) AS OrderCnt, SUM(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDt, "%H") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY DATE_FORMAT(InsertDt, "%H") ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("timemonth3 select error - ", Date());
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
//QSW 010_5 영업 분석 - 주문시간 (기간설정)
var timeDetail = (StoreId,StartDt,EndDt) =>{
  let StoreIdData = [StoreId,StartDt,EndDt];
  return new Promise((resolve, reject) => {
      console.log('timeDetail 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT COUNT(0) AS OrderCnt, SUM(TotalPrice) AS TotalPrice, DATE_FORMAT(InsertDt, "%H") AS InsertDt '
      +'FROM UserPay WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d") '
      +'GROUP BY DATE_FORMAT(InsertDt, "%H") ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("timeDetail select error - ", Date());
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
//QSW 010_6 매출 분석 - 결제수단별 매출 (1day)
var payday = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('payday 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT sum(Price) AS TotalPrice ,PayMethod  '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY PayMethod ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("payday select error - ", Date());
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
//QSW 010_7 매출 분석 - 결제수단별 매출 (1week)
var payweek = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('payweek 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT sum(Price) AS TotalPrice ,PayMethod  '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY PayMethod ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("payweek select error - ", Date());
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
//QSW 010_8 매출 분석 - 결제수단별 매출 (1month)
var paymonth = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('paymonth 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT sum(Price) AS TotalPrice ,PayMethod  '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY PayMethod ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("paymonth select error - ", Date());
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
//QSW 010_9 매출 분석 - 결제수단별 매출 (3month)
var paymonth3 = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('paymonth3 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT sum(Price) AS TotalPrice ,PayMethod  '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY PayMethod ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("paymonth3 select error - ", Date());
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
//QSW 010_10 영업 분석 - 결제수단별 매출 (기간 선택)
var paydetail = (StoreId,StartDt,EndDt) =>{
  let StoreIdData = [StoreId,StartDt,EndDt];
  return new Promise((resolve, reject) => {
      console.log('paydetail 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT sum(Price) AS TotalPrice ,PayMethod  '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d") '
      +'GROUP BY PayMethod ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("paydetail select error - ", Date());
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
//QSW 011 상품 분석 - (1 day)
var menuday = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menuday 데이터 >',  StoreIdData);      
      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC) AS Ranking, '
        +'MId(a.MenuId,1,1) AS Category, SUM(a.OrderCnt) AS MenuCnt, a.MenuName ,SUM(a.Price) TotalPrice, '
        +'b.FileEncNm, b.FileOrgNm, b.FilePath '
      +'FROM UserPayDetail a LEFT JOIN CommAttachFile b ON a.MenuId = b.RefId AND b.StoreId = a.StoreId '
      +'WHERE  a.StoreId = ? AND a.OrderStatus = "PUC" '
      +'AND DATE_FORMAT(a.InsertDt,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY a.MenuName  ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menuday select error - ", Date());
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
//QSW 011_2 상품 분석 - (week)
var menuweek = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menuweek 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC) AS Ranking, '
        +'MId(a.MenuId,1,1) AS Category, SUM(a.OrderCnt) AS MenuCnt, a.MenuName ,SUM(a.Price) TotalPrice, '
        +'b.FileEncNm, b.FileOrgNm, b.FilePath '
      +'FROM UserPayDetail a LEFT JOIN CommAttachFile b ON a.MenuId = b.RefId AND b.StoreId = a.StoreId '
      +'WHERE  a.StoreId = ? AND a.OrderStatus = "PUC" '
      +'AND DATE_FORMAT(a.InsertDt,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY a.MenuName  ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);      
      
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menuweek select error - ", Date());
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
//QSW 011_3 상품 분석 - (month)
var menumonth = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menumonth 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC) AS Ranking, '
        +'MId(a.MenuId,1,1) AS Category, SUM(a.OrderCnt) AS MenuCnt, a.MenuName ,SUM(a.Price) TotalPrice, '
        +'b.FileEncNm, b.FileOrgNm, b.FilePath '
      +'FROM UserPayDetail a LEFT JOIN CommAttachFile b ON a.MenuId = b.RefId AND b.StoreId = a.StoreId '
      +'WHERE  a.StoreId = ? AND a.OrderStatus = "PUC" '
      +'AND DATE_FORMAT(a.InsertDt,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY a.MenuName  ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);   
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menumonth select error - ", Date());
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
//QSW 011_4 상품 분석 - (3 month)
var menumonth3 = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menumonth3 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC) AS Ranking, '
        +'MId(a.MenuId,1,1) AS Category, SUM(a.OrderCnt) AS MenuCnt, a.MenuName ,SUM(a.Price) TotalPrice, '
        +'b.FileEncNm, b.FileOrgNm, b.FilePath '
      +'FROM UserPayDetail a LEFT JOIN CommAttachFile b ON a.MenuId = b.RefId AND b.StoreId = a.StoreId '
      +'WHERE  a.StoreId = ? AND a.OrderStatus = "PUC" '
      +'AND DATE_FORMAT(a.InsertDt,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY a.MenuName  ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);   
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menumonth3 select error - ", Date());
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
//QSW 011_5 상품 분석 - (기간 선택)
var menumonthdetail = (StoreId,StartDt,EndDt) =>{
  let StoreIdData = [StoreId,StartDt,EndDt];
  return new Promise((resolve, reject) => {
      console.log('menumonthdetail 데이터 >',  StoreIdData);
      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC) AS Ranking, '
        +'MId(a.MenuId,1,1) AS Category, SUM(a.OrderCnt) AS MenuCnt, a.MenuName ,SUM(a.Price) TotalPrice, '
        +'b.FileEncNm, b.FileOrgNm, b.FilePath '
      +'FROM UserPayDetail a LEFT JOIN CommAttachFile b ON a.MenuId = b.RefId AND b.StoreId = a.StoreId '
      +'WHERE  a.StoreId = ? AND a.OrderStatus = "PUC" '
      +'AND DATE_FORMAT(a.InsertDt,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d") ' 
      +'GROUP BY a.MenuName  ORDER BY SUM(a.OrderCnt) DESC, a.MenuName DESC ';
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);   
      
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menumonthdetail select error - ", Date());
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
//QSW 011_6 상품 분석 - 카테고리 (1day)
var menucateday = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menucateday 데이터 >',  StoreIdData);

      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC) AS Ranking, '
        +'(CASE MID(MenuId,1,1) WHEN "D" THEN "Drink" WHEN "S" THEN "Drink" WHEN "B" THEN "Bakery" WHEN "G" THEN "Goods" END) AS Cate, '
        +'SUM(OrderCnt) AS OrderCnt, SUM(Price) TotalPrice '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") = DATE_FORMAT(NOW(),"%Y-%m-%d") '
      +'GROUP BY Cate ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC '
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);   
      
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menucateday select error - ", Date());
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
//QSW 011_7 상품 분석 - 카테고리 (week)
var menucateweek = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menucateweek 데이터 >',  StoreIdData);

      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC) AS Ranking, '
        +'(CASE MID(MenuId,1,1) WHEN "D" THEN "Drink" WHEN "S" THEN "Drink" WHEN "B" THEN "Bakery" WHEN "G" THEN "Goods" END) AS Cate, '
        +'SUM(OrderCnt) AS OrderCnt, SUM(Price) TotalPrice '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 WEEK),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY Cate ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC '
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);   
      
      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menucateweek select error - ", Date());
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
//QSW 011_8 상품 분석 - 카테고리 (month)
var menucatemonth = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menucatemonth 데이터 >',  StoreIdData);

      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC) AS Ranking, '
        +'(CASE MID(MenuId,1,1) WHEN "D" THEN "Drink" WHEN "S" THEN "Drink" WHEN "B" THEN "Bakery" WHEN "G" THEN "Goods" END) AS Cate, '
        +'SUM(OrderCnt) AS OrderCnt, SUM(Price) TotalPrice '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -1 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY Cate ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC '
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);  

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menucatemonth select error - ", Date());
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
//QSW 011_9 상품 분석 - 카테고리 (3month)
var menucatemonth3 = (StoreId) =>{
  let StoreIdData = [StoreId];
  return new Promise((resolve, reject) => {
      console.log('menucatemonth3 데이터 >',  StoreIdData);

      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC) AS Ranking, '
        +'(CASE MID(MenuId,1,1) WHEN "D" THEN "Drink" WHEN "S" THEN "Drink" WHEN "B" THEN "Bakery" WHEN "G" THEN "Goods" END) AS Cate, '
        +'SUM(OrderCnt) AS OrderCnt, SUM(Price) TotalPrice '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(DATE_ADD(NOW(),INTERVAL -3 MONTH),"%Y-%m-%d") AND DATE_FORMAT(NOW(),"%Y-%m-%d") ' 
      +'GROUP BY Cate ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC '
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);  

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menucatemonth3 select error - ", Date());
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
//QSW 011_10 상품 분석 - 카테고리 (기간 선택)
var menucatemonthdetail = (StoreId,StartDt,EndDt) =>{
  let StoreIdData = [StoreId,StartDt,EndDt];
  return new Promise((resolve, reject) => {
      console.log('menucatemonthdetail 데이터 >',  StoreIdData);

      var selectSql1 = 'SELECT '
        +'RANK() OVER(ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC) AS Ranking, '
        +'(CASE MID(MenuId,1,1) WHEN "D" THEN "Drink" WHEN "S" THEN "Drink" WHEN "B" THEN "Bakery" WHEN "G" THEN "Goods" END) AS Cate, '
        +'SUM(OrderCnt) AS OrderCnt, SUM(Price) TotalPrice '
      +'FROM UserPayDetail WHERE StoreId = ? AND OrderStatus = "PUC" '
      +'AND DATE_FORMAT(InsertDT,"%Y-%m-%d") BETWEEN DATE_FORMAT(?,"%Y-%m-%d") AND DATE_FORMAT(?,"%Y-%m-%d") ' 
      +'GROUP BY Cate ORDER BY SUM(OrderCnt) DESC, SUM(Price) DESC '
      let sqls1 = require('mysql').format(selectSql1 , StoreIdData);  

      conn.connection.query(sqls1, function (error, rows, fields) {
          if (error) {
              console.log("menucatemonthdetail select error - ", Date());
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
exports.store = store;
exports.Supdate = Supdate;
exports.category = category;
exports.categoryDetail = categoryDetail;
exports.categorymenu = categorymenu;
exports.categorymid = categorymid;
exports.categoryInsert = categoryInsert;
exports.categoryUpdate = categoryUpdate;
exports.staffList = staffList;
exports.staffListDetail = staffListDetail;
exports.staffInsert = staffInsert;
exports.staffUpdate = staffUpdate;
exports.eventList = eventList;
exports.eventListDetail = eventListDetail;
exports.eventInsert = eventInsert;
exports.eventUpdate = eventUpdate;
exports.stockList = stockList;
exports.stockListDetail = stockListDetail;
exports.stockInsert = stockInsert;
exports.stockUpdate = stockUpdate;
exports.eventfrequencyList = eventfrequencyList;
exports.eventfrequencyInsert = eventfrequencyInsert;
exports.eventfrequencyUpdate = eventfrequencyUpdate;
exports.stockInfo = stockInfo;
exports.stockUseYn = stockUseYn;
exports.calendar = calendar;
exports.MonthTotalpayment = MonthTotalpayment;
exports.salesday = salesday;
exports.salesweek = salesweek;
exports.salesmonth = salesmonth;
exports.salesmonth3 = salesmonth3;
exports.salesdetail = salesdetail;
exports.timeday = timeday;
exports.timeweek = timeweek;
exports.timemonth = timemonth;
exports.timemonth3 = timemonth3;
exports.timeDetail = timeDetail;
exports.payday = payday;
exports.payweek = payweek;
exports.paymonth = paymonth;
exports.paymonth3 = paymonth3;
exports.paydetail = paydetail;
exports.menuday = menuday;
exports.menuweek = menuweek;
exports.menumonth = menumonth;
exports.menumonth3 = menumonth3;
exports.menucateday = menucateday;
exports.menucateweek = menucateweek;
exports.menucatemonth = menucatemonth;
exports.menucatemonth3 = menucatemonth3;
exports.menucatemonthdetail = menucatemonthdetail;
exports.menumonthdetail = menumonthdetail;