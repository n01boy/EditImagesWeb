// canvas related variables
var image_canvas = document.getElementById("image_canvas");
var text_canvas = document.getElementById("text_canvas");
var image_ctx = image_canvas.getContext("2d");
var text_ctx = text_canvas.getContext("2d");
image_ctx.beginPath();

// variables used to get mouse position on the canvas
$text_canvas = $('#text_canvas');
var canvasOffset = $text_canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $text_canvas.scrollLeft();
var scrollY = $text_canvas.scrollTop();

// variables to save last mouse position
// used to see how far the user dragged the mouse
// and then move the text by that distance
var startX;
var startY;

// an array to hold text objects
var texts = [];

// this var will hold the index of the hit-selected text
var selectedText = -1;
var editText = 0;

/** 描画モードの切り替え */
var editMode = 1; //  0: テキスト選択 / 1: ペン
$('input[name=editMode]').on('click', function(ev) {
    editMode = parseInt($(ev.currentTarget).val());
})

// paint color
var paintColor = '#580e7c';
var paintSize = 5;
var paintAlpha = 1.0;

function changeSize(value) {
    paintSize = value;
    $('#size-display').html(value);
};

function changeAlpha(value) {
    paintAlpha = parseInt(value) / 100;
    $('#alpha-display').html(value + '%');
};

/** 現在のポジションを取得する */
function cursorPositionX(ev) {
    if (ev.pageX) {
        return ev.pageX;
    } else if (ev.clientX) {
        return ev.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
    } else {
        return null;
    }
}

/** 現在のポジションを取得する */
function cursorPositionY(ev) {
    if (ev.pageY) {
        return ev.pageY;
    } else if (ev.clientY) {
        return ev.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
    } else {
        return null;
    }
}

/** 右クリック時の起動メニュー */
$('.canvas-box').on('contextmenu', function(ev) {
    if (editMode == 1) {
        return false;
    }
    // Put your mousedown stuff here
    startX = parseInt(ev.clientX - offsetX);
    startY = parseInt(ev.clientY - offsetY);
    for (var i = 0; i < texts.length; i++) {
        if (textHittest(startX, startY, i)) {
            editText = i;
        }
    }
    if (editText == -1) {
        hideRMenu();
        return false;
    }
    $rmenu = $('#rmenu');
    $rmenu.addClass("show-rmenu");
    $rmenu.removeClass("hide-rmenu");
    $rmenu.css('top', cursorPositionY(ev));
    $rmenu.css('left', cursorPositionY(ev));
    ev.preventDefault();
});

$('body').on('click', function() {
    hideRMenu();
})

/** テキスト削除 */
function deleteText() {
    texts.splice(editText, 1);
    draw();
}

/** メニュー閉じる */
function hideRMenu() {
    $rmenu = $('#rmenu');
    $rmenu.removeClass("show-rmenu");
    $rmenu.addClass("hide-rmenu");
}

// clear the canvas & redraw all texts
function draw() {
    text_ctx.clearRect(0, 0, text_canvas.width, text_canvas.height);
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        text_ctx.fillText(text.text, text.x, text.y);
    }
}

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, textIndex) {
    var text = texts[textIndex];
    return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text


function textDown(ev) {
    ev.preventDefault();
    startX = parseInt(ev.clientX - offsetX);
    startY = parseInt(ev.clientY - offsetY);
    // Put your mousedown stuff here
    for (var i = 0; i < texts.length; i++) {
        if (textHittest(startX, startY, i)) {
            selectedText = i;
        }
    }
}

// done dragging
function handleMouseUp(ev) {
    ev.preventDefault();
    selectedText = -1;
    paintEnd(ev);
}

// also done dragging
function handleMouseOut(ev) {
    ev.preventDefault();
    selectedText = -1;
    paintEnd(ev);
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance

function paintMove(ev) {
    if (editMode == 0) {
        return false;
    }
    if (ev.buttons === 1 || ev.witch === 1) {
        var rect = ev.target.getBoundingClientRect();
        var X = ~~(ev.clientX - rect.left);
        var Y = ~~(ev.clientY - rect.top);
        //draw 関数にマウスの位置を渡す
        paint(X, Y);
    };
}
//マウス継続値の初期値、ここがポイント
var mouseX = "";
var mouseY = "";
//渡されたマウス位置を元に直線を描く関数
function paint(X, Y) {
    image_ctx.beginPath();
    image_ctx.globalAlpha = paintAlpha;
    //マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
    if (mouseX === "") {
        //継続値が初期値の場合は、現在のマウス位置をスタート位置とする
        image_ctx.moveTo(X, Y);
    } else {
        //継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
        image_ctx.moveTo(mouseX, mouseY);
    }
    //lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
    image_ctx.lineTo(X, Y);
    //直線の角を「丸」、サイズと色を決める
    image_ctx.lineCap = "round";
    image_ctx.lineWidth = paintSize * 2;
    image_ctx.strokeStyle = paintColor;
    image_ctx.stroke();
    //マウス継続値に現在のマウス位置、つまりゴール位置を代入
    mouseX = X;
    mouseY = Y;
};



//左クリック終了、またはマウスが領域から外れた際、継続値を初期値に戻す
function paintEnd() {
    mouseX = "";
    mouseY = "";
}

function textMove(e) {
    if (selectedText < 0) {
        return;
    }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var text = texts[selectedText];
    text.x += dx;
    text.y += dy;
    draw();
}

// listen for mouse events
$("#text_canvas").mousedown(function(ev) {
    if (editMode == 0) {
        textDown(ev);
    } else {
        // paintMove(ev);
    }
});
$("#text_canvas").mousemove(function(ev) {
    if (editMode == 0) {
        textMove(ev);
    } else {
        paintMove(ev);
    }
});
$("#text_canvas").mouseup(function(ev) {
    handleMouseUp(ev);
});
$("#text_canvas").mouseout(function(ev) {
    handleMouseOut(ev);
});

$("#submit").click(function() {

    // calc the y coordinate for this text on the canvas
    var y = texts.length * 20 + 20;

    // get the text from the input element
    var text = {
        text: $("#theText").val(),
        x: 20,
        y: y
    };

    // calc the size of this text for hit-testing purposes
    text_ctx.font = "16px verdana";
    text.width = text_ctx.measureText(text.text).width;
    text.height = 16;

    // put this new text in the texts array
    texts.push(text);

    // redraw everything
    draw();

    // 文字入力されたら文字編集モードに
    editMode = 0;
    document.getElementById('editMode0').parentNode.MaterialRadio.check();
});

var image = new Image();
$('form').on('change', 'input[type="file"]', function(e) {
    var file = e.target.files[0],
        reader = new FileReader(),
        t = this;

    // 画像ファイル以外の場合は何もしない
    if (file.type.indexOf("image") < 0) {
        return false;
    }

    var reader = new FileReader();

    // File APIを使用し、ローカルファイルを読み込む
    reader.onload = function(ev) {
        // 画像がloadされた後に、canvasに描画する
        image.onload = function() {
            image_canvas.width = image.width;
            image_canvas.height = image.height;
            text_canvas.width = image.width;
            text_canvas.height = image.height;
            $('.canvas-box').css('width', image.width);
            $('.canvas-box').css('height', image.height);
            image_ctx.drawImage(image, 0, 0);
        }
        // 画像のURLをソースに設定
        image.src = ev.target.result;
    }

    // ファイルを読み込み、データをBase64でエンコードされたデータURLにして返す
    reader.readAsDataURL(file);
});
