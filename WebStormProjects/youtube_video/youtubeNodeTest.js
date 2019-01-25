var fs = require('fs'),path = require('path');
// var noPlayList = new Array();
var videoList = new Array();

// function readFile() {
//     try{
//         var rs = fs.readFileSync('noPlay_video_url.txt', 'utf8');               //同步读取文件的方法，缺点是等待IO操作，在等待时间内无法进行其他操作
//         // rs ? console.log(rs) : console.log('程序出错,请检查！');
//         noPlayList = rs.split(/[\n]/);
//         return noPlayList;
//     }
//     catch(error){
//         console.log(error);
//     }
// }
// noPlayURL = readFile();

function readVideoFile() {
    try{
        var rs1 = fs.readFileSync('video_url.txt', 'utf8');               //同步读取文件的方法，缺点是等待IO操作，在等待时间内无法进行其他操作
        // rs1 ? console.log(rs1) : console.log('程序出错,请检查！');
        videoList = rs1.split(/[\r]/);                                    //注意该处与上一个文件换行的符号不同，所以在分割时所用的分割符号也不同
        return videoList;
    }
    catch(error){
        console.log(error);
    }
}
videoURL = readVideoFile();

// function readWriteFile() {
//     try{
//         var rs2 = fs.readFileSync('writeOn.txt', 'utf8');
//         // rs2 ? console.log(rs2) : console.log('程序出错,请检查！');
//         return rs2;
//     }
//     catch(error){
//         console.log(error);
//     }
// }
// writeOn = Number(readWriteFile());

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : '34.235.86.20' ,
    user : 'sokamgrdev' ,
    password : 'sokamgr@Pwd' ,
    database : 'sokadb'
    }
);

// var m2 = function writeFile() {
//     connection.connect();
//     var myDate1=new Date();
//     a = myDate1.getHours() -8;
//     b = myDate1.getMinutes();
//     c = myDate1.getSeconds();
//     d = myDate1.getMilliseconds();
//     myDate1.setDate(myDate1.getDate()-1);
//     myDate1.setHours(myDate1.getHours()-a-8);
//     myDate1.setMinutes(myDate1.getMinutes()-b);
//     myDate1.setSeconds(myDate1.getSeconds()-c);
//     myDate1.setMilliseconds(myDate1.getMilliseconds()-d);
//     console.log(myDate1);
//
//     var myDate2=new Date();
//     a = myDate2.getHours() - 8;
//     b = myDate2.getMinutes();
//     c = myDate2.getSeconds();
//     d = myDate2.getDate();
//     e = myDate2.getMilliseconds();
//     myDate2.setMilliseconds(myDate2.getMilliseconds()-e);
//     myDate2.setDate(myDate2.getDate()-2);
//     myDate2.setHours(myDate2.getHours()-a-8);               //减8是为了与服务器时间对应，服务器时间是UTC时间
//     myDate2.setMinutes(myDate2.getMinutes()-b);
//     myDate2.setSeconds(myDate2.getSeconds()-c);
//     console.log(myDate2);
//     var sql1 = 'select url from video where create_time > ? and create_time < ? order by id';
//     connection.query(sql1,[myDate2,myDate1],function (err,result) {                                     //注意这里多个查询限制条件的参数写法！！
//         if(err){
//             console.log('select error -- ',err.message);
//             return
//         }
//         console.log('---   SELECT   RESULT  ----');
//         console.log(result.length);
//         for(var i = 0;i<result.length;i++){
//             try {
//                 fs.writeFile(__dirname + '/video_url.txt',result[i]['url'] + '\r', {flag: 'a'}, function (err) {
//                     if(err) {
//                         console.error(err);
//                     } else {
//                         // console.log('写入成功');
//                     }
//                 });
//                 // console.log(result[i]['url']);
//             }
//             catch(TypeError){
//                 console.log('出现异常，写入未成功');                                  //脚本执行完毕后要清空txt文件
//             }
//         }
//     });
//     connection.end();
// };

function getMilliSeconds(timeStr) {
    var date = new Date(timeStr),
        ms = date.getTime();                                                 //or ms=date.valueOf();返回指定时间距离1970年1月1日0时0分0秒的毫秒
    return ms;
}

// function getCommonTime(milliseconds) {
//     var date = new Date(milliseconds),
//         time = date.toLocaleString(),//这种方法获取的时间格式根据电脑的不同而有所不同
//         formatTime = getFormatDate(date);//获取格式化后的日期
//     return time;
// }

function getFormatDate(timeStr, dateSeparator, timeSeparator) {                         //将时间戳格式类型转换成指定的格式的日期格式
    dateSeparator = dateSeparator ? dateSeparator : "-";
    timeSeparator = timeSeparator ? timeSeparator : ":";
    var date = new Date(timeStr),
        year = date.getFullYear(),// 获取完整的年份(4位,1970)
        month = date.getMonth(),// 获取月份(0-11,0代表1月,用的时候记得加上1)
        day = date.getDate(),// 获取日(1-31)
        hour = date.getHours(),// 获取小时数(0-23)
        minute = date.getMinutes(),// 获取分钟数(0-59)
        seconds = date.getSeconds(),// 获取秒数(0-59)
        Y = year + dateSeparator,
        M = ((month + 1) > 9 ? (month + 1) : ('0' + (month + 1))) + dateSeparator,
        D = (day > 9 ? day : ('0' + day)) + ' ',
        h = (hour > 9 ? hour : ('0' + hour)) + timeSeparator,
        m = (minute > 9 ? minute : ('0' + minute)) + timeSeparator,
        s = (seconds > 9 ? seconds : ('0' + seconds)),
        formatDate = Y + M + D + h + m + s;
    return formatDate;
}

function getDate(strDate){                                              //将string类型转换成date类型
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

/**
 查询 有回调
 获得domain
 type默认domain
 value 默认为空
 var dataStr = JSON.stringify(results);将json对象装换成json数据
 */
callback = function () {
    
};

function getAllURL(type,value,callback){
    if(videoURL.length === 1){
        console.log('video_url内容为空，请查看')
    }
    else {
        url1 = videoURL[videoURL.length - 2];
        var option = new Array();
        var sql1 = "select create_time from video where url = ?";
        connection.query(sql1, url1, function (err, results) {
            if (results) {
                option.push(results[0]['create_time']);
            }
            callback(err, option);//回调函数返回option数组
        });
    }
    connection.end();
}
//
// getAllURL('video','',function(err,results){
//     var datas = {};
//     datas = results;                                                        //results为调用方法的回调成功后的返回值
//     lastCreateTime = Number(datas[0]);
//     a = getMilliSeconds(lastCreateTime);                                    //将ISO格式的时间转换成时间戳
//     b = getFormatDate(a);                                                   //将时间戳转换成标准的时间格式
//     c = getDate(b);                                                         //将string类型转换成date类型
//     console.log(c.getDate());                                               //文件中存储的最后一个视频的创建时间
//
//     var myDate = new Date();
//     date = myDate.getDate();
//     if(date-1 === c.getDate()){
//         console.log('今日已将昨天视频写入到文件中，请查看');
//         fs.writeFile(__dirname + '/writeOn.txt', '0',{flag: 'w'}, function (err) {
//             if(err) {
//                 console.error(err);
//             } else {
//                 // console.log('写入成功');
//             }
//         });
//     }
//     else {
//         console.log('开始将新增的视频写入到文件中....');
//         fs.writeFile(__dirname + '/writeOn.txt', '1',{flag: 'w'}, function (err) {
//             if(err) {
//                 console.error(err);
//             } else {
//                 // console.log('写入成功');
//             }
//         });
//     }
// });



// getAllURL('video','',callback);

var m1 = function runWriteFile() {
    // connection.connect();
    if(videoURL.length === 1){
        console.log('video_url内容为空，请查看')
    }
    else {
        url1 = videoURL[videoURL.length-2];
        var sql1 = "select create_time from video where url = ?";
        connection.query(sql1,url1,function (err,result) {
            if(err){
                console.log('select error --',err.message);
                return;
            }
            console.log(result[0]['create_time']);
            lastCreateTime = Number(result[0]['create_time']);
            a = getMilliSeconds(lastCreateTime);                    //将ISO格式的时间转换成时间戳
            b = getFormatDate(a);                                   //将时间戳转换成标准的时间格式
            c = getDate(b);                                         //将string类型转换成date类型
            console.log(c.getDate());                               //文件中存储的最后一个视频的创建时间

            var myDate = new Date();
            date = myDate.getDate();
            console.log(c.getDate());
            console.log(date);
            if(date-1 === c.getDate()){
                console.log('今日已将昨天视频写入到文件中，请查看');
            }
            else {
                console.log('开始将新增的视频写入到文件中....');
                var myDate1=new Date();
                x1 = myDate1.getHours() -8;
                x2 = myDate1.getMinutes();
                x3 = myDate1.getSeconds();
                x4 = myDate1.getMilliseconds();
                myDate1.setDate(myDate1.getDate()-1);
                myDate1.setHours(myDate1.getHours()-x1-8);
                myDate1.setMinutes(myDate1.getMinutes()-x2);
                myDate1.setSeconds(myDate1.getSeconds()-x3);
                myDate1.setMilliseconds(myDate1.getMilliseconds()-x4);
                console.log(myDate1);

                var myDate2=new Date();
                x1 = myDate2.getHours() - 8;
                x2 = myDate2.getMinutes();
                x3 = myDate2.getSeconds();
                x4 = myDate2.getMilliseconds();
                myDate2.setDate(myDate2.getDate()-2);
                myDate2.setHours(myDate2.getHours()-x1-8);               //减8是为了与服务器时间对应，服务器时间是UTC时间
                myDate2.setMinutes(myDate2.getMinutes()-x2);
                myDate2.setSeconds(myDate2.getSeconds()-x3);
                myDate2.setMilliseconds(myDate2.getMilliseconds()-x4);
                console.log(myDate2);
                var sql2 = 'select url from video where create_time > ? and create_time < ? order by id';
                connection.query(sql2,[myDate2,myDate1],function (err,result) {                                     //注意这里多个查询限制条件的参数写法！！
                    if(err){
                        console.log('select error -- ',err.message);
                        return
                    }
                    console.log('---   SELECT   RESULT  ----');
                    console.log(result.length);
                    for(var i = 0;i<result.length;i++){
                        try {
                            fs.writeFile(__dirname + '/video_url.txt',result[i]['url'] + '\r', {flag: 'a'}, function (err) {
                                if(err) {
                                    console.error(err);
                                } else {
                                    console.log('写入成功');
                                }
                            });
                            // console.log(result[i]['url']);
                        }
                        catch(TypeError){
                            console.log('出现异常，写入未成功');                                  //脚本执行完毕后要清空txt文件
                        }
                    }
                });
            }
            // var timestamp1 = Date.parse(new Date(lastCreateTime));
            // timestamp2 = timestamp1 / 1000;
            // b = getCommonTime(a);
            // console.log(b);

        });
    }
    // connection.end();
};
m1();




/*
function callback(err,data) {
    if(err){
        console.log(err);
        return;
    }
    else {
        console.log(data);
        // return data;
    }
}
function readFile() {
    fs.readFile(__dirname + '/noPlay_video_url.txt', {flag: 'r+', encoding: 'utf8'}, callback);    //异步读取文件，缺点是代码麻烦
}

var noPlayList = ReadFile();
console.log(noPlayList);
*/
