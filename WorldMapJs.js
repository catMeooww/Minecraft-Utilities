var mapThings = [];
var mapHeight = "all";

var isMobile;

var selectedImg = "biome";
var selectedHeight = "surface";

function preload() {
    biome = loadImage("others/mapAssets/biome.png");
    chest = loadImage("others/mapAssets/chest.png");
    creeper = loadImage("others/mapAssets/Creeper.png");
    grass = loadImage("others/mapAssets/grass.png");
    house = loadImage("others/mapAssets/House.png");
    island = loadImage("others/mapAssets/Island.png");
    pickaxe = loadImage("others/mapAssets/Pickaxe.png");
    portal = loadImage("others/mapAssets/portal.png");
    redstone = loadImage("others/mapAssets/redstone.png");
    sword = loadImage("others/mapAssets/sword.png");
    temple = loadImage("others/mapAssets/Temple.png");

    MCFont = loadFont("Minecraft.ttf")
}

function setup() {


    isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent)
    if (isMobile) {
        canvas = createCanvas(windowWidth - 330, 300);
        canvas.parent(document.getElementById("canvas-handler"));
    } else {
        canvas = createCanvas(windowWidth - 450, windowHeight - 160);
        canvas.parent(document.getElementById("canvas-handler"));
    }
}

function draw() {
    textFont(MCFont);
    fill("black");

    if (mapHeight == "surface") {
        background("lime");
    } else if (mapHeight == "sky") {
        background("cyan");
    } else if (mapHeight == "underground") {
        background("grey");
    } else {
        background("white");
    }

    for (m = 0; m < mapThings.length; m++) {
        if (mapHeight == "all" || mapHeight == mapThings[m][2]) {

            text(mapThings[m][0], mapThings[m][3] - 10, mapThings[m][4]);
            thisImg = mapThings[m][1];
            if (thisImg == "biome") {
                image(biome, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "chest") {
                image(chest, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "creeper") {
                image(creeper, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "grass") {
                image(grass, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "house") {
                image(house, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "island") {
                image(island, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "pickaxe") {
                image(pickaxe, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "portal") {
                image(portal, mapThings[m][3], mapThings[m][4] + 5, 25, 35);
            } else if (thisImg == "redstone") {
                image(redstone, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "sword") {
                image(sword, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            } else if (thisImg == "temple") {
                image(temple, mapThings[m][3], mapThings[m][4] + 5, 35, 35);
            }
            text("X: " + String(mapThings[m][3]) + " Z: " + String(mapThings[m][4]), mapThings[m][3] - 10, (mapThings[m][4] + 55));
        }
    }

    if (isMobile) {
        fill("red");
        textSize(20);
        text("You need a computer to use World Map", camera.position.x - 200, camera.position.y);
    }

    //camera
    fill("blue");
    text("X: " + camera.position.x + " Z: " + camera.position.y, camera.position.x - 450, camera.position.y - 210);
}

function mouseClicked() {
    if (!isMobile) {
        if (mouseX < 50 && mouseX != 0) {
            camera.position.x = camera.position.x - 10;
        }
        if (mouseX > windowWidth - 490 && mouseX != 0) {
            camera.position.x = camera.position.x + 10;
        }
        if (mouseY < 50 && mouseY != 0) {
            camera.position.y = camera.position.y - 10;
        }
        if (mouseY > windowHeight - 210 && mouseY != 0) {
            camera.position.y = camera.position.y + 10;
        }
    }
}

function opensender() {
    document.getElementById("sendingmap").style.visibility = "visible";
}
function closesender() {
    document.getElementById("sendingmap").style.visibility = "hidden";
}

function Heightmap(h) {
    if (h == 0) {
        mapHeight = "all";
        document.getElementById("defaultCanvas0").style.borderColor = "gray";
    } else if (h == 1) {
        mapHeight = "sky";
        document.getElementById("defaultCanvas0").style.borderColor = "blue";
    } else if (h == 2) {
        mapHeight = "surface";
        document.getElementById("defaultCanvas0").style.borderColor = "green";
    } else if (h == 3) {
        mapHeight = "underground";
        document.getElementById("defaultCanvas0").style.borderColor = "black";
    }
    document.getElementById("HeightP").innerHTML = mapHeight;
}

function getMapData() {
    firebase.database().ref("/" + worldName + "/map").on('value', function (snapshot) {
        document.getElementById("map_output").innerHTML = "<h3 id='mapListHeader'>Map Elements</h3>";
        mapThings = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            firebaseMessageId = childKey;
            mapData = childData;

            thingName = mapData['thing'];
            thingImage = mapData['image'];
            thingHeight = mapData['height'];
            thingX = mapData['x'];
            thingY = mapData['y'];

            mapThings.push([
                featureName = thingName,
                featureImage = thingImage,
                featureHeight = thingHeight,
                featureX = thingX,
                featureY = thingY
            ]);

            console.log(mapThings);

            addInList(thingName, thingImage, thingHeight, thingX, thingY);
        });
    });
}

function sendmap() {
    msg = document.getElementById("newFeature").value;
    sendX = Number(document.getElementById("send-x").value);
    sendZ = Number(document.getElementById("send-z").value);
    if (!msg == "") {
        document.getElementById("newFeature").value = "";
        firebase.database().ref(worldName + "/map").push({
            thing: msg,
            image: selectedImg,
            height: selectedHeight,
            x: sendX,
            y: sendZ
        });

        camera.position.x = sendX;
        camera.position.y = sendZ;
        closesender();
    }
}

function heightsend(n) {
    if (n == 1) {
        selectedHeight = "surface";
    } else if (n == 2) {
        selectedHeight = "sky";
    } else if (n == 3) {
        selectedHeight = "underground";
    }
    document.getElementById("heightToSend").innerHTML = selectedHeight;
}

function sendicon(n) {
    if (n == 1) {
        selectedImg = "biome";
    } else if (n == 2) {
        selectedImg = "chest";
    } else if (n == 3) {
        selectedImg = "creeper";
    } else if (n == 4) {
        selectedImg = "grass";
    } else if (n == 5) {
        selectedImg = "house";
    } else if (n == 6) {
        selectedImg = "island";
    } else if (n == 7) {
        selectedImg = "pickaxe";
    } else if (n == 8) {
        selectedImg = "portal";
    } else if (n == 9) {
        selectedImg = "redstone";
    } else if (n == 10) {
        selectedImg = "sword";
    } else if (n == 11) {
        selectedImg = "temple";
    }
    document.getElementById("iconToSend").innerHTML = selectedImg;
}

function addInList(n, i, h, px, pz) {
    elementH3 = "<h3 class='mapListText'>" + n + "</h3>"
    if (i == "biome") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/biome.png'>";
    } else if (i == "chest") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/chest.png'>";
    } else if (i == "creeper") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/Creeper.png'>";
    } else if (i == "grass") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/grass.png'>";
    } else if (i == "house") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/House.png'>";
    } else if (i == "island") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/Island.png'>";
    } else if (i == "pickaxe") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/Pickaxe.png'>";
    } else if (i == "portal") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/portal.png'>";
    } else if (i == "redstone") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/redstone.png'>";
    } else if (i == "sword") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/sword.png'>";
    } else if (i == "temple") {
        elementImg = "<img class='mapListIcon' src='others/mapAssets/Temple.png'>";
    }
    elementData = "<p class='mapListData'>Height: " + h + " X: " + px + " Z: " + pz + "</p>";
    elementButton = "<button class='mapListButton' onclick='goTo(" + '"' + h + '"' + "," + px + "," + pz + ")'>Go</button>"

    document.getElementById("map_output").innerHTML += "<hr>" + elementImg + elementH3 + "<br><br><br><br>" + elementData + elementButton;
}

getMapData();

function goTo(height, px, pz) {
    mapHeight = height;
    camera.position.x = px;
    camera.position.y = pz;
    window.location = "#";
}