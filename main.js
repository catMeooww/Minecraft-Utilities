var worldName = localStorage.getItem("world");
var userName = localStorage.getItem("user");
var viewerMode = false;
var isEditing = false;

if (worldName == undefined) {
    window.location = "index.html";
}
if (userName == undefined) {
    viewerMode = true;
}

const firebaseConfig = {
    apiKey: "AIzaSyAOayOKk-7mfMFFFwG9Q56xF51Kgsq51dk",
    authDomain: "lista-projetos-meownium.firebaseapp.com",
    databaseURL: "https://lista-projetos-meownium-default-rtdb.firebaseio.com",
    projectId: "lista-projetos-meownium",
    storageBucket: "lista-projetos-meownium.appspot.com",
    messagingSenderId: "592562559971",
    appId: "1:592562559971:web:4eb153a7645333d5645ed6"
};

firebase.initializeApp(firebaseConfig);

function loadUi(ui) {
    if (ui == 0) {
        document.getElementById("WorldName").innerHTML = worldName;
        document.getElementById("user-placeholder").innerHTML = userName;

        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        document.getElementById("user-placeholder").style.color = "rgb(" + r + "," + g + "," + b + ")";
    }
    document.getElementById("WorldBarName").innerHTML = worldName;
}

function redirect(to) {
    if (to == 1) {
        window.location = "WorldMap.html";
    } else if (to == 2) {
        window.location = "Customization.html";
    } else if (to == 3) {
        window.location = "Craft.html";
    } else if (to == 4) {
        window.location = "EnchantAlphabet.html";
    } else if (to == 5) {
        window.location = "WorldChat.html";
    } else if (to == 6) {
        window.location = "other.html";
    } else {
        window.location = "worldboard.html";
    }
}

function customization_frame(id) {
    if (id == 1) {
        document.getElementById("iframing").src = "https://armortrims.com/";
        document.getElementById("customization_credits").href = "https://armortrims.com/";
        document.getElementById("customization_credits").innerHTML = "Armor Trims";
    } else if (id == 2) {
        document.getElementById("iframing").src = "https://skinmc.net/banner/editor";
        document.getElementById("customization_credits").href = "https://skinmc.net/banner/editor";
        document.getElementById("customization_credits").innerHTML = "Banner Editor";
    } else if (id == 3) {
        document.getElementById("iframing").src = "https://www.minecraftskins.com/skin-editor/";
        document.getElementById("customization_credits").href = "https://www.minecraftskins.com/skin-editor/";
        document.getElementById("customization_credits").innerHTML = "Skin Creator";
    }
}

function craft_frame(id) {
    if (id == 1) {
        document.getElementById("iframing").src = "https://www.minecraft-crafting.net/";
        document.getElementById("craft_credits").href = "https://www.minecraft-crafting.net/";
        document.getElementById("craft_credits").innerHTML = "Craft Guide";
    } else if (id == 2) {
        document.getElementById("iframing").src = "others/potions.html";
        document.getElementById("craft_credits").href = "others/potions.html";
        document.getElementById("craft_credits").innerHTML = "Potion Maker";
    }
}

function addLetter(letter) {
    GTranslated = document.getElementById("Galactic-Translated");
    GNonTranslated = document.getElementById("Galactic-NTranslated");
    if (letter != "-") {
        GTranslated.innerHTML += letter;
        GNonTranslated.innerHTML += letter;
    } else {
        var removeletter = document.getElementById("Galactic-Translated").innerHTML.length - 1;
        var newtext = "";
        for (var i = 0; i < removeletter; i++) {
            newtext += document.getElementById("Galactic-Translated").innerHTML.charAt(i);
            console.log(newtext);
        }
        document.getElementById("Galactic-Translated").innerHTML = newtext;
        document.getElementById("Galactic-NTranslated").innerHTML = newtext;
    }
}

//server
function getChatData() {
    var chatheight = 200;
    firebase.database().ref("/" + worldName + "/chat").on('value', function (snapshot) {
        document.getElementById("chat-output").innerHTML = "<h3 class='server-msg'>Start of Chat</h3>";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            if (childKey != "chat_name") {
                firebaseMessageId = childKey;
                chatText = childData;

                message = chatText['message'];
                user = chatText['user'];

                if (viewerMode == false && user == userName) {
                    messageWithTag = "<div class='mines-msg'><hp>" + user + "</hp><h3>" + message + "</h3></div><br><br><br><br><br><br><br>";
                } else {
                    messageWithTag = "<div class='others-msg'><hp>" + user + "</hp><h3>" + message + "</h3></div><br><br><br><br><br><br><br>";
                }

                newheight = chatheight + 100;
                chatheight = newheight

                document.getElementById("chat-output").innerHTML += messageWithTag;

                document.getElementById("chat-page").style.height = String(newheight) + "px";
            } else {
                document.getElementById("chat-title").innerHTML = childData;
            }
        });
    });
}

function sendchat() {
    msg = document.getElementById("chat-sender").value;
    if (!msg == "") {
        document.getElementById("chat-sender").value = "";
        firebase.database().ref(worldName + "/chat").push({
            user: userName,
            message: msg
        });
    }
}

function loadChat() {
    loadUi(1);
    if (viewerMode == true) {
        document.getElementById("send-to-chat").innerHTML = "<h1 style='color:#00eeff;'>Viewer Mode On</h1><p>Log-in to send messages</p>"
    }
    getChatData();
}

function changeChatName() {
    if (isEditing == false) {
        document.getElementById("chat-title").innerHTML = "<input id='newchatname'>";
        isEditing = true;
    } else {
        newname = document.getElementById("newchatname").value;
        document.getElementById("chat-title").innerHTML = "";
        firebase.database().ref(worldName + "/chat").update({
            chat_name: newname
        });
        isEditing = false;
    }
}