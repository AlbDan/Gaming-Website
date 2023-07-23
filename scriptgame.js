// Con queste procedure riporto i dati del gioco caricati nel sessionStorage su questa pagina, e gli conservo a sua volta nel proprio localStorage in modo tale da conservare i dati nel caso in cui decido di aprire direttamente la pagina del gioco.
// Ho preferito passare l'intero oggetto del gioco scelto dalla pagina home anzichè fare il fetch del gioco in base al nome poiche permette di caricare i dati molto più rapidamente.

if (JSON.parse(sessionStorage.getItem("gameData"))!=null) {
    localStorage.setItem("gameData", JSON.stringify(JSON.parse(sessionStorage.getItem("gameData"))))       
}

const gameData = JSON.parse(localStorage.getItem("gameData"));

// Questi dati servono per successivamente filtrare i giochi simili in base ai generi del gioco.

let gameGenres = []

for (let i = 0; i < gameData.genres.length; i++) {
    gameGenres.push(gameData.genres[i].name)    
}

// Questo array contiene il nome dei vari negozi da cui è acquistabile il presente gioco. Servirà per generare le cta dei negozi. 

let gameStore = [];
gameData.stores.forEach(g => gameStore.push(g.store.name));

const iconsPlatformsGame = document.querySelector('#iconsPlatformsGame');
const playtime = document.querySelector('#playtime');
const name = document.querySelector('#name');
const gameBackground = document.querySelector("#gameBackground")
const carouselWrapper = document.querySelector("#carouselWrapper")
const gameImgWrapper = document.querySelector("#gameImgWrapper")

// Con questa iterazione carico le immagini sul carosello.

for (let i = 0; i < gameData.short_screenshots.length; i++) {
    let div = document.createElement("div");
    div.classList.add("col-12", "d-flex", "align-items-center");
    div.innerHTML = 
    `
    <img src=${gameData.short_screenshots[i].image} alt="" class="custom--display">
    `;
    carouselWrapper.append(div)
    aspectRatio(div.children[0]);
    let li = document.createElement("li");
    li.classList.add("col-3", "col-md-2", "game-img-hs")
    li.innerHTML =
    `
    <img data-scsh=img(${i}) src=${gameData.short_screenshots[i].image} alt="" class="img-fluid cust-view">        
    `;
    gameImgWrapper.append(li);
    aspectRatio(li.children[0]);
}

// Queste istruzioni inizializzano lo stile del primo elemento sul selettore di immagini.

if (gameImgWrapper.children[0]) {
    gameImgWrapper.children[0].style.opacity = 1;
    gameImgWrapper.children[0].children[0].style.border = "2px solid #570D0D";
}


const customDisplay = document.querySelectorAll(".custom--display");
const innerAsd = document.querySelector(".inner-asd");

// Questo addEventListener permette di calcolare il rapporto immagine appena il documento termina di caricare.

window.addEventListener("load", ()=>{
    for (let i = 0; i < gameData.short_screenshots.length; i++) {
        aspectRatio(customDisplay[i])
        aspectRatio(gameImgWrapper.children[i].children[0]);
    } 
})

// Questo addEventListener permette di far comparire l'immagine selezionata sul carosello in maniera più ampia.

for (let i = 0; i < customDisplay.length; i++) {
    customDisplay[i].addEventListener('click', (e)=>{
        let div = document.createElement("div")
        div.classList.add("position-fixed", "vh-100", "vw-100", "ultra--index", "d-flex", "justify-content-center", "align-items-center")
        div.innerHTML = 
        `
        <div id="imgDisplayWrapper" class="backvp"></div>        
        `
        div.children[0].style.backgroundImage = `url("${e.target.src}")`
        gameBackground.insertBefore(div, gameBackground.children[0]);
        const toggleImg = document.querySelector(".ultra--index");
        toggleImg.addEventListener("click", ()=>{
            div.remove()
        })
    })    
}

const arrowButton = Array.from(document.querySelectorAll(".img-game-arrow"));
const carLeft = document.querySelector(".car-left")
const carRight = document.querySelector(".car-right")
const scsh = Array.from(document.querySelectorAll("[data-scsh]"));

// Questi addEventListener servono per far comparire o scomparire i pulsanti del carosello in base posizionamento del mouse.

innerAsd.addEventListener("mouseover", ()=>{
    carLeft.parentElement.classList.remove("car-l-000");
    carRight.parentElement.classList.remove("car-r-000");
    carLeft.parentElement.classList.add("car-l-000-h");
    carRight.parentElement.classList.add("car-r-000-h");
})

innerAsd.addEventListener("mouseout", ()=>{
    carLeft.parentElement.classList.add("car-l-000");
    carRight.parentElement.classList.add("car-r-000");
    carLeft.parentElement.classList.remove("car-l-000-h");
    carRight.parentElement.classList.remove("car-r-000-h");
})


let NIndex = gameData.short_screenshots.length;
let indexxxx = -1;

if (NIndex<=6)
arrowButton.forEach(b => b.style.display = "none");

let jumpT = 6;

// Con questi addEventListener vengono mostrati o nascosti i pulsanti di scorrimento del selettore di immagini in base all'ampiezza dello schermo, il numero di immagini selezionabili sul selettore cambia in base alla dimensione della finestra e con esso cambia anche il comportamento dell'algoritmo di scorrimento delle immagini.

window.addEventListener("load", ()=>{
    if (window.innerWidth<768) {
        jumpT = 4;
        if (NIndex<=4)
        arrowButton.forEach(b => b.style.display = "none");
        else
        arrowButton.forEach(b => b.style.display = "block");
    } else {
        jumpT = 6;
        if (NIndex<=6)
        arrowButton.forEach(b => b.style.display = "none");
        else
        arrowButton.forEach(b => b.style.display = "block");       
    }
})

window.addEventListener("resize", ()=>{
    if (window.innerWidth<768) {
        jumpT = 4;
        if (NIndex<=4)
        arrowButton.forEach(b => b.style.display = "none");
        else
        arrowButton.forEach(b => b.style.display = "block");
    } else {
        jumpT = 6;
        if (NIndex<=6)
        arrowButton.forEach(b => b.style.display = "none");
        else
        arrowButton.forEach(b => b.style.display = "block");       
    }
})

// Questa serie di procedure controllano il comportamento del carosello, permettendo di rendere scorrevole il carosello in tandem col selettore di immagini, una serie di calcoli vengono effettuati per riposizionare l'intero scorrimento di ambo le parti conservandone l'associazione visiva in qualsiasi scenario di interazione possibile.

let indexCar = 0;
let indexCarII = 1;
let contJumps = jumpT;
let translationCarII = 1;
carRight.addEventListener('click', ()=>{
    if (indexCar==carouselWrapper.children.length-1) {
        carouselWrapper.style.transform = `translateX(0px)`;
        gameImgWrapper.style.transform = `translate(0px)`;
        indexCarII=1;
        contJumps=jumpT;
        translationCarII=1;
        scsh[indexCar].parentElement.style.opacity = ".5";
        scsh[indexCar].style.border = `none`;
        indexCar=0;
        scsh[indexCar].parentElement.style.opacity = "1";
        scsh[indexCar].style.border = `2px solid #570D0D`;
    } else {
        carouselWrapper.style.transform = `translateX(-${carouselWrapper.children[indexCar].getBoundingClientRect().width*(indexCar+1)}px)`;
        indexCar++;
        scsh[indexCar].parentElement.style.opacity = "1";
        scsh[indexCar].style.border = `2px solid #570D0D`;
        scsh[indexCar-1].parentElement.style.opacity = ".5";
        scsh[indexCar-1].style.border = `none`;
        if (indexCarII-translationCarII!=0) {
            let tX = indexCarII-translationCarII;
            indexCarII = indexCarII - 1*tX;
            gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
            contJumps-=jumpT*tX;
        }
        if (indexCar>jumpT*indexCarII-1) {
            gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*indexCarII}px)`;
            indexCarII++;
            contJumps+=jumpT;
            translationCarII++;
        }
    }    
});

carLeft.addEventListener('click', ()=>{
    if (indexCar==0) {
        carouselWrapper.style.transform = `translateX(-${carouselWrapper.children[0].getBoundingClientRect().width*(carouselWrapper.children.length-1)}px)`;
        if (NIndex>4) {
            indexCarII = Math.floor(NIndex/jumpT)+1;
            contJumps = (Math.floor(NIndex/jumpT)+1)*jumpT;
            translationCarII = Math.floor(NIndex/jumpT)+1;
            gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
        }
        scsh[indexCar].parentElement.style.opacity = ".5";
        scsh[indexCar].style.border = `none`;
        indexCar=carouselWrapper.children.length-1;
        scsh[indexCar].parentElement.style.opacity = "1";
        scsh[indexCar].style.border = `2px solid #570D0D`;
    } else {
        carouselWrapper.style.transform = `translateX(-${carouselWrapper.children[indexCar].getBoundingClientRect().width*(indexCar-1)}px)`;
        indexCar--;
        scsh[indexCar].parentElement.style.opacity = "1";
        scsh[indexCar].style.border = `2px solid #570D0D`;
        scsh[indexCar+1].parentElement.style.opacity = ".5";
        scsh[indexCar+1].style.border = `none`;
        if (indexCarII-translationCarII!=0) {
            let tX = translationCarII-indexCarII;
            if (tX>0) {
                gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII)}px)`;
                indexCarII = indexCarII + 1*tX;
                contJumps+=jumpT*tX;           
            } else {
                indexCarII = indexCarII - 1*tX*(-1);
                gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
                contJumps-=jumpT*tX*(-1);            
            }
        }
        if (Number.isInteger((indexCar+1)/jumpT)) {
            indexCarII--;
            translationCarII--;
            gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
            contJumps-=jumpT;
        }
    }    
});

for (let i = 0; i < arrowButton.length; i++) {
    arrowButton[i].addEventListener('click', ()=>{
        if (i == 1) {
            if (contJumps<NIndex) {
                gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*indexCarII}px)`;
                indexCarII++;
                contJumps+=jumpT;
            } else {
                gameImgWrapper.style.transform = `translate(0px)`;
                indexCarII=1;
                contJumps=jumpT;
            }
        } else {
            if (indexCarII>1) {
                indexCarII--;
                gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
                contJumps-=jumpT;
            } else {
                indexCarII = Math.floor(NIndex/jumpT)+1;
                contJumps = (Math.floor(NIndex/jumpT)+1)*jumpT;
                gameImgWrapper.style.transform = `translate(-${gameImgWrapper.getBoundingClientRect().width*(indexCarII-1)}px)`;
            }                 
        }
    })
}

// La funzione per calcolare il rapporto immagine degli screenshot, questo aggiunge del padding al loro contenitore per eguargliarne la dimensione tra di loro in base a una costante, in questo caso è il rapporto tra 1080px e 1920px.

function aspectRatio(img) {
    img.parentElement.style.padding = `0px`;
    const UniV = 0.5625;    //UniV = 1080/1920
    let x = img.parentElement.getBoundingClientRect().width;
    let y = img.parentElement.getBoundingClientRect().height
    let z = y/x;
    if (z<UniV) {
        let p = UniV/z
        let PaddingLeftY = y*p-y;
        let PaddingY=PaddingLeftY/2
        img.parentElement.style.padding = `${PaddingY}px 0px`;
    }
    else
    if (z>UniV) {
        let p = z/UniV
        let PaddingLeftX = x*p-x;
        let PaddingX=PaddingLeftX/2
        img.parentElement.style.padding = `0px ${PaddingX*(UniV/z)}px`;
    }
}

for (let i = 0; i < customDisplay.length; i++) {
    aspectRatio(customDisplay[i])
}

// Questo addEventListener serve a selezionare l'immagine dal selettore di immagini e a mostrarlo sul carosello che verrà traslato fino a far comparire l'immagine selezionata.

for (let i = 0; i < scsh.length; i++) {
    scsh[i].addEventListener('click', (e)=>{
        carouselWrapper.style.transform = `translateX(-${customDisplay[i].parentElement.getBoundingClientRect().width*i}px)`;
        indexCar = i;
        translationCarII =  Math.floor(i/jumpT+1);
        for (let j = 0; j < scsh.length; j++) {
            scsh[j].style.border = `none`;
            scsh[j].parentElement.style.opacity = 0.5;
        }
        e.target.style.border = `2px solid #570D0D`;
        e.target.parentElement.style.opacity = 1;
    })
    
    scsh[i].addEventListener("mouseover", (e) => {
        e.target.parentElement.style.opacity = 1;
    });
    
    scsh[i].addEventListener("mouseout", (e) => {
        if (e.target.style.border != `2px solid rgb(87, 13, 13)`) 
        e.target.parentElement.style.opacity = 0.5;
    });
}

const plotReviews = document.querySelector('#plotReviews');
const platforms = document.querySelector('#platforms');

// Una serie di istruzione per popolare il layout coi vari del gioco.

gameBackground.style.background = `linear-gradient(rgba(0,0,0,0.5), #000), url(${gameData.background_image})`;
gameBackground.style.backgroundPosition = "center";
gameBackground.style.backgroundRepeat = "no-repeat";
gameBackground.style.backgroundSize = "cover";
gameBackground.style.backgroundAttachment = "fixed";

gameData.parent_platforms.forEach(parentPlatform => {
    if (parentPlatform.platform.name == 'PC') {
        let img = document.createElement('img')
        img.src = "./downloads/windows-10.png"
        img.width = "30"
        iconsPlatformsGame.append(img)
    }
    if (parentPlatform.platform.name == 'PlayStation') {
        let img = document.createElement('img')
        img.src = "./downloads/play-station.png"
        iconsPlatformsGame.append(img)
    }
    if (parentPlatform.platform.name == 'Xbox') {
        let img = document.createElement('img')
        img.src = "./downloads/xbox.png"
        iconsPlatformsGame.append(img)
    }
    if (parentPlatform.platform.name == 'Nintendo') {
        let img = document.createElement('img')
        img.src = "./downloads/nintendo-switch.png"
        iconsPlatformsGame.append(img)
    }
    if (parentPlatform.platform.name == 'Linux') {
        let img = document.createElement('img')
        img.src = "./downloads/linux.png"
        iconsPlatformsGame.append(img)
    }
});

playtime.textContent = gameData.playtime
name.textContent = gameData.name

// Le operazioni sotto riportate servono per inserire i dati all'interno della rappresentazione grafica dei Ratings oltre che a darne stile e interazione.

let totReviews = 0;

for (let i = 0; i < gameData.ratings.length; i++) {
    totReviews += gameData.ratings[i].count
}

const prw001 = Array.from(document.querySelector(".prw-001").children);
const prw002 = Array.from(document.querySelector(".prw-002").children);
const bgColors = ["rgb(43, 255, 75)", "rgb(43, 255, 255)", "rgb(255, 255, 43)", "rgb(255, 43, 43)"];
const bgColorsHover = ["rgb(110, 255, 131)", "rgb(110, 255, 255)", "rgb(255, 255, 110)", "rgb(255, 110, 110)"];

function vIcons() {
    for (let i = 0; i < gameData.ratings.length; i++) {
        if (gameData.ratings[i].title=="exceptional"){
            prw001[0].style.width = `${gameData.ratings[i].count*100/totReviews}%`;
        } 
        if (gameData.ratings[i].title=="recommended") {
            prw001[1].style.width = `${gameData.ratings[i].count*100/totReviews}%`;
        }
        if (gameData.ratings[i].title=="meh") {
            prw001[2].style.width = `${gameData.ratings[i].count*100/totReviews}%`;
        }
        if (gameData.ratings[i].title=="skip") {
            prw001[3].style.width = `${gameData.ratings[i].count*100/totReviews}%`;            
        }
    }
}

function timeOutVIcons() {
    setTimeout(() => {
        if (prw001[0].getBoundingClientRect().width>=90) {
            prw001[0].classList.add("prw-exc-pe")
        }
        if (prw001[1].getBoundingClientRect().width>=90) {
            prw001[1].classList.add("prw-rec-pe")
        }
        if (prw001[2].getBoundingClientRect().width>=90) {
            prw001[2].classList.add("prw-meh-pe")
        }
        if (prw001[3].getBoundingClientRect().width>=90) {
            prw001[3].classList.add("prw-ski-pe")
        }
    }, 400);
}

if (window.innerWidth<=992) 
vIcons();
if (window.scrollY>=plotReviews.getBoundingClientRect().height && window.scrollY<=plotReviews.getBoundingClientRect().height+window.innerHeight) 
vIcons();

timeOutVIcons();

window.addEventListener("scroll", ()=>{
    if (window.scrollY>=plotReviews.getBoundingClientRect().height && window.scrollY<=plotReviews.getBoundingClientRect().height+window.innerHeight)  
    vIcons();
    timeOutVIcons();
})

for (let i = 0; i < gameData.ratings.length; i++) {
    if (gameData.ratings[i].title=="exceptional"){
        prw002[0].children[0].innerText = gameData.ratings[i].count;
    } 
    if (gameData.ratings[i].title=="recommended") {
        prw002[1].children[0].innerText = gameData.ratings[i].count;
    }
    if (gameData.ratings[i].title=="meh") {
        prw002[2].children[0].innerText = gameData.ratings[i].count;
    }
    if (gameData.ratings[i].title=="skip") {
        prw002[3].children[0].innerText = gameData.ratings[i].count;
    }
}

for (let i = 0; i < prw001.length; i++) {
    prw001[i].addEventListener("mouseover", ()=>{
        prw001[i].style.backgroundColor = bgColorsHover[i];
        prw001[i].style.boxShadow = `3px 0px 3px rgba(255, 255, 255, .7), 0px 3px 3px rgba(255, 255, 255, .7), -3px 0px 3px rgba(255, 255, 255, .7), 0px -3px 3px rgba(255, 255, 255, .7)`;
        prw002[i].style.border = `2px solid white`;
    })
    prw001[i].addEventListener("mouseout", ()=>{
        prw001[i].style.backgroundColor = bgColors[i];
        prw001[i].style.boxShadow = "none";
        prw002[i].style.border = `2px solid transparent`;
    })
}

for (let i = 0; i < prw002.length; i++) {
    prw002[i].addEventListener("mouseover", ()=>{
        prw001[i].style.backgroundColor = bgColorsHover[i];
        prw001[i].style.boxShadow = `3px 0px 3px rgba(255, 255, 255, .7), 0px 3px 3px rgba(255, 255, 255, .7), -3px 0px 3px rgba(255, 255, 255, .7), 0px -3px 3px rgba(255, 255, 255, .7)`;
        prw002[i].style.border = `2px solid white`;
    })
    prw002[i].addEventListener("mouseout", ()=>{
        prw001[i].style.backgroundColor = bgColors[i];
        prw001[i].style.boxShadow = "none";
        prw002[i].style.border = `2px solid transparent`;
    })
}

// Le seguenti istruzioni inseriscono i dati delle piattaforme in cui è possibile giocare il gioco selezionato oltre che a renderli dei filtri operativi.

gameData.platforms.forEach(platform => {
    let a = document.createElement('a')
    a.classList.add("f-p", "text-white", "small", "mx-2")
    a.setAttribute("data-plnk", `${platform.platform.name.replaceAll(" ", "")}pLink`)
    a.href = "./Home.html"
    a.innerText = platform.platform.name 
    platforms.append(a)
})

let platformA = Array.from(document.querySelectorAll("[data-plnk]"))
for (let i = 0; i < platformA.length; i++) {
    platformA[i].addEventListener('click', (e)=>{
        sessionStorage.setItem("platformSearched", e.target.innerText)
    })
}

// questo array di oggetti contine delle informazioni per applicare le icone corrispondenti ai negozi e permette di costuire in seguito dei link per reindirizzare alla pagina del negozio selezionato con una ricerca in base al gioco visualizzato al momento.

const storeWrapper = document.querySelector("#storeWrapper");
const storeIcons = [
    {
        storeName: "Steam",
        StoreIconIdle: "./downloads/icons8-steam-circled-480.png",
        StoreIconHover: "./downloads/icons8-steam-circled-480(1).png",
        StoreURL: "https://store.steampowered.com/search/?term="
    },
    {
        storeName: "GOG",
        StoreIconIdle: "./downloads/icons8-gog-a-digital-distribution-platform-for-video-games-and-films-96.png",
        StoreIconHover: "./downloads/icons8-gog-a-digital-distribution-platform-for-video-games-and-films-96(1).png",
        StoreURL: {
            p1: "https://www.gog.com/en/games?query=",
            p2: "&order=desc:score"
        }
    },
    {
        storeName: "Epic Games",
        StoreIconIdle: "./downloads/EpicGames-grey.png",
        StoreIconHover: "./downloads/EpicGames-black.png",
        StoreURL: {
            p1: "https://store.epicgames.com/en-US/browse?q=",
            p2: "&sortBy=relevancy&sortDir=DESC&count=40"
        }
    },
    {
        storeName: "PlayStation Store",
        StoreIconIdle: "./downloads/icons8-play-station-240.png",
        StoreIconHover: "./downloads/icons8-play-station-240(1).png",
        StoreURL: "https://store.playstation.com/en-us/search/"
    },
    {
        storeName: "App Store",
        StoreIconIdle: "./downloads/ios-grey.png",
        StoreIconHover: "./downloads/ios-black.png",
        StoreURL: {
            p1: "https://www.apple.com/us/search/",
            p2: "?src=serp"
        }
    },
    {
        storeName: "Google Play",
        StoreIconIdle: "./downloads/icons8-google-play-500.png",
        StoreIconHover: "./downloads/icons8-google-play-500(1).png",
        StoreURL: {
            p1: "https://play.google.com/store/search?q=",
            p2: "&c=apps"
        }
    },
    {
        storeName: "itch.io",
        StoreIconIdle: "./downloads/icons8-itch-io-480.png",
        StoreIconHover: "./downloads/icons8-itch-io-480(1).png",
        StoreURL: "https://itch.io/search?q="
    },
    {
        storeName: "Nintendo Store",
        StoreIconIdle: "./downloads/icons8-nintendo-100.png",
        StoreIconHover: "./downloads/icons8-nintendo-100(1).png",
        StoreURL: {
            p1: "https://www.nintendo.com/search/?q=",
            p2: "&p=1&cat=all&sort=df"
        }
    },
    {
        storeName: "Xbox Store",
        StoreIconIdle: "./downloads/icons8-xbox-500.png",
        StoreIconHover: "./downloads/icons8-xbox-500(1).png",
        StoreURL: "https://www.xbox.com/en-us/search?q="
    }
];

// Questa iterazione costruisce i pulsanti per visitare i vari negozi che vendono il gioco visualizzato nella pagina. Essendo Xbox 360 Store incorporato in Xbox Store l'ho escluso.

for (let i = 0; i < gameStore.length; i++) {
    if (gameStore[i]!="Xbox 360 Store") {
        let div = document.createElement("div");
        div.classList.add("col-lg-12", "col-xxl-6", "my-3");
        div.setAttribute("data-st", `${gameStore[i]}-st`)
        div.innerHTML = 
        `
        <a href="#" class="text-decoration-none" target="_blank">
        <button class="game--store">
        ${gameStore[i]}
        <div class="g--logo">
        <div class="g--logo-i"></div>
        <div class="g--logo-h"></div>
        </div>
        </button>       
        </a>                                  
        
        `
        for (let j = 0; j < storeIcons.length; j++) {
            if (storeIcons[j].storeName==gameStore[i]) {
                div.children[0].children[0].children[0].children[0].style.backgroundImage = `url("${storeIcons[j].StoreIconIdle}")`
                div.children[0].children[0].children[0].children[1].style.backgroundImage = `url("${storeIcons[j].StoreIconHover}")`
                if (storeIcons[j].storeName == "Steam" ||
                storeIcons[j].storeName == "PlayStation Store" ||
                storeIcons[j].storeName == "itch.io"||
                storeIcons[j].storeName == "Xbox Store") {
                    div.children[0].href = storeIcons[j].StoreURL + gameData.name;
                } else {
                    div.children[0].href = storeIcons[j].StoreURL.p1 + gameData.name + storeIcons[j].StoreURL.p2;
                }
            }
        }
        storeWrapper.append(div);
    }
}

// Queste istruzioni servono per dare stile alle icone dei negozi, in questo caso non essendo vere icone ma immagini ho ricreato il comportamento che avrebbe un icona (che si comporterebbe come un testo) in caso di hover. Le risorse di bootstrap non erano sufficenti per una rappresentazione fedele. 

let dataSt = Array.from(document.querySelectorAll("[data-st]"))

for (let i = 0; i < dataSt.length; i++) {
    dataSt[i].children[0].addEventListener("mouseover", ()=>{
        for (let j = 0; j < storeIcons.length; j++) {
            if (storeIcons[j].storeName==gameStore[i]) {
                dataSt[i].children[0].children[0].children[0].children[1].style.opacity = 1;
            }
        }
        
    })
    dataSt[i].children[0].addEventListener("mouseout", () => {
        for (let j = 0; j < storeIcons.length; j++) {
            if (storeIcons[j].storeName==gameStore[i]) {
                dataSt[i].children[0].children[0].children[0].children[1].style.opacity = 0;
            }
        }
    });
}

// Le seguenti istruzioni servono per popolare il layout di ulteriori informazioni basate sul gioco visualizzato.

const gameMetacriticsWrapper = document.querySelector("#gameMetacriticsWrapper");
const gameGenresWrapper = document.querySelector("#gameGenresWrapper");
const gameESRBWrapper = document.querySelector("#gameESRBWrapper");
const gameRatingWrapper = document.querySelector("#gameRatingWrapper");
const gameNORaWrapper = document.querySelector("#gameNORaWrapper");
const gameDORWrapper = document.querySelector("#gameDORWrapper");
const gameNOReWrapper = document.querySelector("#gameNOReWrapper");
const gameUpdatedWrapper = document.querySelector("#gameUpdatedWrapper");
const gameTagsWrapper = document.querySelector("#gameTagsWrapper");

gameMetacriticsWrapper.innerText = gameData.metacritic!=null ? gameData.metacritic : "n/a";

for (let i = 0; i < gameData.genres.length; i++) {
    gameGenresWrapper.innerHTML += `<a data-gengame=genrelnk class="text-white" href="./Home.html">${gameData.genres[i].name}</a>`+", "
}
let fixHTML = gameGenresWrapper.innerHTML
gameGenresWrapper.innerHTML = fixHTML.slice(0, fixHTML.length-2);

const gengame = Array.from(document.querySelectorAll("[data-gengame]"))
for (let i = 0; i < gengame.length; i++) {
    gengame[i].addEventListener('click', (e)=>{
        sessionStorage.setItem("genreSearched", e.target.innerText)
    })    
}

gameESRBWrapper.innerText = gameData.esrb_rating ? gameData.esrb_rating.name : "Not Rated";
gameESRBWrapper.addEventListener('click', (e)=>{
    sessionStorage.setItem("esrbSearched", e.target.innerText)
})
gameRatingWrapper.innerText = gameData.rating;
gameNORaWrapper.innerText = gameData.ratings_count;
gameDORWrapper.innerText = new Intl.DateTimeFormat('en-EN', {
    year: "numeric",
    month: "short",
    day: "numeric",
}).format(new Date(gameData.released));
gameNOReWrapper.innerText = gameData.reviews_count;
gameUpdatedWrapper.innerText = new Intl.DateTimeFormat('en-EN', {
    year: "numeric",
    month: "short",
    day: "numeric",
}).format(new Date(gameData.updated));

for (let i = 0; i < gameData.tags.length; i++) {
    gameTagsWrapper.innerHTML += `<a data-tagsgame=gametags class="text-white" href="./Home.html">${gameData.tags[i].name}</a>`+", "
}
let fixHTML1 = gameTagsWrapper.innerHTML
gameTagsWrapper.innerHTML = fixHTML1.slice(0, fixHTML1.length-2);

const tagsgame = Array.from(document.querySelectorAll("[data-tagsgame]"))
for (let i = 0; i < tagsgame.length; i++) {
    tagsgame[i].addEventListener('click', (e)=>{
        sessionStorage.setItem("tagSearched", e.target.innerText)
    })    
}

const similarGamesWrapper = document.querySelector("#similarGamesWrapper");
const gamesLikeWrapper = document.querySelector("#gamesLikeWrapper");
gamesLikeWrapper.innerText = `Games Like ${gameData.name}`;
const loadMore = document.querySelector("#loadMore");
const navbar = document.querySelector(".navbar");
const fotfot = document.querySelector("#fotfot");
const backToTop = document.querySelector(".back-to-top");

// Questi addEventListener servono per riposizionare il bottoncino che permette di tornare in cima alla pagina.

document.addEventListener("scroll", ()=>{
    if (window.scrollY<navbar.getBoundingClientRect().height) {
        backToTop.style.right = `-100px`
    } else {
        backToTop.style.right = "50px"
    }
})

window.addEventListener("scroll", ()=>{
    if (window.scrollY>(document.body.getBoundingClientRect().height-fotfot.getBoundingClientRect().height-window.innerHeight)) {
        backToTop.style.position = "absolute";
    } else {
        backToTop.style.position = "fixed";
    }
})

backToTop.addEventListener("click", ()=>{
    window.scrollTo(0, 0);
})

function sortingbyMetacritics(data) {
    loadMore.style.display = "block";
    return data.sort((a, b) => b.metacritic - a.metacritic)
}

// Questi array servono per rappresentare i giochi simili al gioco visulizzato al momento.

let allGamesAA = [];
let allGamesUA = [];
let gameDataArray = [];
let similarGames = [];

// Questa funzione serve per filtrare i giochi che vengono presi dall'API in base ai generi del gioco visualizzato.

function filterGamesByGenre(games) {
    for (let i = 0; i < gameGenres.length; i++) {
        for (let j = 0; j < games.length; j++) {
            for (let k = 0; k < games[j].genres.length; k++) {
                if (gameGenres[i]==games[j].genres[k].name) {
                    similarGames.push(games[j])
                }
            }
        }      
    }
    let checkname;    
    for (let j = 0; j < similarGames.length; j++) {
        checkname = similarGames[j].name;
        for (let i = j+1; i < similarGames.length; i++) {
            if (similarGames[i].name==checkname) {
                similarGames.splice(i, 1)
                i--;
            }
        }
    }
    checkname = gameData.name
    for (let i = 0; i < similarGames.length; i++) {
        if (similarGames[i].name==checkname) {
            similarGames.splice(i, 1)
            i--;
        }        
    }
}

// La funzione per inserire le icone.

function platformIcons(game) {
    const WNames = ["PC", "PlayStation", "Xbox", "Nintendo", "Linux"]
    const TNames = [
        `<i class="bi bi-windows"></i>`, 
        `<i class="bi bi-playstation"></i>`, 
        `<i class="bi bi-xbox"></i>`, 
        `<i class="Nintendo-i"></i>`, 
        `<i class="Linux-i"></i>`
    ];
    let platNames = []
    for (let j = 0; j < game.parent_platforms.length; j++) {
        for (let i = 0; i < WNames.length; i++) {
            if (game.parent_platforms[j].platform.name == WNames[i])
            platNames.push(TNames[i])
        }
    }  
    return platNames.join(" ")
}

// Questa funzione serve per visualizzare le card dei vari giochi simili, in essi vengono incorporati dei link che reindirizzeranno alla Home con dei dati salvati in sessionStorage che in seguito realizzeranno un filtro.

function manifestGames(gamestoreveal) {
    gameDataArray = [];
    similarGamesWrapper.innerHTML="";
    for (let i = 0; i < gamestoreveal.length; i++) {
        let div = document.createElement("div");
        div.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3", "text-white", "mb-3");
        div.innerHTML = 
        `
        <div class="card card-game f-p">
        <img class="card-img-top" src="${gamestoreveal[i].background_image}" alt="">
        <div class="px-3 my-3">
        <div class="d-flex justify-content-between">
        <div>
        ${platformIcons(gamestoreveal[i])}
        </div>
        <div>
        <div class="metacritics">${gamestoreveal[i].metacritic!=null ? gamestoreveal[i].metacritic : "n/a"}</div>
        </div>
        </div> 
        <h4 class="text-center my-3">${gamestoreveal[i].name}</h4>
        <div class="d-flex position-relative">
        <button class="add--stuff small fw-bold mx-1"><i class="bi bi-plus-square me-1"></i>${gamestoreveal[i].reviews_count}</button>
        <button class="add--stuff small fw-bold mx-1"><i class="bi bi-gift"></i></button>
        <button data-vote=${gamestoreveal[i].name.replaceAll(" ", "")}Vote class="add--stuff small fw-bold mx-1"><i class="bi bi-three-dots"></i></button>
        </div>
        <div class="d-flex justify-content-between my-3 border-bottom border-1 border-secondary">
        <p class="text-secondary">Release Date:</p>
        <p>${new Intl.DateTimeFormat('en-EN', {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(gamestoreveal[i].updated))}</p>
        </div>
        <div class="d-flex justify-content-between my-3 border-bottom border-1 border-secondary">
        <p class="text-secondary">Genres:</p>
        <p>${gamestoreveal[i].genres.map(genere => {
            return `<a href="./Home.html" class="text-white" data-genre=${genere.name.replaceAll(" ", "")}Genre >` + genere.name + "</a>"
        }).slice(0, 2).join(", ")}</p>
        </div> 
        <div class="d-flex justify-content-between my-3 border-bottom border-1 border-secondary">
        <p class="text-secondary">ESRB:</p>
        <a href="./Home.html" data-esrb=ESRB_rating>${gamestoreveal[i].esrb_rating ? gamestoreveal[i].esrb_rating.name : "Not Rated"}</a>
        </div>
        <div class="d-flex justify-content-center mt-3">
        <a href="./Game.html" class="text-decoration-none">
        <button data-checkGame=${gamestoreveal[i].name.replaceAll(" ", "")}CheckOut class="add--stuff px-4 py-2 fw-bold">Check this game out</button>
        </a>
        </div>                     
        </div>
        </div>
        `;
        similarGamesWrapper.append(div)
        
        gameDataArray.push(gamestoreveal[i])
        
    }
    
    let genre = Array.from(document.querySelectorAll("[data-genre]"))
    for (let i = 0; i < genre.length; i++) {
        genre[i].addEventListener('click', (e)=>{
            sessionStorage.setItem("genreSearched", e.target.innerText)
        })
    }
    
    let esrb = Array.from(document.querySelectorAll("[data-esrb]"))
    for (let i = 0; i < esrb.length; i++) {
        esrb[i].addEventListener('click', (e)=>{
            sessionStorage.setItem("esrbSearched", e.target.innerText)
        })
    }
      
    
    let vote = Array.from(document.querySelectorAll("[data-vote]"))
    
    for (let i = 0; i < vote.length; i++) {
        vote[i].addEventListener("click", ()=>{
            let clickC = 0
            let div = document.createElement("div");
            div.classList.add("vote--custom")
            div.innerHTML = 
            `
            <p class="fw-bold text-center">Rate in one click</p>
            <div class="vote--ins">
            <div role="button" class="exceptional d-flex flex-column justify-content-center">
            <div class="d-flex justify-content-center">
            <img width="40px" src="./downloads/Exceptional.png" alt="">
            </div>
            <p class="text-center mb-0 small--c">Exceptional</p>
            </div>
            <div role="button" class="recommended d-flex flex-column justify-content-center">
            <div class="d-flex justify-content-center">
            <img width="40px" src="./downloads/Recommended.png" alt="">
            </div>
            <p class="text-center mb-0 small--c">Recommended</p>
            </div>
            <div role="button" class="meh d-flex flex-column justify-content-center">
            <div class="d-flex justify-content-center">
            <img width="40px" src="./downloads/meh.png" alt="">
            </div>
            <p class="text-center mb-0 small--c">Meh</p>
            </div>
            <div role="button" class="skip d-flex flex-column justify-content-center">
            <div class="d-flex justify-content-center">
            <img width="40px" src="./downloads/Skip.png" alt="">
            </div>
            <p class="text-center mb-0 small--c">Skip</p>
            </div>          
            </div>
            
            `
            vote[i].parentElement.append(div)
            
            document.addEventListener("click", ()=>{
                clickC++;
                if (clickC!=1) {
                    div.style.opacity = "0";
                    setTimeout(() => {
                        div.remove();
                    }, 400);
                    clickC = 0;
                }
            })
            
            let voteCustom = document.querySelector(".vote--custom")
            
            voteCustom.addEventListener("click", (e)=>{
                if (e.target.closest(".exceptional"))
                {
                    let p = document.createElement("p");
                    p.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "fs-1", "voted--custom")
                    p.innerText = "Exceptional";
                    voteCustom.children[1].append(p);
                } 
                if (e.target.closest(".recommended")) 
                {
                    let p = document.createElement("p");
                    p.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "fs-1", "voted--custom")
                    p.innerText = "Recommended";
                    voteCustom.children[1].append(p);
                } 
                if (e.target.closest(".meh")) 
                {
                    let p = document.createElement("p");
                    p.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "fs-1", "voted--custom")
                    p.innerText = "Meh";
                    voteCustom.children[1].append(p);
                } 
                if (e.target.closest(".skip")) 
                {
                    let p = document.createElement("p");
                    p.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "fs-1", "voted--custom")
                    p.innerText = "Skip";
                    voteCustom.children[1].append(p);
                } 
            })
        })
    }
    
    let checkGame = Array.from(document.querySelectorAll("[data-checkGame]"))
    
    for (let i = 0; i < checkGame.length; i++) {
        checkGame[i].addEventListener("click", ()=>{
            sessionStorage.setItem("gameData", JSON.stringify(gameDataArray[i]));
        })            
    }
}

// Il fetch iniziale che riporterà i giochi simili al gioco visulizzato in seguito all'applicazione del filtro dei generi.

const BASE_URL = "https://api.rawg.io/api/games";
const API_KEY = "cccda829f4a14027ab26e1debe30d8a6";
const QUERIES = "&page_size=40&dates=2022-03-01,2023-04-01&platforms=18,1,7";
fetch(`${BASE_URL}?key=${API_KEY}${QUERIES}`)
.then(response => response.json())
.then(data => {
    const dataClone = structuredClone(data); 
    let games = dataClone.results;
    
    allGamesAA[0] = games.map((x)=>x)
    loadMore.style.display = "block";
    
    
    filterGamesByGenre(games);
    loadMore.innerHTML = `Games like this: ${similarGames.length}<br>Load More`;
    sortingbyMetacritics(similarGames);
    manifestGames(similarGames);

    // Il fetch che viene eseguito in base al pulsante "Load More" e permette di caricare ulteriori giochi, anch'esso riporterà i giochi simili al gioco visulizzato in seguito all'applicazione del filtro dei generi.

    let numMore = 1;
    loadMore.addEventListener("click", ()=>{
        similarGames = [];
        allGamesUA = [];
        numMore++;
        
        fetch(`${BASE_URL}?key=${API_KEY}&page=${numMore}&page_size=40&platforms=18%2C1%2C7`)
        .then(response => response.json())
        .then(data => {
            allGamesAA.push(data.results)
            for (let i = 0; i < allGamesAA.length; i++) {
                for (let j = 0; j < allGamesAA[i].length; j++) {
                    allGamesUA.push(allGamesAA[i][j])
                }
            }
            
            filterGamesByGenre(allGamesUA);
            loadMore.innerHTML = `Games like this: ${similarGames.length}<br>Load More`;
            sortingbyMetacritics(similarGames)
            manifestGames(similarGames)
            
        })
    })
})
