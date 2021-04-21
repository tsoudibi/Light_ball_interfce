var wCanvas;
var wContext;
var tCanvas;
var tContext;
var canvas;
var mplayer;
var canvasDisplayDensity = 20;
var startLine;
var endLine;
var waver;

window.onload = function () {
    waver = document.getElementById("waveform");
    ShowVoice();
    // wCanvas = document.getElementById("wCanvas");
    // tCanvas = document.getElementById("tCanvas");
    // canvas = document.getElementById("canvas");
    // wContext = wCanvas.getContext("2d");
    // tContext = tCanvas.getContext("2d");
    // mplayer = document.getElementById("musicPlayer");

    // tCanvas.onmousedown = tCanvasClick;
    // tCanvas.onmousemove = tCanvasDrag;
    // tCanvas.onmouseup = tCanvasStopDrag;
    // tCanvas.onmouseout = tCanvasStopDrag;

    // wCanvas.onmousedown = wCanvasClick;
    // wCanvas.onmousemove = wCanvasDrag;
    // wCanvas.onmouseup = wCanvasStopDrag;
    // wCanvas.onmouseout = wCanvasStopDrag;

    // wCanvas.onmousewheel = function (e) {
    //     if (e.wheelDelta <= -120) {
    //         canvas.scrollLeft += 100;
    //     }
    //     if (e.wheelDelta >= 120) {
    //         canvas.scrollLeft -= 100;
    //     }
    // };

    waver.onmousewheel = function (e) {
        if (e.wheelDelta <= -120) {
            zoom_out()
        }
        if (e.wheelDelta >= 120) {
            zoom_in();
        }
    };

    // mplayer.oncanplaythrough = function () {
    //     initWaverCanvas();
    // };

    this.document.addEventListener("keydown", this.buttonEvent);

    // setInterval("displayTime()", 1);

    // mplayer.src = "upload/music.mp3";

    // this.initWaverCanvas();
};

function buttonEvent(e) {
    switch (e.keyCode) {
        case 32:
            playMusic();
            // if (isPlaying) {
            //     pauseMusic();
            // } else {
            //     playMusic();
            // }
            break;
        case 37:
            // wavesurfer.skip(-10);
            playBackward();
            break;
        case 38:
            // mplayer.volume += 0.2;
            break;
        case 39:
            wavesurfer.skip(10);
            playForward();
            break;
        case 40:
            // mplayer.volume -= 0.2;
            break;
        case 48:
            // mplayer.playbackRate = 1;
            break;
        case 83:
            // wavesurfer.stop();
            stopMusic();
            break;
        case 96:
            // mplayer.playbackRate = 1;
            break;
        case 188:
            // playSlow();
            break;
        case 190:
            // playFast();
            break;
        case 65:
            // mplayer.src = "example.mp3";//a
            // mplayer.load();
            break;
        case 81:
            // mplayer.src = "upload/music.mp3";//q
            // mplayer.load();
            break;
        default:
            var t = document.getElementById("test");
            t.innerHTML = e.keyCode;
            break;
    }
}



//#region music player 
var isPlaying = false;
function playMusic() {
    wavesurfer.playPause();
    // isPlaying = true;
    // mplayer.play();
    var element = document.getElementById("playandpause");
    if (isPlaying) {
        element.classList.remove("fa-pause");
        element.classList.add("fa-play");
        element.title = "播放";
        isPlaying = false;
    } else {
        element.classList.remove("fa-play");
        element.classList.add("fa-pause");
        element.title = "暫停";
        isPlaying = true;
    }

    // element.onclick = pauseMusic;
}

// function pauseMusic() {
//     isPlaying = false;
//     mplayer.pause();
//     var element = document.getElementById("playandpause");
//     element.classList.remove("fa-pause");
//     element.classList.add("fa-play");
//     element.onclick = playMusic;
// }

function stopMusic() {
    wavesurfer.stop();
    // mplayer.currentTime = 0;
}

function playForward() {
    wavesurfer.skip(10);
    // mplayer.currentTime += 5;
}

function playBackward() {
    wavesurfer.skip(-10);
}

function playFast() {
    mplayer.playbackRate += 0.5;
}

function playSlow() {
    mplayer.playbackRate -= 0.5;
}

function changeVolume() {
    if (mplayer.volume >= 1) {
        mplayer.volume = 0;
    } else {
        mplayer.volume += 0.2;
    }
}

function displayTime() {
    var timer = document.getElementById("time");

    var second = mplayer.currentTime.toFixed(2);

    timer.innerHTML = second;

    updateTimeCanvas(second);
}

//#endregion

//#region Canvas
function Line(x, y1, y2, color) {
    this.x = x;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
}
var lines = [];

function initWaverCanvas() {
    wCanvas.width = mplayer.duration * canvasDisplayDensity;
    tCanvas.width = wCanvas.width;
    addWave();
    initTimeCanvas();
}

function initTimeCanvas() {
    tContext.beginPath();
    tContext.strokeStyle = "white";
    tContext.moveTo(-10, 0);
    tContext.lineTo(10, 0);
    tContext.lineTo(0, 10);
    tContext.lineTo(-10, 0);
    tContext.fillStyle = "white";
    tContext.fill();
    tContext.closePath();
    tContext.stroke();
}

function addWave() {
    for (var i = 0; i < wCanvas.width / 5; i++) {
        wContext.beginPath();
        wContext.strokeStyle = "white";
        var x = i * 5;
        wContext.moveTo(x, i / wCanvas.height * canvasDisplayDensity);
        wContext.lineTo(x, 0);
        wContext.stroke();
        var wave = new Line(x, i / wCanvas.height * canvasDisplayDensity, 0, "white");
        lines.push(wave);
    }
}

function wCanvasClick(e) {
    var clickX = e.offsetX;
    addStartLine(clickX);
    wCanDrag = true;
}

var wCanDrag = false;
function wCanvasDrag(e) {
    if (!wCanDrag) {
        return;
    }
    addEndLine(e.offsetX);
}

function wCanvasStopDrag() {
    if (startLine.x > endLine.x) {
        var startx = endLine.x;
        var endx = startLine.x;
        startLine.x = startx;
        endLine.x = endx;
    }
    wCanDrag = false;
}

function updateWCanvas() {
    wContext.clearRect(0, 0, wCanvas.width, wCanvas.height);

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        wContext.beginPath();
        wContext.strokeStyle = line.color;
        wContext.lineWidth = 1;
        wContext.globalAlpha = 0.85;
        wContext.moveTo(line.x, line.y1);
        wContext.lineTo(line.x, line.y2);
        wContext.closePath();
        wContext.stroke();
    }

    if (startLine != null && endLine != null) {
        wContext.globalAlpha = 0.2;
        wContext.fillStyle = "red";
        wContext.fillRect(startLine.x, 0, endLine.x - startLine.x, wCanvas.height);
    }
}

function addStartLine(clickX) {
    var pos = clickX / wCanvas.width;
    var time = (pos * mplayer.duration).toFixed(2);
    document.getElementById("selecttime").innerHTML = time;

    if (startLine != null) {
        lines.pop();
        startLine = null;
    }

    if (endLine != null) {
        lines.pop();
        endLine = null;
    }

    startLine = new Line(clickX, wCanvas.height, 0, "red");
    lines.push(startLine);

    updateWCanvas();
}

function addEndLine(clickX) {
    var pos = clickX / wCanvas.width;
    var time = (pos * mplayer.duration).toFixed(2);

    console.log(clickX);

    if (endLine != null) {
        lines.pop();
        endLine = null;
    }

    endLine = new Line(clickX, wCanvas.height, 0, "red");
    lines.push(endLine);

    updateWCanvas();
}


var canDrag = false;
function tCanvasClick(e) {
    canDrag = true;
    tCanvasDrag(e);
}

function tCanvasDrag(e) {
    if (!canDrag) {
        return;
    }
    var pos = e.offsetX / wCanvas.width;

    var time = (pos * mplayer.duration).toFixed(2);

    mplayer.currentTime = time;

    updateTimeCanvas(time);
}

function tCanvasStopDrag(e) {
    canDrag = false
}

function updateTimeCanvas(time) {
    tContext.clearRect(0, 0, tCanvas.width, tCanvas.height);

    tContext.beginPath();

    tContext.strokeStyle = "white";
    var centerpos = time * canvasDisplayDensity;
    tContext.moveTo(centerpos - 10, 0);
    tContext.lineTo(centerpos + 10, 0);
    tContext.lineTo(centerpos, 10);
    tContext.lineTo(centerpos - 10, 0);
    tContext.fillStyle = "white";
    tContext.fill();

    tContext.closePath();

    tContext.stroke();
}

function canvasPositionToTime(x) {
    var pos = x / wCanvas.width;
    return (pos * mplayer.duration).toFixed(2);
}


//#endregion

//#region Effect

function Effect(type, start, end) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.color = "#ffffff";
}

var effectList = [];

var selectedEffectId;
var effectType;
function selectEffect(id, type) {
    if (selectedEffectId != id) {
        if (selectedEffectId != null) {
            selectedEffectId.style.color = "black";
        }
        id.style.color = "white";
        selectedEffectId = id;
        effectType = type;
    } else {
        selectedEffectId = null;
        effectType = null;
        id.style.color = "black";
    }
}

function addEffect() {
    if (selectedEffectId == null) {
        return;
    }
    var list = document.getElementById("effect-list");
    var li = document.createElement("li");
    list.appendChild(li);

    var effect;
    if (startLine && endLine) {
        effect = new Effect(effectType, canvasPositionToTime(startLine.x), canvasPositionToTime(endLine.x));
    } else if (startLine) {
        effect = new Effect(effectType, canvasPositionToTime(startLine.x), canvasPositionToTime(startLine.x));
    } else {
        effect = new Effect(effectType, mplayer.currentTime.toFixed(2), mplayer.currentTime.toFixed(2));
    }

    li.innerHTML = "Type:" + effect.type + " Start:" + effect.start + " End: " + effect.end;

    li.onclick = function () {
        getEffectSetting(li, effect);
    };

    effectList.push(effect);
}

var currentEffect;
var currentlist;
function getEffectSetting(e, effect) {
    currentEffect = effect;
    currentlist = e;
    var type = document.getElementById("effecttype");
    var start = document.getElementById("effectstart");
    var end = document.getElementById("effectend");
    var color = document.getElementById("effectcolor");

    setInputEvent();

    type.firstChild.value = effect.type;
    start.firstChild.value = effect.start;
    end.firstChild.value = effect.end;
    color.firstChild.value = effect.color;
}

function setInputEvent() {
    var itype = document.getElementById("typeinput");
    var istart = document.getElementById("startinput");
    var iend = document.getElementById("endinput");
    var icolor = document.getElementById("colorinput");

    itype.onblur = updateType;
    istart.onblur = updateStart;
    iend.onblur = updateEnd;
    icolor.onblur = updateColor;
}


function updateType() {
    var e = document.getElementById("typeinput");
    currentEffect.type = e.value;
    currentlist.innerHTML = "Type:" + currentEffect.type + " Start:" + currentEffect.start + " End: " + currentEffect.end;
}

function updateStart() {
    var e = document.getElementById("startinput");
    currentEffect.start = e.value;
    currentlist.innerHTML = "Type:" + currentEffect.type + " Start:" + currentEffect.start + " End: " + currentEffect.end;
}

function updateEnd() {
    var e = document.getElementById("endinput");
    currentEffect.end = e.value;
    currentlist.innerHTML = "Type:" + currentEffect.type + " Start:" + currentEffect.start + " End: " + currentEffect.end;
}

function updateColor() {
    var e = document.getElementById("colorinput");
    currentEffect.color = e.value;
    currentlist.innerHTML = "Type:" + currentEffect.type + " Start:" + currentEffect.start + " End: " + currentEffect.end;
}

function instansiatateFile() {
    var file;
    file = "{";
    for (var i = 0; i < effectList.length; i++) {
        var e = effectList[i];
        var f = "{" + e.type + ", " + e.start + ", " + e.end + "},";
        file += f;
    }
    file = file.substring(0, file.length - 1);
    file += "}";
    return file
}

function downloadFile() {
    var _text = instansiatateFile()
    var _fileName = "LightBall";
    var textFileAsBlob = new Blob([_text], { type: 'text/plain' });

    var downloadLink = document.createElement("a");
    downloadLink.download = _fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

//#endregion

