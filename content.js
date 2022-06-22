/**
 */

function getSelectionRange() {
  var sel = document.selection, range = null;
  var width = 0, height = 0, left = 0, top = 0;
  if (sel) {
    if (sel.type != "Control") {
      range = sel.createRange();
    }
  } else if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
    }
  }
  return range;
}

function getSelectionEndPosition() {

  var range = getSelectionRange();
  if (!range)
    return null;
  var sel = document.selection;
  var x = 0, y = 0;
  if (sel) {
    if (sel.type != "Control") {
    }
  } else if (window.getSelection) {

    var endNode = range.endContainer;
    var endRange = document.createRange();
    endRange.setStart(endNode, 0);
    endRange.setEnd(endNode, range.endOffset);
    var endRangeRect = endRange.getClientRects()[endRange.getClientRects().length - 1];
    var ebdRangeRect2;
    if (endRange.getClientRects().length > 1) {
      endRangeRect2 = endRange.getClientRects()[endRange.getClientRects().length - 2];
    }
    if (endRangeRect.left === endRangeRect.right && endRangeRect2) {
      x = endRangeRect2.right;
      y = endRangeRect2.bottom;
    } else {
      x = endRangeRect.right;
      y = endRangeRect.bottom;
    }
  }
  return { x: x, y: y };
}

function getSelectionDimensions() {
  var range = getSelectionRange();
  if (!range)
    return null;
  var sel = document.selection;
  var width = 0, height = 0, left = 0, top = 0;
  if (sel) {
    if (sel.type != "Control") {
      width = range.boundingWidth;
      height = range.boundingHeight;
      left = range.boundingLeft;
      top = range.boundingTop;
    }
  } else if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      if (range.getBoundingClientRect) {
        var rect = range.getBoundingClientRect();
        width = rect.right - rect.left;
        height = rect.bottom - rect.top;
        left = rect.left;
        top = rect.top;
      }
    }
  }
  return { width: width, height: height, left: left, top: top };
}


var body = document.getElementsByTagName("body")[0];
var g_bDisable = false;
var Options = null;
var last_frame = null;
var last_div = null;
var div_num = 0;
var xx, yy, sx, sy;
var list = new Array();
var last_time = 0;
var last_request_time = 0;


body.addEventListener("mouseup", OnSelectionEvent, false);
body.addEventListener("touchend", OnSelectionEvent, false);

var timer, prevC, prevO, prevWord, c;
var isAlpha = function (str) { return /[a-zA-Z']+/.test(str) };
var scr_flag = false;


function isEnglish(s) {
  for (var i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 126) {
      return false;
    }
  }
  return true;
}
// document.onkeydown = function (e) {

//   e = e || window.event;
//   var key = e.keyCode || e.which;
//   OnCheckCloseWindow();
// }
function isChinese(temp) {
  var re = /[^\u4e00-\u9fa5]/;
  if (re.test(temp)) return false;
  return true;
}
function isJapanese(temp) {
  var re = /[^\u0800-\u4e00]/;
  if (re.test(temp)) return false;
  return true;
}

function isKoera(chr) {

  if (((chr > 0x3130 && chr < 0x318F) ||
    (chr >= 0xAC00 && chr <= 0xD7A3))) {
    return true;
  }
  return false;
}
function isContainKoera(temp) {
  var cnt = 0;
  for (var i = 0; i < temp.length; i++) {
    if (isKoera(temp.charAt(i)))
      cnt++;
  }
  if (cnt > 0) return true;
  return false;
}
function isContainChinese(temp) {
  var cnt = 0;
  for (var i = 0; i < temp.length; i++) {
    if (isChinese(temp.charAt(i)))
      cnt++;
  }
  if (cnt > 5) return true;
  return false;
}
function isContainChinese2(temp) {
  var cnt = 0;
  for (var i = 0; i < temp.length; i++) {
    if (isChinese(temp.charAt(i)))
      cnt++;
  }
  if (cnt > 0 && temp.length <= 3) return true;
  return false;
}
function isContainJapanese(temp) {
  var cnt = 0;
  for (var i = 0; i < temp.length; i++) {
    if (isJapanese(temp.charAt(i)))
      cnt++;
  }
  if (cnt > 2) return true;
  return false;
}
function ExtractEnglish(word) {
  var patt1 = new RegExp(/([a-zA-Z ]+)/);

  var result = patt1.exec(word) ? patt1.exec(word)[1] : '';

  return result;
}
function spaceCount(temp) {
  var cnt = 0;
  for (var i = 0; i < temp.length; i++) {
    if (temp.charAt(i) == ' ')
      cnt++;
  }
  return cnt;
}


function OnSelectionEvent(e) {

  if (in_div) return;
  OnCheckCloseWindow();

  var word = String(window.getSelection());
  word = word.replace(/^\s*/, "").replace(/\s*$/, "");

  if (word == "") return;

  if (word.length > 2000)
    return;

  word = ExtractEnglish(word);

  if (word != '') {
    OnCheckCloseWindowForce();
    xx = e.pageX, yy = e.pageY, sx = e.screenX, sy = e.screenY;

    getPostAndAds(word);
    return;
  }
}

function OnCheckCloseWindow() {
  isDrag = false;
  if (in_div) return;
  if (last_frame != null) {
    var cur = Math.round(new Date().getTime());
    if (cur - last_time < 500) {
      return;
    }
    while (list.length != 0) {
      body.removeChild(list.pop());
    }
    last_frame = null;
    last_div = null;
    return true;
  }
  return false
}
function OnCheckCloseWindowForce() {
  in_div = false;
  if (last_frame != null) {
    var cur = Math.round(new Date().getTime());

    while (list.length != 0)
      body.removeChild(list.pop());

    last_frame = null;
    last_div = null;

    return true;
  }
  return false
}
function createPopUpEx(word, x, y, screenx, screeny) {
  OnCheckCloseWindowForce();
  if (window.getSelection() && window.getSelection().rangeCount > 0)
    createPopUp(word, window.getSelection().getRangeAt(0).startContainer.nodeValue, x, y, screenx, screeny)
}
var in_div = false;
function createPopUp(word, senctence, x, y, screenX, screenY) {
  last_word = word;

  var frame_height = 150;
  var frame_width = 300;
  var padding = 10;

  var frame_left = 0;
  var frame_top = 0;
  var frame = document.createElement('div');

  frame.id = 'dadWrapper';

  var screen_width = screen.availWidth;
  var screen_height = screen.availHeight;

  if (screenX + frame_width < screen_width) {

    frame_left = x;
  } else {
    frame_left = (x - frame_width - 2 * padding);
  }
  frame.style.left = frame_left + 'px';

  if (screenY + frame_height + 20 < screen_height) {
    frame_top = y;
  } else {
    frame_top = (y - frame_height - 2 * padding);
  }

  //var selection_rect = getSelectionDimensions();
  var selection_end_position = getSelectionEndPosition();

  if (getSelection().toString() == '') {
    OnCheckCloseWindowForce();
    return;
  }

  frame.style.top = (selection_end_position.y + window.scrollY) + 'px';
  frame.style.left = (selection_end_position.x + window.scrollX) + 'px';
  frame.style.position = 'absolute';
  frame.style.zIndex = 2147483648;

  if (frame.style.left + frame_width > screen_width) {
    frame.style.left -= frame.style.left + frame_width - screen_width;
  }
  frame.innerHTML += word;
  frame.onmouseover = function (e) { in_div = true; };
  frame.onmouseout = function (e) { in_div = false; };
  body.style.position = "static";
  body.appendChild(frame);
  // document.getElementById("test").onclick = function (e) { OnCheckCloseWindowForce(); };
  // document.getElementById("test").onmousemove = function (e) { frame.style.cursor = 'default'; };
  document.getElementById("dadTop").onmousedown = dragDown;
  document.getElementById("dadTop").onmouseup = dragUp;
  document.getElementById("dadTop").onmousemove = dragMove;
  document.getElementById("dadTop").onmouseover = function (e) { frame.style.cursor = 'move'; };
  document.getElementById("dadTop").onmouseout = function (e) { frame.style.cursor = 'default'; };


  list.push(frame);
  var leftbottom = frame_top + 10 + document.getElementById("dadWrapper").clientHeight;

  if (leftbottom < y) {
    var newtop = y - document.getElementById("dadWrapper").clientHeight;
    frame.style.top = newtop + 'px';
  }
  if (last_frame != null) {
    if (last_frame.style.top == frame.style.top && last_frame.style.left == frame.style.left) {
      body.removeChild(frame);
      list.pop();
      return;
    }
  }
  last_time = Math.round(new Date().getTime());
  last_frame = frame;
  div_num++;

  if (frame.getBoundingClientRect().bottom > body.getBoundingClientRect().height &&
    frame.getBoundingClientRect().height < body.getBoundingClientRect().height &&
    frame.getBoundingClientRect().bottom > body.scrollHeight) {
    // frame.style.top = 'auto';
    frame.style.bottom = 0;
  }
  if (frame.getBoundingClientRect().right > body.getBoundingClientRect().width &&
    frame.getBoundingClientRect().width < body.getBoundingClientRect().width &&
    frame.getBoundingClientRect().right > body.scrollWidth) {
    // frame.style.left = 'auto';
    frame.style.right = 0;
  }
  if (frame.getBoundingClientRect().bottom > window.innerHeight) {
    // frame.style.top = 'auto';
    frame.style.bottom = (-body.scrollTop) + 'px';
  }
  if (frame.getBoundingClientRect().right > window.innerWidth) {
    frame.style.left = 'auto';
    frame.style.right = (-body.scrollLeft) + 'px';
  }
}


var isDrag = false;
var px = 0;
var py = 0;

function dragMove(e) {
  if (!last_frame)
    return;
  if (isDrag) {
    var myDragDiv = last_frame;
    myDragDiv.style.pixelLeft = px + e.x;
    myDragDiv.style.pixelTop = py + e.y;
  }
}
function dragDown(e) {
  var oDiv = last_frame;
  if (!last_frame)
    return;

  px = oDiv.style.pixelLeft - e.x;
  py = oDiv.style.pixelTop - e.y;
  isDrag = true;
}
function dragUp(e) {
  if (!last_frame)
    return;
  var oDiv = last_frame;

  isDrag = false;
}
function onText(data) {

  createPopUpEx(data, xx, yy, sx, sy);
}
function getPostAndAds(word) {
  chrome.runtime.sendMessage({
    'word': word
  }, function (data) {
    // if(typeof(data) != "undefined"){
    // alert(data)
    onText(data);
    // }
  });
}


