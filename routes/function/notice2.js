var moment = require('moment');
var conn = require('../components/mariaDB');
var url = require('../components/mongodb').url;
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');


//QS_001 공지사항 조회
var boardlist = (StoreId,Title) =>{
    let selectData = [StoreId,Title];
    return new Promise((resolve, reject) => {
        console.log('공지사항 selectData 데이터 >',  selectData);
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,UpdateNm,InsertNm FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and Title like '+'"%'+Title+'%"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("errno > " + error.errno);
                console.log("sqlMessage > " + error.sqlMessage);
                reject({ code: error.errno, msg: error.sqlMessage });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows ,code:0});
                }else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                }else{
                    resolve({ success: false, msg: error,code:2 });
                }
              }  
        });
    });
}
//QS_001 공지사항 상세조회
var boardselect = (StoreId,SID) =>{
    let selectData = [StoreId,SID];
    return new Promise((resolve, reject) => {
        console.log('공지사항 selectData 데이터 >',  selectData);
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,UpdateNm,InsertNm FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("errno > " + error.errno);
                console.log("sqlMessage > " + error.sqlMessage);
                reject({ code: error.errno, msg: error.sqlMessage });
              } else {
                if (!error && rows.length > 0) {
                    resolve({ success: true, info: rows[0] ,code:0});
                }else if (!error && rows.length == 0) {
                    resolve({ success: false, msg: null ,code:1});
                }else{
                    resolve({ success: false, msg: error,code:2 });
                }
              }  
        });
    });
}
//QS_002 공지사항 등록
var boardinsert = (StoreId,Title,Contents,InsertNm,InsertDt) =>{
    let insertData = [StoreId,Title,Contents,InsertNm,InsertDt];
    return new Promise((resolve, reject) => {
        console.log('공지사항 insert 데이터 >',  insertData);
        var sql = 'INSERT into NoticeBoard (StoreId,Title,Contents,InsertDt,InsertNm)  VALUES(?,?,?,?,?)';
        var params =[StoreId,Title,Contents,InsertDt,InsertNm];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("boardinsert insert error - ", Date());
                console.log("errno > " + error.errno);
                console.log("sqlMessage > " + error.sqlMessage);
                reject({ code: error.errno, msg: error.sqlMessage });
            }else{
                resolve({ success: true  ,code:0});
            }  
        });
    });
}
//QS_003 공지사항 수정
var boardupdate = (SID,StoreId,Title,Contents,UpdateNm,UpdateDt) =>{
    let updateData = [SID,StoreId,Title,Contents,UpdateNm,UpdateDt];
    return new Promise((resolve, reject) => {
        console.log('공지사항 update 데이터 >',  updateData);
        var sql = 'update NoticeBoard set Title = ?, Contents=?, UpdateDt=? ,UpdateNm=? where StoreId = ? and SID = ?';
        var params =[Title, Contents,UpdateDt,UpdateNm,StoreId,SID];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("boardupdate update error - ", Date());
                console.log("errno > " + error.errno);
                console.log("sqlMessage > " + error.sqlMessage);
                reject({ code: error.errno, msg: error.sqlMessage });
            }else{
                resolve({ success: true  ,code:0});
            }  
        });
    });
}
//QS_004 공지사항 삭제
var boarddelete = (SID,StoreId) =>{
    let deleteData = [SID,StoreId];
    return new Promise((resolve, reject) => {
        console.log('공지사항 delete 데이터 >',  deleteData);
        var sql = 'delete from NoticeBoard where StoreId = ? and SID = ?';
        var params =[StoreId,SID];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("deleteData delete error - ", Date());
                console.log("errno > " + error.errno);
                console.log("sqlMessage > " + error.sqlMessage);
                reject({ code: error.errno, msg: error.sqlMessage });
            }else{
                resolve({ success: true  ,code:0});
            }  
        });
    });
}

exports.boardlist = boardlist
exports.boardselect = boardselect
exports.boardinsert = boardinsert
exports.boardupdate = boardupdate
exports.boarddelete = boarddelete