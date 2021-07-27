var express = require('express');
var router = express.Router();
var moment = require('moment');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var url = require('../components/mongodb').url;
var conn = require('../components/mariaDB');
var { inquireinsert,suggestinsert,inquirelist,inquireselect,inquireupdate,suggestlist,suggestselect,suggestupdate,boardlist,boardselect,boardinsert,boardupdate,boarddelete} = require('../function/notice');

//QSW_030 공지사항 조회
router.post('/boardlist', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    console.log('boardlist',StoreId,Title);
    boardlist(StoreId,Title)
        .then((resboardlist)=>{
            if (resboardlist.code == 0) {
            res.json({ success: true, info: resboardlist.info });
            console.log("res boardlist  Select 성공 -", Date());
            }else if(resboardlist.code == 1){
            res.json({ success: false, msg: null});
            console.log("res boardlist 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resboardlist.msg });
            console.log("res  boardlist Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("boardselect catch - boardselect select 실패 :", error, " - ", Date());
        })
});
//QSW_030_2 공지사항 상세조회
router.post('/boardselect', function (req, res) {
    let StoreId = req.body.StoreId;
    let SID = req.body.SID;
    boardselect(StoreId,SID)
        .then((resboardselect)=>{
            if (resboardselect.code == 0) {
            res.json({ success: true, info: resboardselect.info });
            console.log("res boardselect  Select 성공 -", Date());
            }else if(resboardselect.code == 1){
            res.json({ success: false, msg: null});
            console.log("res boardselect 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resboardselect.msg });
            console.log("res  boardselect Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("boardselect catch - boardselect select 실패 :", error, " - ", Date());
        })
});
//QS_002 공지사항 등록
router.post('/boardinsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    let Contents = req.body.Contents;
    let InsertNm = req.body.InsertNm;
    var d = new Date();
    let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    boardinsert(StoreId,Title,Contents,InsertNm,InsertDt)
        .then((resboardinsert)=>{
            if (resboardinsert.code == 0) {
            res.json({ success: true, info:resboardinsert.rows  });
            console.log("res boardinsert  insert 성공 -", Date());
            }else {
            res.json({ success: false, msg: resboardinsert.msg });
            console.log("res  boardinsert insert  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("boardinsert catch - boardinsert insert 실패 :", error, " - ", Date());
        })
});
//QS_003 공지사항 수정
router.post('/boardupdate', function (req, res) {
    let SID = req.body.SID;
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    let Contents = req.body.Contents;
    let InsertNm = req.body.InsertNm;
    let UseYn = req.body.UseYn;
    var d = new Date();
    let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    boardupdate(SID,StoreId,Title,Contents,InsertNm,UseYn,UpdateDt)
        .then((resboardupdate)=>{
            if (resboardupdate.code == 0) {
            res.json({ success: true, info:resboardupdate.rows  });
            console.log("res boardupdate  update 성공 -", Date());
            }else {
            res.json({ success: false, msg: resboardupdate.msg });
            console.log("res  boardupdate update  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("boardupdate catch - boardupdate update 실패 :", error, " - ", Date());
        })
});

//QSW_032 고객센터 (1:1 문의내역) - 목록
router.post('/suggestlist', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    suggestlist(StoreId,Title)
        .then((ressuggestlist)=>{
            if (ressuggestlist.code == 0) {
            res.json({ success: true, info: ressuggestlist.info });
            console.log("res suggestlist  Select 성공 -", Date());
            }else if(ressuggestlist.code == 1){
            res.json({ success: false, msg: null});
            console.log("res suggestlist 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: ressuggestlist.msg });
            console.log("res  suggestlist Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("suggestlist catch - suggestlist select 실패 :", error, " - ", Date());
        })
});
//QSW_032_2 고객센터 (1:1 문의내역) - 상세목록
router.post('/suggestselect', function (req, res) {
    let StoreId = req.body.StoreId;
    let SID = req.body.SID;
    suggestselect(StoreId,SID)
        .then((ressuggestselect)=>{
            if (ressuggestselect.code == 0) {
            res.json({ success: true, info: ressuggestselect.info });
            console.log("res suggestselect  Select 성공 -", Date());
            }else if(ressuggestselect.code == 1){
            res.json({ success: false, msg: null});
            console.log("res suggestselect 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: ressuggestselect.msg });
            console.log("res  suggestselect Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("suggestselect catch - suggestselect select 실패 :", error, " - ", Date());
        })
});
//QS_033 고객센터 (1:1 문의내역) - 수정
router.post('/suggestupdate', function (req, res) {
    let SID = req.body.SID;
    let StoreId = req.body.StoreId;
    let ReContents = req.body.ReContents;
    let UpdateNm = req.body.UpdateNm;
    let UseYn = req.body.UseYn;
    var d = new Date();
    let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    suggestupdate(SID, StoreId, UpdateDt, ReContents, UpdateNm, UseYn)
        .then((ressuggestupdate)=>{
            if (ressuggestupdate.code == 0) {
            res.json({ success: true, info:ressuggestupdate.rows  });
            console.log("res suggestupdate  select 성공 -", Date());
            }else {
            res.json({ success: false, msg: ressuggestupdate.msg });
            console.log("res  suggestupdate select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("suggestupdate catch - suggestupdate select 실패 :", error, " - ", Date());
        })
});
//QS_033 고객센터 (1:1 문의내역) - 등록
router.post('/suggestinsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    let Contents = req.body.Contents;
    let UseYn ='Y'
    let InsertNm = req.body.InsertNm;
    var d = new Date();
    let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    suggestinsert(StoreId,Title,Contents,UseYn,InsertNm,InsertDt)
        .then((ressuggestinsert)=>{
            if (ressuggestinsert.code == 0) {
            res.json({ success: true, info:ressuggestinsert.rows  });
            console.log("res suggestinsert  select 성공 -", Date());
            }else {
            res.json({ success: false, msg: ressuggestinsert.msg });
            console.log("res  suggestinsert select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("suggestinsert catch - suggestinsert select 실패 :", error, " - ", Date());
        })
});
//QSW_034 FAQ (자주하는 질문) - 목록
router.post('/inquirelist', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    inquirelist(StoreId,Title)
        .then((resinquirelist)=>{
            if (resinquirelist.code == 0) {
            res.json({ success: true, info: resinquirelist.info });
            console.log("res inquirelist  Select 성공 -", Date());
            }else if(resinquirelist.code == 1){
            res.json({ success: false, msg: null});
            console.log("res inquirelist 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resinquirelist.msg });
            console.log("res  inquirelist Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("inquirelist catch - inquirelist select 실패 :", error, " - ", Date());
        })
});
//QSW_034_2 FAQ (자주하는 질문) - 상세목록
router.post('/inquireselect', function (req, res) {
    let StoreId = req.body.StoreId;
    let SID = req.body.SID;
    inquireselect(StoreId,SID)
        .then((resinquireselect)=>{
            if (resinquireselect.code == 0) {
            res.json({ success: true, info: resinquireselect.info });
            console.log("res inquireselect  Select 성공 -", Date());
            }else if(resinquireselect.code == 1){
            res.json({ success: false, msg: null});
            console.log("res inquireselect 데이터 값 없음 -", Date());
            } else {
            res.json({ success: false, msg: resinquireselect.msg });
            console.log("res  inquireselect Select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("inquireselect catch - inquireselect select 실패 :", error, " - ", Date());
        })
});
//QS_035 FAQ (자주하는 질문) - 수정
router.post('/inquireupdate', function (req, res) {
    let SID = req.body.SID;
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    let Contents = req.body.Contents;
    let UseYn = req.body.UseYn;
    let InsertNm = req.body.InsertNm;
    var d = new Date();
    let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    inquireupdate(SID,StoreId,Title,Contents,UseYn,InsertNm,UpdateDt)
        .then((resinquireupdate)=>{
            if (resinquireupdate.code == 0) {
            res.json({ success: true, info:resinquireupdate.rows  });
            console.log("res inquireupdate  select 성공 -", Date());
            }else {
            res.json({ success: false, msg: resinquireupdate.msg });
            console.log("res  inquireupdate select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("inquireupdate catch - inquireupdate select 실패 :", error, " - ", Date());
        })
});
//QS_035 FAQ (자주하는 질문) - 등록
router.post('/inquireinsert', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
    let Contents = req.body.Contents;
    let UseYn ='Y'
    let InsertNm = req.body.InsertNm;
    var d = new Date();
    let InsertDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    inquireinsert(StoreId,Title,Contents,UseYn,InsertNm,InsertDt)
        .then((resinquireinsert)=>{
            if (resinquireinsert.code == 0) {
            res.json({ success: true, info:resinquireinsert.rows  });
            console.log("res inquireinsert  select 성공 -", Date());
            }else {
            res.json({ success: false, msg: resinquireinsert.msg });
            console.log("res  inquireinsert select  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("inquireinsert catch - inquireinsert select 실패 :", error, " - ", Date());
        })
});








// router.get('/', function (req, res, next) {
//     console.log("111111111111111");
//     res.render('mongo',{UserName:' ',MenuName:' ' ,Count:' ', Price:' ', date: ' ', UserId:' '});
// });

// router.get('/order', function (req, res) {
//     console.log(url);
//     let UserName = req.query.UserName;
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         //assert.equal(null, err);
//         console.log("Connected successfully to server");
//         db = client.db('notice');
//         console.log(UserName);
//         db.collection('notice').find().toArray(function(err,doc){
//             if(err) return res.status(500).json({error: err});
//             if(!doc) return res.status(404).json({error: 'UserName not found'});
//             res.json(doc); 
//             console.log("데이터 조회 !");
//             client.close();
//             });
//     });
// });


// router.get('/search', function (req, res) {
//     console.log('~~~~~~~~~~~~~~~~~~~');
//     let UserId = req.query.UserId;
//     console.log(UserId);
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");   
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         console.log(myquery);
//         db.collection('notice').findOne(myquery,function(err,doc){
//         var data = JSON.stringify(doc);
//         if(err) return res.status(500).json({error: err});
//         if(!doc) return res.status(404).json({error: 'UserId not found'});
//         res.render('mongo',{UserName:doc.UserName, MenuName:doc.MenuName, Count:doc.count, Price:doc.Price, date:doc.date, UserId:doc._id });
//         console.log("데이터 조회 !");
//     });
// });
// });

// router.get('/insert', function (req, res) {
//     let UserName = req.query.UserName;
//     let MenuName = req.query.MenuName;
//     let Count = req.query.Count;
//     let Price = req.query.Price;
//     var date = moment().format('YYYY-MM-DD HH:mm:ss');
//     console.log(UserName,MenuName,Count, Price,date );
//     console.log(url);
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         var db = client.db('notice');
//         db.collection('notice')
//         .insertOne({
//             "UserName" : UserName,
//             "MenuName" : MenuName,
//             "count" : Count,
//             "Price" : Price,
//             "date" : date
//         });
//         console.log("데이터 추가 !");
//     });
// });

// router.get('/update', function (req, res) {
//     var UserId = req.query.UserId;
//     let UserName = req.query.UserName;
//     let MenuName = req.query.MenuName;
//     let Count = req.query.Count;
//     let Price = req.query.Price;
//     var date = moment().format('YYYY-MM-DD HH:mm:ss');
//     console.log(UserId,UserName,MenuName,Count, Price,date );
    
//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         if (err) throw err;
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         var newvalues = { $set: {UserId:UserId, UserName:UserName,MenuName:MenuName, count:Count, Price:Price, date:date} };
//         db.collection('notice').updateOne(myquery, newvalues, function(err,res){
//             if (err) throw err;
//             console.log("1 document updated");
//             client.close();
//         });
//     }); 
// });

// router.get('/delete', function (req, res) {
//     var UserId = req.query.UserId;

//     MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//         console.log("Connected successfully to server");
//         if (err) throw err;
//         var db = client.db('notice');
//         var id = mongoose.Types.ObjectId(UserId);
//         var myquery = {_id : id};
//         db.collection('notice').deleteOne(myquery, function(err,res){
//             if (err) throw err;
//             console.log("1 document delete");
//             client.close();
//         });
//     }); 
// });
// router.get('/home', function (req, res) {
//     res.render('index',{title:"User",hUrl:' ', Url:' ' });
// });
module.exports = router;

