var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var {groupBy} = require('../function/common');

//QS_008 매장 메뉴정보 (카테고리별 메뉴목록-메뉴아이디,이름,가격,이미지,옵션, 추천메뉴T/F, 숨김T/F)
var menulist = (StoreId) =>{
    let StoreData = [StoreId];
    return new Promise((resolve, reject) => {
        console.log('store  데이터 >',  StoreData);
        let selectSql = 'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,DelYn,Date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq, ('
          +' SELECT caf.FileId '
          +' FROM CommAttachFile caf '
          +' WHERE caf.DelYn = "N"'
          +' AND caf.Type = "M"'
          +' AND caf.StoreId = m.StoreId'
          +' AND caf.RefId = m.MenuId'
          +' ORDER BY caf.InsertDT DESC LIMIT 1'
        +' ) AS FileId'
        +' , ('
        +' SELECT caf.FilePath'
        +' FROM CommAttachFile caf'
        +'  WHERE caf.DelYn = "N"'
        +' AND caf.Type = "M"'
        +' AND caf.StoreId = m.StoreId'
        +' AND caf.RefId = m.MenuId'
        +' ORDER BY caf.InsertDT DESC LIMIT 1'
        +' ) AS FilePath'
        +', ('
        +' SELECT caf.FileEncNm'
        +' FROM CommAttachFile caf' 
        +' WHERE caf.DelYn = "N"'
        +' AND caf.Type = "M"'
        +' AND caf.StoreId = m.StoreId'
        +' AND caf.RefId = m.MenuId'
        +' ORDER BY caf.InsertDT DESC LIMIT 1'
        +' ) AS FileEncNm'
        +' , ( '
        +' SELECT caf.FileOrgNm'
        +' FROM CommAttachFile caf' 
        +' WHERE caf.DelYn = "N"'
        +' AND caf.Type = "M"'
        +' AND caf.StoreId = m.StoreId'
        +' AND caf.RefId = m.MenuId'
        +' ORDER BY caf.InsertDT DESC LIMIT 1'
        +' ) AS FileOrgNm' 
        +'  FROM Menu m'
        +' WHERE StoreId ='
        +'"'+StoreId+'"'+' AND DelYn ="N" order BY m.LargeDivCd DESC'
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("menulist select error - ", Date());
                console.log("errno > " + error);
                reject({ msg: error });
              }else {
                console.log("menulist select success - ",Date());
                if (!error && rows.length > 0) {
                    var menuData = new Object();
                    var pointDrinkItem = new Object();
                    var pointBreadItem = new Object();
                    var pointGoodsItem = new Object();

                    var arrPointdrink = new Array();
                    var arrPointbread = new Array();
                    var arrPointgoods = new Array();
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].LargeDivcd == 'S') {
                            pointDrinkItem = new Object();
                            pointDrinkItem.MenuId = rows[i].MenuId;
                            pointDrinkItem.MenuName = rows[i].MenuName;
                            pointDrinkItem.Price = rows[i].Price;
                            pointDrinkItem.ImgUrl = rows[i].ImgUrl;
                            pointDrinkItem.OptionA = rows[i].OptionA;
                            pointDrinkItem.OptionB = rows[i].OptionB;
                            pointDrinkItem.OptionC = rows[i].OptionC;
                            pointDrinkItem.Contents = rows[i].Contents;
                            pointDrinkItem.Best = rows[i].Best;
                            pointDrinkItem.UseYn = rows[i].UseYn;
                            pointDrinkItem.DelYn = rows[i].DelYn;
                            pointDrinkItem.FilePath = rows[i].FilePath;
                            pointDrinkItem.FileEncNm = rows[i].FileEncNm;
                            pointDrinkItem.FileOrgNm = rows[i].FileOrgNm;
                            pointDrinkItem.InsertDate = rows[i].InsertDate;
                            arrPointdrink.push(pointDrinkItem);
                        }else if(rows[i].LargeDivcd == 'D') {
                            pointDrinkItem = new Object();
                            pointDrinkItem.MenuId = rows[i].MenuId;
                            pointDrinkItem.MenuName = rows[i].MenuName;
                            pointDrinkItem.Price = rows[i].Price;
                            pointDrinkItem.ImgUrl = rows[i].ImgUrl;
                            pointDrinkItem.OptionA = rows[i].OptionA;
                            pointDrinkItem.OptionB = rows[i].OptionB;
                            pointDrinkItem.OptionC = rows[i].OptionC;
                            pointDrinkItem.Contents = rows[i].Contents;
                            pointDrinkItem.Best = rows[i].Best;
                            pointDrinkItem.UseYn = rows[i].UseYn;
                            pointDrinkItem.DelYn = rows[i].DelYn;
                            pointDrinkItem.FilePath = rows[i].FilePath;
                            pointDrinkItem.FileEncNm = rows[i].FileEncNm;
                            pointDrinkItem.FileOrgNm = rows[i].FileOrgNm;
                            pointDrinkItem.InsertDate = rows[i].InsertDate;
                            arrPointdrink.push(pointDrinkItem);
                        }else if(rows[i].LargeDivcd == 'B') {
                            pointBreadItem = new Object();
                            pointBreadItem.MenuId = rows[i].MenuId;
                            pointBreadItem.MenuName = rows[i].MenuName;
                            pointBreadItem.Price = rows[i].Price;
                            pointBreadItem.ImgUrl = rows[i].ImgUrl;
                            pointBreadItem.OptionA = rows[i].OptionA;
                            pointBreadItem.OptionB = rows[i].OptionB;
                            pointBreadItem.OptionC = rows[i].OptionC;
                            pointBreadItem.Contents = rows[i].Contents;
                            pointBreadItem.Best = rows[i].Best;
                            pointBreadItem.UseYn = rows[i].UseYn;
                            pointBreadItem.DelYn = rows[i].DelYn;
                            pointBreadItem.FilePath = rows[i].FilePath;
                            pointBreadItem.FileEncNm = rows[i].FileEncNm;
                            pointBreadItem.FileOrgNm = rows[i].FileOrgNm;
                            pointBreadItem.InsertDate = rows[i].InsertDate;
                            arrPointbread.push(pointBreadItem);
                        }else if(rows[i].LargeDivcd == 'G') {
                            pointGoodsItem = new Object();
                            pointGoodsItem.MenuId = rows[i].MenuId;
                            pointGoodsItem.MenuName = rows[i].MenuName;
                            pointGoodsItem.Price = rows[i].Price;
                            pointGoodsItem.ImgUrl = rows[i].ImgUrl;
                            pointGoodsItem.OptionA = rows[i].OptionA;
                            pointGoodsItem.OptionB = rows[i].OptionB;
                            pointGoodsItem.OptionC = rows[i].OptionC;
                            pointGoodsItem.Contents = rows[i].Contents;
                            pointGoodsItem.Best = rows[i].Best;
                            pointGoodsItem.UseYn = rows[i].UseYn;
                            pointGoodsItem.DelYn = rows[i].DelYn;
                            pointGoodsItem.FilePath = rows[i].FilePath;
                            pointGoodsItem.FileEncNm = rows[i].FileEncNm;
                            pointGoodsItem.FileOrgNm = rows[i].FileOrgNm;
                            pointGoodsItem.InsertDate = rows[i].InsertDate;
                            arrPointgoods.push(pointGoodsItem);
                        }
                    }
                    menuData.drink = arrPointdrink;
                    menuData.bread = arrPointbread;
                    menuData.goods = arrPointgoods;
                    resolve({ success: true, info: menuData ,code:0})
                }else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                  } else {
                    resolve({ success: false, msg: error,code:2 });
                  }
              }  
        });
    });
}
//QSW_017 메뉴 상세조회
var menuInfo = (StoreId,MenuId) =>{
    let menuInfoData = [StoreId,MenuId];
    return new Promise((resolve, reject) => {
        console.log(' menuInfoData 데이터 >',  menuInfoData);
        var selectSql =  'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,DelYn,Date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq, ('
        +' SELECT caf.FileId '
        +' FROM CommAttachFile caf '
        +' WHERE caf.DelYn = "N"'
        +' AND caf.Type = "M"'
        +' AND caf.StoreId = m.StoreId'
        +' AND caf.RefId = m.MenuId'
        +' ORDER BY caf.InsertDT DESC LIMIT 1'
      +' ) AS FileId'
      +' , ('
      +' SELECT caf.FilePath'
      +' FROM CommAttachFile caf'
      +'  WHERE caf.DelYn = "N"'
      +' AND caf.Type = "M"'
      +' AND caf.StoreId = m.StoreId'
      +' AND caf.RefId = m.MenuId'
      +' ORDER BY caf.InsertDT DESC LIMIT 1'
      +' ) AS FilePath'
      +', ('
      +' SELECT caf.FileEncNm'
      +' FROM CommAttachFile caf' 
      +' WHERE caf.DelYn = "N"'
      +' AND caf.Type = "M"'
      +' AND caf.StoreId = m.StoreId'
      +' AND caf.RefId = m.MenuId'
      +' ORDER BY caf.InsertDT DESC LIMIT 1'
      +' ) AS FileEncNm'
      +' , ( '
      +' SELECT caf.FileOrgNm'
      +' FROM CommAttachFile caf' 
      +' WHERE caf.DelYn = "N"'
      +' AND caf.Type = "M"'
      +' AND caf.StoreId = m.StoreId'
      +' AND caf.RefId = m.MenuId'
      +' ORDER BY caf.InsertDT DESC LIMIT 1'
      +' ) AS FileOrgNm' 
      +'  FROM Menu m'
      +' WHERE StoreId = '
      +'"'+StoreId+'"'+' and MenuId = ' + '"'+MenuId+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("menuInfoData select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
  //QSW_017 메뉴 옵션 상세조회
var menuOption = (StoreId,LargeDivCd) =>{
    let menuOptionData = [StoreId,LargeDivCd];
    return new Promise((resolve, reject) => {
        console.log(' menuOption 데이터 >',  menuOptionData);
        var selectSql = 'SELECT SID,StoreId,MenuCode,GroupCode,MenuName,MenuName,UseYn,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM MenuOption where StoreId = '
                     +'"' +StoreId + '"'+' AND substr(MenuCode,1,1) = '+'"'+LargeDivCd+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("menuInfoData select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
//QSW_017_1 메뉴 등록
    var Minsert = (StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,InsertDate) =>{
    let MinsertData = [StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,InsertDate];
    let DelYn = 'N';
    return new Promise((resolve, reject) => {
        console.log('MinsertData  데이터 >',  MinsertData);
        //등록
        var sql = 'INSERT INTO Menu(MenuId,StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,DelYn,InsertDate) select(select CONCAT(?,?,LPAD((SELECT COUNT(*)+1 FROM Menu WHERE LargeDivCd= ? AND MidDivCd = ? and StoreId = ?),3,"0")) AS MenuId FROM dual),?,?,?,?,?,?,?,?,?,?,?,?,?,? FROM DUAL';
        var params =[LargeDivCd,MidDivCd,LargeDivCd,MidDivCd,StoreId,StoreId,LargeDivCd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,DelYn,InsertDate];
        conn.connection.query(sql,params, function (error, rows, fields) {
            //등록 후 조회
            var selectSql = 'SELECT StoreId,MenuId,LargeDivcd,MidDivCd,MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,DelYn,date_format(InsertDate, "%Y-%m-%d %H:%i") AS InsertDate,Qseq FROM Menu where StoreId = '
                 +'"' +StoreId + '"'+' AND LargeDivCd= '+'"'+LargeDivCd+'"'+' Order By MenuId desc';
            conn.connection.query(selectSql, function (error, rows, fields) {
                if (error) {
                    console.log("Minsert insert error - ", Date());
                    console.log("errno > " + error);
                    reject({ msg: error });
                }else{
                    if (!error && rows.length > 0) {
                        resolve({ success: true, rows: rows[0] ,code:0});
                      } else if (!error && rows.length == 0) {
                        resolve({ success: false, msg: null ,code:1});
                      } else {
                        resolve({ success: false, msg: error,code:2 });
                      }
                }
            });
        });
    })
}
//QSW_017_2 메뉴 수정
var Mupdate = (MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,StoreId,MenuId) =>{
    let MupdateData = [MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,StoreId,MenuId];
    return new Promise((resolve, reject) => {
        console.log('MupdateData  데이터 >',  MupdateData);
        //등록
        var sql = 'UPDATE Menu SET MenuName=?,Price=?,ImgUrl=?,OptionA=?,OptionB=?,OptionC=?,Contents=?,Best=?,UseYn=? WHERE StoreId = ? and MenuId = ?'
        var params =[MenuName,Price,ImgUrl,OptionA,OptionB,OptionC,Contents,Best,UseYn,StoreId,MenuId];
        conn.connection.query(sql,params, function (error, rows, fields) {
            //등록 후 조회
            var selectSql = 'SELECT c.StoreId AS StoreId, c.MenuId AS MenuId, c.LargeDivCd AS LargeDivCd, c.MidDivCd AS MidDivCd, c.MenuName AS MenuName, c.Price AS Price, c.ImgUrl AS ImgUrl, c.OptionA AS OptionA, c.OptionB AS OptionB, c.OptionC AS OptionC, c.Contents as Contents,c.Best AS Best, c.UseYn as UseYn, c.DelYn as DelYn,DATE_FORMAT(c.InsertDate, "%Y-%m-%d %H:%i") AS InsertDate FROM Menu c WHERE c.StoreId= '
                          + "'" + StoreId + "'" + 'and c.MenuId= ' + "'" + MenuId + "'";
            conn.connection.query(selectSql, function (error, rows, fields) {
                if (error) {
                    console.log("MupdateData update error - ", Date());
                    console.log("errno > " + error);
                    reject({ msg: error });
                }else{
                    if (!error && rows.length > 0) {
                        resolve({ success: true, rows: rows[0] ,code:0});
                      } else if (!error && rows.length == 0) {
                        resolve({ success: false, msg: null ,code:1});
                      } else {
                        resolve({ success: false, msg: error,code:2 });
                      }
                }  
            });
        });
    })
}
//QSW_017_3 메뉴 삭제
var MDelete = (StoreId,MenuId,DelYn) =>{
  let MupdateData = [StoreId,MenuId,DelYn];
  return new Promise((resolve, reject) => {
      console.log('MDelete  데이터 >',  MupdateData);
      //등록
      var sql = 'UPDATE Menu SET DelYn=? WHERE StoreId = ? and MenuId = ?'
      var params =[DelYn,StoreId,MenuId];
      conn.connection.query(sql,params, function (error, rows, fields) {
          //등록 후 조회
          var selectSql = 'SELECT DelYn FROM Menu WHERE StoreId= '
                        + "'" + StoreId + "'" + 'and MenuId= ' + "'" + MenuId + "'";
          conn.connection.query(selectSql, function (error, rows, fields) {
              if (error) {
                  console.log("MDelete update error - ", Date());
                  console.log("errno > " + error);
                  reject({ msg: error });
              }else{
                  if (!error && rows.length > 0) {
                      resolve({ success: true, rows: rows[0] ,code:0});
                    } else if (!error && rows.length == 0) {
                      resolve({ success: false, msg: null ,code:1});
                    } else {
                      resolve({ success: false, msg: error,code:2 });
                    }
              }  
          });
      });
  })
}
//파일 업로드 search - info
var ImagesInfo = (FileId) =>{
  console.log('ImagesInfo menu js in');
  let ImagesInsertData = [FileId];
  return new Promise((resolve, reject) => {
      console.log('ImagesInfo  데이터 >',  ImagesInsertData);
      //조회
      var selectSql = 'SELECT FileId,FileEncNm,FileOrgNm,FilePath,FileSize,FileType,Type,RefId,DelYn,StoreId,InsertId,DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM CommAttachFile where FileId = '
      +'"'+FileId+'"'+' ORDER BY InsertDt desc';
      conn.connection.query(selectSql, function (error, rows, fields) {
          if (error || rows.length == 0  ||rows.length == undefined ) {
              console.log("ImagesInfo - select  error - ", Date());
              console.log("error > " + error);
              reject({ msg: error });
            }else{
              resolve({ success: true  ,code:0, info:rows[0]});
            }  
        });       
      });
    }
    //파일 업로드 insert
var ImagesInsert = (FileEncNm,FileOrgNm,FilePath,FileSize,FileType,StoreId,Type,RefId,DelYn,InsertId) =>{
  console.log('ImagesInsert menu js in');
  let ImagesInsertData = [FileEncNm,FileOrgNm,FilePath,FileSize,FileType,StoreId,Type,RefId,DelYn,StoreId,InsertId];
  var d = new Date();
  let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
      console.log('ImagesInsert  데이터 >',  ImagesInsertData);
      //등록
      var sql = 'INSERT INTO CommAttachFile(FileEncNm,FileOrgNm,FilePath,FileSize,FileType,StoreId,Type,RefId,DelYn,InsertId,InsertDt) select ?,?,?,?,?,?,?,?,?,?,? FROM DUAL';
      var params =[FileEncNm,FileOrgNm,FilePath,FileSize,FileType,StoreId,Type,RefId,DelYn,InsertId,InsertDt];
          conn.connection.query(sql,params, function (error, rows, fields) {
            if(error){
              console.log('error > ' + error)
            }else{
              //등록 후 재조회
              var selectSql = 'SELECT FileId,FileEncNm,FileOrgNm,FilePath,FileSize,FileType,Type,RefId,DelYn,StoreId,InsertId,DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM CommAttachFile ORDER BY InsertDt desc';
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
//파일 업로드 update
var ImagesDelete = (FileId,DelYn) =>{
  console.log('ImagesDelete menu js in');
  let ImagesInsertData = [FileId,DelYn];
  return new Promise((resolve, reject) => {
      console.log('ImagesDelete  데이터 >',  ImagesInsertData);
      //등록
      var sql = 'update CommAttachFile set DelYn = ? where FileId = ?';
      var params =[DelYn,FileId];
          conn.connection.query(sql,params, function (error, rows, fields) {
            if(error){
              console.log('error > ' + error)
            }else{
              //등록 후 재조회
              var selectSql = 'SELECT FileId,FileEncNm,FileOrgNm,FilePath,FileSize,FileType,Type,RefId,DelYn,StoreId,InsertId,DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt FROM CommAttachFile where FileId = '
              +'"'+FileId+'"'+' ORDER BY InsertDt desc';
              conn.connection.query(selectSql, function (error, rows, fields) {
                if (error || rows.length == 0  ||rows.length == undefined ) {
                  console.log("update - select  error - ", Date());
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
// //QSW_017_3 메뉴 삭제
// var Mdelete = (StoreId,MenuId) =>{
//     let MdeleteData = [StoreId,MenuId];
//     return new Promise((resolve, reject) => {
//         console.log('MdeleteData  데이터 >',  MdeleteData);
//         //삭제
//         var sql = 'delete from Menu WHERE StoreId = '
//                      + '"'+ StoreId +'"'+ ' and MenuId = '+'"'+MenuId+'"';
//         conn.connection.query(sql, function (error, rows, fields) {
//             if (error) {
//                 console.log("MdeleteData update error - ", Date());
//                 console.log("errno > " + error);
//                 reject({ msg: error });
//             }else{
//                 resolve({ success: true,code:0});    
//             }  
//         });
//     });
// }

exports.menulist = menulist;
exports.menuInfo = menuInfo;
exports.menuOption = menuOption;
exports.Minsert = Minsert;
exports.Mupdate = Mupdate;
exports.MDelete = MDelete;
exports.ImagesInfo = ImagesInfo;
exports.ImagesInsert = ImagesInsert;
exports.ImagesDelete = ImagesDelete;

