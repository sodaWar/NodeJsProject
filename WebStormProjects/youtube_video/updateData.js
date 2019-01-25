var fs = require('fs'),path = require('path');
var noPlayList = new Array();
function readFile() {
    try{
        var rs = fs.readFileSync('noPlay_video_url.txt', 'utf8');               //同步读取文件的方法，缺点是等待IO操作，在等待时间内无法进行其他操作
        // rs ? console.log(rs) : console.log('程序出错,请检查！');
        noPlayList = rs.split(/[\n]/);
        return noPlayList;
    }
    catch(error){
        console.log(error);
    }
}
noPlayURL = readFile();

var mysql = require('mysql');
var connection = mysql.createConnection({
        host : '34.235.86.20' ,
        user : 'sokamgrdev' ,
        password : 'sokamgr@Pwd' ,
        database : 'sokadb'
    }
);

function updateData() {
    connection.connect();
    var sql2 = 'update video set status = 2 where url = ?';
    for(var i = 0; i <= noPlayURL.length-2 ; i++){
        url = noPlayURL[i];
        console.log(url);
        connection.query(sql2,url,function (err,result) {
            if(err){
                connection.log('update error --',err.message);
                return;
            }
            else {
                console.log('update affectedRows',result.affectedRows);
            }
        });
    }
    connection.end();
}

updateData();