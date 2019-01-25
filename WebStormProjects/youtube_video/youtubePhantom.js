var openFailPath='video_url.txt';
phantom.outputEncoding="UTF-8";
var fs = require('fs');
var urlList = new Array();
function readFile() {
    console.log('reading...');
    fs.outputEncoding="UTF-8";                                  //必须设置成UTF-8，如果是gbk格式，中文在输出到控制台时显示会乱码
    var file = fs.open(openFailPath,'r');
    var readText = file.read();
    file.close();
    console.log('read end!');

    urlList = readText.split(/[\r]/);                           //将一个字符串分割成字符串数组
    for(var i = 0;i<urlList.length;i++){
        // console.log(urlList[i]);
    }
    console.log('Run done...');
    return urlList;
}

var noPlayList = new Array();
var openPlayPath = 'noPlay_video_url.txt';
function ReadNoPlayVideo() {
    fs.outputEncoding="UTF-8";
    var file_x = fs.open(openPlayPath,'r');
    var readText_x = file_x.read();
    file_x.close();

    noPlayList = readText_x.split(/[\r]/);
    for(var i = 0;i<noPlayList.length;i++){
        // console.log(urlList[i]);
    }
    return noPlayList;
}

noPlayURL = ReadNoPlayVideo();
youtubeURL = readFile();
var page = require('webpage').create();
function youtube(y) {
    console.log(youtubeURL[y]);
    page.open(youtubeURL[y], function (status) {
        console.log();
        if (status === "success") {
            console.log('open success');
            // aria-disabled="true"
            // var play_key = document.getElementsByTagName("div");
            // console.log(play_key.length);
            // var button = page.evaluate(function() {
            //     return document.getElementsByClassName("ytp-play-button")[0]
            // });
            // page.render('test.jpg');
            // try {
            //     page.sendEvent('click', button.left + button.width / 2, button.top + button.height / 2);
            //     console.log('可以播放');
            // }
            // catch (TypeError){
            //     console.log('该视频不能播放');
            //     try {
            //         var index = noPlayURL.indexOf(youtubeURL[y]);
            //         if(index >= 0){
            //             console.log('该视频已存在于不能播放的视频列表中');
            //             }
            //         else {
            //             fs.write("noPlay_video_url.txt", youtubeURL[y] , 'a');
            //         }
            //     } catch(e) {
            //         console.log(e);
            //         console.log('出现异常，写入未成功');
            //     }
            // }

        }
        else {
            console.log('open fail');
        }
    });
}

function timing() {
    var i = -1;
    var interval = setInterval(function () {
        i += 1;
        if(i === youtubeURL.length-1){
            clearInterval(interval);
            phantom.exit();
        }
        youtube(i);
    },20000);
}

try {
    timing();
}
catch (err){
    console.log('视频检测完毕！！')
}
// youtube(0);
// for(var y = 0; y < youtubeURL.length ;y++){
//     a = youtube(y);
//     console.log(a);
// }



/*
       var button1 = page.evaluate(function() {
           return document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label");
       });

       // console.log(button1);
       if(button1 == '暂停'){
           console.log('yes')
       }
       else {
           console.log('no')
       }
       var player = document.getElementsByClassName('video-list-item');        //NodeList对象是一个节点的集合,通常是由getElementsByClassName等方法返回的
       var playerArray = [].slice.call(player);                                //将NodeList对象转换成数组对象
       console.log(playerArray);
       console.log(Object.getOwnPropertyNames(playerArray.__proto__));
       console.log(playerArray.__proto__ === Array.prototype);                 //判断是否成功转换成数组，如果返回值为true则为数组，NodeList对象返回值会是false
       console.log(playerArray.length);
       for(var x = 0;x < player.length;x++){
           console.log(player[x]);
       }
       console.log(playerArray[0].getAttribute("aria-label"));
       if(document.getElementsByClassName('ytp-play-button') != null){
           console.log('this video played normal');
       }
       else{
           console.log('the video played exception');
       }
       console.log(page.content);
       */



