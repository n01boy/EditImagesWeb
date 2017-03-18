var colorhex = "#FF0000";
var color = "#FF0000";
var colorObj = w3color(color);

function mouseOverColor(hex) {
    document.getElementById("divpreview").style.visibility = "visible";
    document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer";
}

function mouseOutMap() {
    if (hh == 0) {
        document.getElementById("divpreview").style.visibility = "hidden";
    } else {
        hh = 0;
    }
    document.getElementById("divpreview").style.backgroundColor = colorObj.toHexString();
    document.body.style.cursor = "";
}
var hh = 0;

function clickColor(hex, seltop, selleft, html5) {
    var c, cObj, colormap, areas, i, areacolor, cc;
    if (html5 && html5 == 5) {
        c = document.getElementById("html5colorpicker").value;
    } else {
        if (hex == 0) {
            c = document.getElementById("entercolor").value;
        } else {
            c = hex;
        }
    }
    cObj = w3color(c);
    colorhex = cObj.toHexString();
    console.log(colorhex);
    $('#paintColorBox').css('color', colorhex);
    paintColor = colorhex;
}
