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
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and Title like '+'"%'+Title+'%"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
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
    let UseYn = 'Y';
    return new Promise((resolve, reject) => {
        console.log('공지사항 insert 데이터 >',  insertData);
        var sql = 'INSERT into NoticeBoard (StoreId,Title,Contents,InsertDt,InsertNm,UseYn)  VALUES(?,?,?,?,?,?)';
        var params =[StoreId,Title,Contents,InsertDt,InsertNm,UseYn];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("boardinsert insert error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //등록 후 조회
                console.log('등록시작');
                var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and Title = '+'"'+Title+'"';
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
            }  
        });
    });
}
//QS_003 공지사항 수정
var boardupdate = (SID,StoreId,Title,Contents,InsertNm,UseYn,UpdateDt) =>{
    let updateData = [SID,StoreId,Title,Contents,InsertNm,UseYn,UpdateDt];
    return new Promise((resolve, reject) => {
        console.log('공지사항 update 데이터 >',  updateData);
        var sql = 'update NoticeBoard set Title = ?, Contents=?, UpdateDt=? ,InsertNm=?,UseYn=? where StoreId = ? and SID = ?';
        var params =[Title, Contents,UpdateDt,InsertNm,UseYn,StoreId,SID];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("boardupdate update error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //수정 후 조회
                var selectSql = 'SELECT SID,StoreId,Title,UseYn,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM NoticeBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
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
            }  
        });
    });
}

//QSW_032 고객센터 (1:1 문의내역) - 조회
var suggestlist = (StoreId,Title) =>{
    return new Promise((resolve, reject) => {
        let selectData = [StoreId,"%"+Title+"%"];
        console.log('공지사항 selectData 데이터 >',  selectData);
        var selectSql = 'SELECT '
                            +'SID, StoreId, SsoKey, Title, Contents, ReContents, UseYn, '
                            +'InsertNm, DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt, '
                            +'UpdateNm, DATE_FORMAT(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt ' 
                        +'FROM SuggestBoard WHERE StoreId = ? AND Title LIKE ? ';
        let sql = require('mysql').format(selectSql , selectData);
        conn.connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
//QSW_032_2 고객센터 (1:1 문의내역) - 상세조회
var suggestselect = (StoreId,SID) =>{
    return new Promise((resolve, reject) => {
        let selectData = [StoreId, SID];
        console.log('suggestselect  데이터 >',  selectData);
        var selectSql = 'SELECT '
                            +'SID, StoreId, SsoKey, Title, Contents, ReContents, UseYn, '
                            +'InsertNm, DATE_FORMAT(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt, '
                            +'UpdateNm, DATE_FORMAT(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt '
                        +'FROM SuggestBoard WHERE StoreId = ? AND SID = ? ';
        let sql = require('mysql').format(selectSql , selectData);
        conn.connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log("selectData select error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
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

//QS_033 고객센터 (1:1 문의내역) - 수정
var suggestupdate = (SID, StoreId, UpdateDt, ReContents, UpdateNm, UseYn) =>{
    return new Promise((resolve, reject) => {
        let updateData = [ReContents, UpdateNm, UpdateDt, UseYn, StoreId, SID];
        console.log('고객센터 (1:1 문의내역) update 데이터 >',  updateData);
        var updateSql = 'UPDATE SuggestBoard '
                        +'SET '
                            +'ReContents = ? '
                            +',UpdateNm = ? '
                            +',UpdateDt = ? '
                            +',UseYn = ? '
                        +'WHERE StoreId = ? '
                        +'AND SID = ? ';
        let sql = require('mysql').format(updateSql , updateData);
        conn.connection.query(sql, function (error, rows, fields) {
            if (error) {
                console.log("suggestupdate update error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //수정 후 조회
                var selectSql = 'SELECT SID,StoreId,Title,Contents,UseYn,InsertNm,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM SuggestBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
                conn.connection.query(selectSql, function (error, rows, fields) {
                    if (error) {
                        console.log("suggestupdate update error - ", Date());
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
            }  
        });
    });
}
//QS_033 고객센터 (1:1 문의내역) - 등록
var suggestinsert = (StoreId,Title,Contents,UseYn,InsertNm,InsertDt) =>{
    let updateData = [StoreId,Title,Contents,UseYn,InsertNm,InsertDt];
    return new Promise((resolve, reject) => {
        console.log('고객센터 insert 데이터 >',  updateData);
        var sql = 'INSERT into SuggestBoard (StoreId,Title,Contents,UseYn,InsertNm,InsertDt)  VALUES(?,?,?,?,?,?)';
        var params =[ StoreId,Title,Contents,UseYn,InsertNm,InsertDt];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("suggestupdate update error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //등록 후 조회
                var selectSql = 'SELECT SID,StoreId,Title,Contents,UseYn,InsertNm,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM SuggestBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+' order by InsertDt desc';
                conn.connection.query(selectSql, function (error, rows, fields) {
                    if (error) {
                        console.log("고객센터 insert error - ", Date());
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
            }  
        });
    });
}
//QSW_034 FAQ (자주하는 질문) - 조회
var inquirelist = (StoreId,Title) =>{
    let selectData = [StoreId,Title];
    return new Promise((resolve, reject) => {
        console.log('inquirelist 데이터 >',  selectData);
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm ,UseYn FROM InquireBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and Title like '+'"%'+Title+'%"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("inquirelist select error - ", Date());
                console.log("errno > " + error);
                reject({ code: error, msg: error });
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
//QSW_034_2 FAQ (자주하는 질문) - 상세조회
var inquireselect = (StoreId,SID) =>{
    let selectData = [StoreId,SID];
    return new Promise((resolve, reject) => {
        console.log('inquireselect  데이터 >',  selectData);
        var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM InquireBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
        conn.connection.query(selectSql, function (error, rows, fields) {
            if (error) {
                console.log("inquireselect select error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
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

//QS_035 FAQ (자주하는 질문) - 수정
var inquireupdate = (SID,StoreId,Title,Contents,UseYn,InsertNm,UpdateDt) =>{
    let updateData = [SID,StoreId,Title,Contents,UseYn,InsertNm,UpdateDt];
    return new Promise((resolve, reject) => {
        console.log('문의사항 update 데이터 >',  updateData);
        var sql = 'update InquireBoard set Title=? ,Contents=?,UseYn=?,InsertNm=?,UpdateDt=? where StoreId = ? and SID = ?';
        var params =[Title,Contents,UseYn,InsertNm,UpdateDt,StoreId,SID];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("inquireupdate update error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //수정 후 조회
                var selectSql = 'SELECT SID,StoreId,Title,Contents,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm ,UseYn FROM InquireBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+'and SID = '+'"'+SID+'"';
                conn.connection.query(selectSql, function (error, rows, fields) {
                    if (error) {
                        console.log("inquireupdate update error - ", Date());
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
            }  
        });
    });
}
//QS_033 FAQ (자주하는 질문) - 등록
var inquireinsert = (StoreId,Title,Contents,UseYn,InsertNm,InsertDt) =>{
    let updateData = [StoreId,Title,Contents,UseYn,InsertNm,InsertDt];
    return new Promise((resolve, reject) => {
        console.log('고객센터 insert 데이터 >',  updateData);
        var sql = 'INSERT into InquireBoard (StoreId,Title,Contents,UseYn,InsertNm,InsertDt)  VALUES(?,?,?,?,?,?)';
        var params =[ StoreId,Title,Contents,UseYn,InsertNm,InsertDt];
        conn.connection.query(sql,params, function (error, rows, fields) {
            if (error) {
                console.log("suggestupdate update error - ", Date());
                console.log("sqlMessage > " + error);
                reject({ code: error, msg: error });
            }else{
                //등록 후 조회
                var selectSql = 'SELECT SID,StoreId,Title,Contents,UseYn,InsertNm,date_format(UpdateDt, "%Y-%m-%d %H:%i") AS UpdateDt,date_format(InsertDt, "%Y-%m-%d %H:%i") AS InsertDt,InsertNm,UseYn FROM InquireBoard WHERE StoreId = '
                        +'"'+StoreId+'"'+' order by InsertDt desc';
                conn.connection.query(selectSql, function (error, rows, fields) {
                    if (error) {
                        console.log("고객센터 insert error - ", Date());
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
            }  
        });
    });
}
exports.boardlist = boardlist
exports.boardselect = boardselect
exports.boardinsert = boardinsert
exports.boardupdate = boardupdate
exports.suggestlist = suggestlist
exports.suggestselect = suggestselect
exports.suggestupdate = suggestupdate
exports.inquirelist = inquirelist
exports.inquireselect = inquireselect
exports.inquireupdate = inquireupdate
exports.suggestinsert = suggestinsert
exports.inquireinsert = inquireinsert