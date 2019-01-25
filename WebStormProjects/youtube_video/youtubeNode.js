var fs = require('fs'),path = require('path');
var videoList = new Array();
function readVideoFile() {
    try{
        var rs1 = fs.readFileSync('video_url.txt', 'utf8');               //同步读取文件的方法，缺点是等待IO操作，在等待时间内无法进行其他操作
        videoList = rs1.split(/[\r]/);                                    //注意该处与上一个文件换行的符号不同，所以在分割时所用的分割符号也不同
        return videoList;
    }
    catch(error){
        console.log(error);
    }
}
videoURL = readVideoFile();

var mysql = require('mysql');
var connection = mysql.createConnection({
        host : 'soka.cbbyxu3ac5hf.us-east-1.rds.amazonaws.com' ,
        user : 'sokaapp' ,
        password : 'sokaApP@P0sswD' ,
        database : 'sokadb'
    }
);

function getMilliSeconds(timeStr) {
    var date = new Date(timeStr),
        ms = date.getTime();                                                 //or ms=date.valueOf();返回指定时间距离1970年1月1日0时0分0秒的毫秒
    return ms;
}

function getDate(strDate){                                              //将string类型转换成date类型
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

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

callback = function () {};

var m1 = function runWriteFile() {
    // connection.connect();
    if(videoURL.length === 1){
        console.log('video_url内容为空，现在开始将新增的视频写入到文件中');
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
        // console.log(myDate1);

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
        // console.log(myDate2);
        var sql2 = 'select url from video where create_time >= ? and create_time <= ? order by id';
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
                            // console.log('写入成功');
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
    else {
        url1 = videoURL[videoURL.length-2];
        var sql1 = "select create_time from video where url = ?";
        connection.query(sql1,url1,function (err,result) {
            if(err){
                console.log('select error --',err.message);
                return;
            }
            console.log('文件中最后添加的url创建时间是：' + result[0]['create_time']);
            lastCreateTime = Number(result[0]['create_time']);
            a = getMilliSeconds(lastCreateTime);                    //将ISO格式的时间转换成时间戳
            b = getFormatDate(a);                                   //将时间戳转换成标准的时间格式
            c = getDate(b);                                         //将string类型转换成date类型
            // console.log(c.getDate());                               //文件中存储的最后一个视频的创建时间

            var myDate = new Date();
            date = myDate.getDate();
            // console.log(c.getDate());
            // console.log(date);
            if(date-2 === c.getDate() || date-1 ===c.getDate()){
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
                // console.log(myDate1);

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
                // console.log(myDate2);
                var sql2 = 'select url from video where create_time >= ? and create_time <= ? order by id';
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
        });
        return false;
    }
    // connection.end();
};

function writing() {
    var i = -1;
    var interval = setInterval(function () {
        i += 1;
        if(i === 1){
            clearInterval(interval);
            process.exit();
        }
        m1();
    },5000);
}
writing();