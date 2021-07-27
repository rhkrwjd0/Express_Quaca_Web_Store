var express = require('express');
var router = express.Router();
var moment = require('moment');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var mongoose = require('mongoose');
var url = require('../components/mongodb').url;
var conn = require('../components/mariaDB');
var { boardlist,boardselect,boardinsert,boardupdate,boarddelete} = require('../function/notice');

//QS_001 공지사항 조회
router.post('/boardlist', function (req, res) {
    let StoreId = req.body.StoreId;
    let Title = req.body.Title;
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
//QS_001_1 공지사항 상세조회
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
            res.json({ success: true, info:Contents  });
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
    let UpdateNm = req.body.UpdateNm;
    var d = new Date();
    let UpdateDt = moment(d).format('YYYY-MM-DD HH:mm:ss');
    boardupdate(SID,StoreId,Title,Contents,UpdateNm,UpdateDt)
        .then((resboardupdate)=>{
            if (resboardupdate.code == 0) {
            res.json({ success: true, info:Contents  });
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
//QS_004 공지사항 삭제
router.post('/boarddelete', function (req, res) {
    let SID = req.body.SID;
    let StoreId = req.body.StoreId;
    boarddelete(SID,StoreId)
        .then((resboarddelete)=>{
            if (resboarddelete.code == 0) {
            res.json({ success: true, info:SID  });
            console.log("res boarddelete  delete 성공 -", Date());
            }else {
            res.json({ success: false, msg: resboarddelete.msg });
            console.log("res  boarddelete delete  실패 -", Date());
            }
        })
        .catch((error) => {
            res.json({ code: 999, msg: "error" });
            console.log("boarddelete catch - boarddelete delete 실패 :", error, " - ", Date());
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
