
var body = document.body;
var canvas = document.getElementById("canvas");
canvas.addEventListener("mousemove", getMovePosition, false);
var ctx = canvas.getContext("2d");
var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;
canvas.style.marginLeft = window.innerWidth/2 - width/2;
canvas.style.marginTop = window.innerHeight/2 - height/2;
var imagedata = ctx.createImageData(width, height);
var camera = {x: 0, y: 0};
var lastClientX, lastClientY = 0;
var freq = 100; var res = 1;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
var statsDiv = document.body.appendChild(stats.dom);

statsDiv.style.marginLeft = window.innerWidth/2 - width/2;
statsDiv.style.marginTop = window.innerHeight/2 - height/2;

var seed1 = Math.random() * 65536;
var seed2 = Math.random() * 65536;
var simplex = new SimplexNoise(seed1);
var simplex2 = new SimplexNoise(seed2);

function windowResize() {
    statsDiv.style.marginLeft = window.innerWidth/2 - width/2;
    statsDiv.style.marginTop = window.innerHeight/2 - height/2;
    canvas.style.marginLeft = window.innerWidth/2 - width/2;
    canvas.style.marginTop = window.innerHeight/2 - height/2;
}

function resizeCanv(val) {
    width = height = canvas.width = canvas.height = val;
    statsDiv.style.marginLeft = window.innerWidth/2 - width/2;
    statsDiv.style.marginTop = window.innerHeight/2 - height/2;
    canvas.style.marginLeft = window.innerWidth/2 - width/2;
    canvas.style.marginTop = window.innerHeight/2 - height/2;
    imagedata = ctx.createImageData(width, height);
    if(width < 500) {
        return res = 1;
    } else if(width < 800) {
        return res = 2;
    } else {
        return res = 4;
    }
    return;
}

canvas.addEventListener('wheel', function(e){
    freq += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * 20;
    if(freq <= 10){freq = 10;return false}
    return false; 
}, false);
canvas.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

function mouseUp() {
    window.removeEventListener('mousemove', cameraMove, true);
    canvas.style.cursor = "grab";
    lastClientX = lastClientY = 0;
}

function mouseDown(e) {
    canvas.style.cursor = "grabbing";
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    window.addEventListener('mousemove', cameraMove, true);
}

function cameraMove(e) {
    camera.x += (lastClientX - e.clientX) / freq;
    camera.y += (lastClientY - e.clientY) / freq;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
}

function biomeTest(e, m) {
    if (e < 0.12) return "WATER";
    if (e < 0.2) return "BEACH";
    if (e > 0.7) {
        if (m < 0.1) return "SCORCHED";
        if (m < 0.2) return "BARE";
        if (m < 0.5) return "TUNDRA";
        return "SNOW";
    }
    if (e > 0.5) {
        if (m < 0.33) return "TEMPERATE_DESERT";
        if (m < 0.66) return "SHRUBLAND";
        return "TAIGA";
    }
    if (e > 0.3) {
        if (m < 0.16) return "TEMPERATE_DESERT";
        if (m < 0.50) return "GRASSLAND";
        if (m < 0.83) return "TEMPERATE_DECIDUOUS_FOREST";
        return "TEMPERATE_RAIN_FOREST";
    }
    if (m < 0.16) return "SUBTROPICAL_DESERT";
    if (m < 0.33) return "GRASSLAND";
    if (m < 0.66) return "TROPICAL_SEASONAL_FOREST";
    return "TROPICAL_RAIN_FOREST";
}

function getMovePosition(e) {
    let nx = e.clientX - width/2 - parseInt(canvas.style.marginLeft);
    let ny = e.clientY - height/2 - parseInt(canvas.style.marginTop);
    let biome = getBiome(camera, nx, ny, freq);
    let elevation = Math.abs(getNoise1(camera, nx, ny, freq));
    document.getElementById("biome-display").innerHTML = biome;
    document.getElementById("elevation-display").innerHTML = Math.round(elevation * 256) + " units tall - ";
}

function getBiome(camera, x, y, freq) {
    var el = Math.abs(getNoise1(camera, x, y, freq));
    var mo = Math.abs(getNoise2(camera, x, y, freq));
    var biome = biomeTest(el, mo);
    return biome;
}

function getNoise1(cam, x, y, freq) {
    return 1*simplex.noise2D(1*(cam.x + x / freq), 1*(cam.y + y / freq)); + 
           0.5*simplex.noise2D(2*(cam.x + x / freq), 2*(cam.y + y / freq)) +
           0.25*simplex.noise2D(4*(cam.x + x / freq), 2*(cam.y + y / freq));
}
function getNoise2(cam, x, y, freq) {
    return simplex2.noise2D(cam.x + x / freq, cam.y + y / freq);
}

function generation() {
    stats.begin();
    let index = 0;
    for (let y = 0; y < height; y += res) {
        for (let x = 0; x < width; x += res) {
            let biome = getBiome(camera, x - width/2, y - height/2, freq);
            switch(biome) {
                case "BEACH": color = [194, 178, 128];break;                   //rgb(194, 178, 128)
                case "SCORCHED": color = [204, 85, 0];break;                   //rgb(204, 85, 0)
                case "BARE": color = [128, 0, 0];break;                        //rgb(128, 0, 0)
                case "TUNDRA": color = [118,101,101];break;                    //rgb(118, 101, 101)
                case "SNOW": color = [255,250,250];break;                      //rgb(255, 250, 250)
                case "TEMPERATE_DESERT": color = [194, 178, 128];break;        //rgb(192, 147, 128)
                case "SHRUBLAND": color = [83, 49, 24];break;                  //rgb(83, 49, 24)
                case "TAIGA": color = [45,74,47];break;                        //rgb(45, 74, 47)
                case "GRASSLAND": color = [96, 128, 56];break;                 //rgb(96, 128, 56)
                case "TEMPERATE_DECIDUOUS_FOREST": color = [34, 139, 34];break;//rgb(34, 139, 34)
                case "TEMPERATE_RAIN_FOREST": color = [32, 64, 32];break;      //rgb(32, 64, 32)
                case "SUBTROPICAL_DESERT": color = [237,201,175];break;        //rgb(237, 201, 175)
                case "TROPICAL_SEASONAL_FOREST": color = [0, 200, 20];break;   //rgb(0, 200, 20)
                case "TROPICAL_RAIN_FOREST": color = [0, 117, 94];break;       //rgb(0, 117, 94)
                case "WATER": color = [0, 0, 255];break;                       //rgb(0, 0, 255)

                default: color = [255, 20, 147]; // Unknown                    //rgb(255, 20, 147)
            }

            if(res !== 1) {
                for(h=0;h<res;h++) {
                    for(w=0;w<res;w++) {
                        index = ((x + w) + ((y + h) * width)) * 4;
                        imagedata.data[index++] = color[0];
                        imagedata.data[index++] = color[1];
                        imagedata.data[index++] = color[2];
                        imagedata.data[index++] = 255;
                    }
                }
            } else {
                imagedata.data[index++] = color[0];
                imagedata.data[index++] = color[1];
                imagedata.data[index++] = color[2];
                imagedata.data[index++] = 255;
            }
        }
    }
    stats.end();
    ctx.putImageData(imagedata, 0, 0);
    requestAnimationFrame(generation);
}
generation();