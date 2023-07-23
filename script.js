let allGamesAA = [];
let allGamesUA = [];
let defaultG = [];
const BASE_URL = "https://api.rawg.io/api/games";
const API_KEY = ""; // Inserire qui la chiave
const QUERIES = "&page_size=40&dates=2022-03-01,2023-04-01&platforms=18,1,7";
fetch(`${BASE_URL}?key=${API_KEY}${QUERIES}`)
.then(response => response.json())
.then(data => {
  const dataClone = structuredClone(data)
  
  let games = dataClone.results
  allGamesAA[0] = games.map((x)=>x);
  defaultG = games.map((x)=>x);
  loadMore.style.display = "block";
  loadMore.innerHTML = `Load More<br>(Games fetched globally: ${games.length})`;
  
  // Questa funzione serve per ricostruire globalmente il layout della pagina con i dati dell'API.
  function generation(games) {
    const searchGame = document.querySelector('#searchGame');
    searchGame.setAttribute("placeholder", `Search ${games.length} games` )
    
    
    // Ho creato questa funzione per generare in maniera relativa tutta le sezione dei negozi, infatti i negozi presenti dipendono completamente dai dati presenti sull'API.
    // Le immagini di sfondo sono state selezionate per essere univoce tra i vari negozi, ad eccezione del caso in cui ci siano solo uno o due giochi presenti fra i dati caricati, naturalmente ciascuno sfondo rappresenta un gioco presente in quel negozio specifico.
    // Per ciascun negozio c'è una lista con al massimo i primi 3 giochi più suggeriti, ogni elemento della lista è un link che riporta alla pagina del gioco con i dati di quel gioco scelto in particolare.
    // E' possibile eseguire il "Follow" di qualsiasi negozio, che è una lista di filtri per negozi, la selezione verrà conservata durante la navigazione dell'intera pagina.
    // Il nome del negozio sulle card è anch'esso un filtro per negozio.
    function storeGenerator() {
      
      gameData = [];
      
      let StoreNames = [];
      let StoreGamesData = [];
      let StoreGameNames = [];
      let StorePlatchecked = [];
      let NameYes = 0;
      let missing = [];
      let missingatindex = [];
      let matchPN = false;
      followNameRecCheck = followNameRec.map((x)=>x)
      
      for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < games[i].stores.length; j++) {
          StoreNames.push(games[i].stores[j].store.name)
        }
      }
      let checkname;    
      for (let j = 0; j < StoreNames.length; j++) {
        checkname = StoreNames[j];
        for (let i = j+1; i < StoreNames.length; i++) {
          if (StoreNames[i]==checkname) {
            StoreNames.splice(i, 1)
            i--;
          }
        }
      }
      for (let i = 0; i < StoreNames.length; i++) {
        here:
        for (let j = 0; j < games.length; j++) {
          for (let k = 0; k < games[j].stores.length; k++) {
            if (games[j].stores[k].store.name==StoreNames[i]) {
              if (StoreGameNames.length!=0) {
                for (let h = 0; h < StoreGameNames.length; h++) {
                  if (games[j].name == StoreGameNames[h]) {
                    NameYes = 1;
                    break;
                  }
                }
                if (NameYes==0) {
                  StoreGamesData.push(games[j])
                  StoreGameNames.push(games[j].name)
                  StorePlatchecked.push(StoreNames[i])
                  break here;
                } else {
                  NameYes = 0;
                }
              } else {
                StoreGamesData.push(games[j])
                StoreGameNames.push(games[j].name)
                StorePlatchecked.push(StoreNames[i])
                break here;            
              }
            }
          }        
        }
      }
      for (let i = 0; i < StoreNames.length; i++) {
        for (let j = 0; j < StorePlatchecked.length; j++) {
          if (StoreNames[i]==StorePlatchecked[j]) {
            matchPN = true;
            break;
          }
        }
        if (matchPN==false) {
          missing.push(StoreNames[i])
          missingatindex.push(i)
          
        } else {
          matchPN = false;
        }
      }
      for (let i = 0; i < missing.length; i++) {
        for (let j = 0; j < games.length; j++) {
          for (let k = 0; k < games[j].stores.length; k++) {
            if (games[j].stores[k].store.name == missing[i]) {
              StoreGamesData.splice(missingatindex[i], 0, games[j])
            }
          }
        }
      }
      
      let Gamessuggestedperstore = [];
      
      for (let i = 0; i < StoreNames.length; i++) {
        Gamessuggestedperstore.push(multiFilter(games, StoreNames[i], "stores", "store", "name", "suggestions_count"))
      }
      
      let f3Gamessuggestedperstore = [];
      for (let i = 0; i < Gamessuggestedperstore.length; i++) {
        let tArray = []
        for (let j = 0; j < 3; j++) {
          if (Gamessuggestedperstore[i][j]!=undefined) {
            tArray.push(Gamessuggestedperstore[i][j])
          }
        }
        f3Gamessuggestedperstore.push(tArray)
      }
      
      let orderCheck = []
      for (let i = 0; i < StoreNames.length; i++) {
        for (let j = 0; j < followNameRecCheck.length; j++) {
          if (StoreNames[i]==followNameRecCheck[j]) {
            orderCheck.push(StoreNames[i])
            
          }
        }
      }
      followNameRecCheck = orderCheck.map((x)=>x)
      
      gamesWrapper.innerHTML = "";
      
      for (let i = 0; i < StoreNames.length; i++) {
        let div = document.createElement ("div");
        div.classList.add("col-12", "col-md-3", "mb-4")
        div.innerHTML = 
        `
        <div class="card p-3 f-p bg--store">
        <div class="d-flex justify-content-center">
        <p data-slnk=${StoreNames[i].replaceAll(" ", "")}filterlink class="fs-4 fw-bold text-white text-decoration-underline mb-1 h--store">${StoreNames[i]}</p>
        </div>
        <div class="row justify-content-center">
        <button data-sbtn=${StoreNames[i].replaceAll(" ", "")}btn class="col-4 py-2 px-4 btn--store">${followFollowing()}</button>
        </div>
        <div class="d-flex justify-content-between border-bottom border-1 border-secondary py-1">
        <p class="mb-0 fw-bold text-white">Popular Items</p>
        <p class="mb-0 text-secondary">${Gamessuggestedperstore[i].length}</p>
        </div>
        <ul id="${StoreNames[i].replaceAll(" ", "")}Wrapper" class="list-unstyled py-1">
        </ul>
        </div>
        `
        function followFollowing() {
          if (followNameRecCheck.length!=0) {
            for (let k = 0; k < followNameRecCheck.length; k++) {
              if (followNameRecCheck[k]==StoreNames[i]) {
                followNameRecCheck.splice(k, 1)
                return `Following`;
              } else {
                return `Follow`;
              }
            }
          } else {
            return `Follow`
          }
        }
        div.children[0].style.background = `linear-gradient(rgba(24, 24, 24, 0), rgba(24, 24, 24, 0.9) 60%), url("${StoreGamesData[i].background_image}")`;
        div.children[0].style.backgroundPosition = "center";
        div.children[0].style.backgroundRepeat = "no-repeat";
        div.children[0].style.backgroundSize = "cover";
        
        if (div.children[0].children[1].children[0].innerText=="Following") {
          div.children[0].children[1].children[0].style.backgroundColor = "rgba(255, 255, 255, 1)"
          div.children[0].children[1].children[0].style.color = "black"
        }
        
        gamesWrapper.append(div);
        let ul = document.getElementById(`${StoreNames[i].replaceAll(" ", "")}Wrapper`);
        for (let j = 0; j < f3Gamessuggestedperstore[i].length; j++) {
          let li = document.createElement ("li");
          li.classList.add("pe-none");
          li.innerHTML = 
          `
          <div class="d-flex justify-content-between">
          <a href="./Game.html" data-glnk=${f3Gamessuggestedperstore[i][j].name.replaceAll(" ", "")}gameLink class="mb-0 text-white pe-auto h--game link-offset-2 link-underline-secondary">${f3Gamessuggestedperstore[i][j].name}</a>
          <p class="mb-0 text-secondary p-paragraph">${f3Gamessuggestedperstore[i][j].suggestions_count}<i class="bi bi-person text-light-emphasis"></i></p>
          </div>  
          `
          ul.append(li);
          gameData.push(f3Gamessuggestedperstore[i][j])
        }
      }
      
      let sbtn = Array.from(document.querySelectorAll("[data-sbtn]"))
      
      for (let i = 0; i < sbtn.length; i++) {
        sbtn[i].addEventListener('click', (e)=>{
          if (e.target.innerText=="Follow") {
            let li = document.createElement("li")
            li.innerHTML = 
            `
            <li id="${StoreNames[i].replaceAll(" ", "")}filterWrapper">
            <span data-slnk2=${StoreNames[i].replaceAll(" ", "")}filterlink2 class="my-3 d-flex align-items-center">
            <div class="game-icon me-1"></div> ${StoreNames[i]}
            </span>
            </li>
            
            `
            storesWrapper.append(li)
            li.children[0].children[0].children[0].style.backgroundImage = `url("${StoreGamesData[i].background_image}")`;
            e.target.style.backgroundColor = "rgba(255, 255, 255, 1)"
            e.target.style.color = "black"
            e.target.innerText="Following"
            followNameRec.push(e.target.parentElement.parentElement.children[0].children[0].innerText);
          } else {
            for (let j = 0; j < storesWrapper.children.length; j++) {
              if (storesWrapper.children[j].children[0].id==`${StoreNames[i].replaceAll(" ", "")}filterWrapper`) {
                storesWrapper.children[j].remove();
                break;
              }
            }
            e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)"
            e.target.style.color = "white"
            e.target.innerText="Follow"
            for (let k = 0; k < followNameRec.length; k++) {
              if (followNameRec[k]==e.target.parentElement.parentElement.children[0].children[0].innerText) {
                followNameRec.splice(k, 1)
                break;
              }
            }
          }
          
          let slnk2 = Array.from(document.querySelectorAll("[data-slnk2]"))
          
          for (let j = 0; j < slnk2.length; j++) {
            slnk2[j].addEventListener('click', (e)=>{
              if (e.target.dataset.slnk2 == `${StoreNames[i].replaceAll(" ", "")}filterlink2`) {
                contWrapper.children[1].innerText=`Games you can buy from ${StoreNames[i]}.`
                showGames(multiFilter(games, StoreNames[i], "stores", "store", "name", "suggestions_count"));
                StoreNameGlobal = StoreNames[i]
              }
            })
          }
          
          
        })
      }
      
      let slnk = Array.from(document.querySelectorAll("[data-slnk]"))
      
      for (let i = 0; i < slnk.length; i++) {
        slnk[i].addEventListener('click', ()=>{
          contWrapper.children[1].innerText=`Games you can buy from ${StoreNames[i]}.`
          showGames(multiFilter(games, StoreNames[i], "stores", "store", "name", "suggestions_count"));
          StoreNameGlobal = StoreNames[i]
        })
      }
      
      let glnk = Array.from(document.querySelectorAll("[data-glnk]"))
      for (let i = 0; i < glnk.length; i++) {
        glnk[i].addEventListener("click", (e)=>{
          if (e.target.innerText == gameData[i].name) {
            sessionStorage.setItem("gameData", JSON.stringify(gameData[i]));
          }
        })
        
      }
    }
    
    const storeShowWrapper = document.querySelector("#storeShowWrapper") 
    const storesWrapper = document.querySelector("#storesWrapper")
    
    
    storeShowWrapper.addEventListener('click', ()=>{
      contWrapper.children[1].innerText="The stores you can buy our games from."
      storeGenerator()
      loadMore.style.display = "none";
    })
    
    // Questi dati servono semplicemente per dare sfondi ai filtri per genere, le immagini presenti verranno selezionate in base al gioco col punteggio "metacritic" più alto per ciascun genere.
    
    let ActionImg;
    let StrategyImg;
    let RPGImg;
    let ShooterImg;
    let AdventureImg;
    let PuzzleImg;
    let RacingImg;
    let SportsImg;
    
    
    if (multiFilter2(games, "Action", "genres", "name", "metacritic")[0])
    ActionImg = multiFilter2(games, "Action", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Strategy", "genres", "name", "metacritic")[0])
    StrategyImg = multiFilter2(games, "Strategy", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "RPG", "genres", "name", "metacritic")[0])
    RPGImg = multiFilter2(games, "RPG", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Shooter", "genres", "name", "metacritic")[0])
    ShooterImg = multiFilter2(games, "Shooter", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Adventure", "genres", "name", "metacritic")[0])
    AdventureImg = multiFilter2(games, "Adventure", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Puzzle", "genres", "name", "metacritic")[0])
    PuzzleImg = multiFilter2(games, "Puzzle", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Racing", "genres", "name", "metacritic")[0]) 
    RacingImg = multiFilter2(games, "Racing", "genres", "name", "metacritic")[0].background_image
    if (multiFilter2(games, "Sports", "genres", "name", "metacritic")[0]) 
    SportsImg = multiFilter2(games, "Sports", "genres", "name", "metacritic")[0].background_image
    
    
    // questo addEventListener permette l'esecuzione del filtro in base al gioco cercato nella barra di ricerca.

    searchGame.addEventListener("input", (e)=>{
      contWrapper.children[1].innerText="Games searched by you."
      showGames(srcBar(e.target.value, games))
    })
    
    // Queste sono le varie dichiarazioni per utilizzare alcuni filtri applicabili sull'API.
    
    const clickByName = document.querySelector("#clickByName");
    const clickByNew = document.querySelector('#clickByNew');
    const clickByOld = document.querySelector('#clickByOld');
    const clickByWeek = document.querySelector("#clickByWeek");
    const clickByLastMonth = document.querySelector("#clickByLastMonth");
    const clickByLast6Months = document.querySelector("#clickByLast6Months");
    const clickByLastYear = document.querySelector("#clickByLastYear");
    
    const clickByTopAll = document.querySelector("#clickByTopAll");
    const clickByTopOfThisYear = document.querySelector("#clickByTopOfThisYear");
    const clickByTopOf2022 = document.querySelector("#clickByTopOf2022");
    
    const allGames = document.querySelector("#allGames");
    
    const clickByPlatWindows = document.querySelector("#clickByPlatWindows");
    const clickByPlatPS = document.querySelector("#clickByPlatPS");
    const clickByPlatXbox = document.querySelector("#clickByPlatXbox");
    const clickByPlatSwitch = document.querySelector("#clickByPlatSwitch");
    const clickByPlatiOS = document.querySelector("#clickByPlatiOS");
    const clickByPlatAndroid = document.querySelector("#clickByPlatAndroid");
    
    const clickByAction = document.querySelector("#clickByAction");
    const clickByStrategy = document.querySelector("#clickByStrategy");
    const clickByRPG = document.querySelector("#clickByRPG");
    const clickByShooter = document.querySelector("#clickByShooter");
    const clickByAdventure = document.querySelector("#clickByAdventure");
    const clickByPuzzle = document.querySelector("#clickByPuzzle");
    const clickByRacing = document.querySelector("#clickByRacing");
    const clickBySports = document.querySelector("#clickBySports");

    // questi addEventListener eseguono i filtri scelti applicabili sull'API.
    
    clickByName.addEventListener('click', () => {
      contWrapper.children[1].innerText="Games ordered by Name."
      window.scrollTo(0, 0);
      showGames(sortByName(games))
    })
    clickByNew.addEventListener('click', () => {
      contWrapper.children[1].innerText="Our Games, from the newest to the oldest."
      window.scrollTo(0, 0);
      showGames(sortingByNewest(games))
    })
    clickByOld.addEventListener('click', () => {
      contWrapper.children[1].innerText="Our Games, from the oldest to the newest."
      window.scrollTo(0, 0);
      showGames(sortingByOldest(games))
    })
    clickByWeek.addEventListener('click', () => {
      contWrapper.children[1].innerText="Games released this last week."
      window.scrollTo(0, 0);
      showGames(filterByLastDays(games, 7))
    })
    clickByLastMonth.addEventListener('click', () => {
      contWrapper.children[1].innerText="Games released this last month."
      window.scrollTo(0, 0);
      showGames(filterByLastDays(games, 31))
    })
    clickByLast6Months.addEventListener('click', () => {
      contWrapper.children[1].innerText="Games released these last 6 months."
      window.scrollTo(0, 0);
      showGames(filterByLastDays(games, 183))
    })
    clickByLastYear.addEventListener('click', () => {
      contWrapper.children[1].innerText="Games released this last Year."
      window.scrollTo(0, 0);
      showGames(filterByLastDays(games, 365))
    })
    
    
    clickByTopAll.addEventListener('click', ()=>{
      contWrapper.children[1].innerText="Games by highest metacritics points."
      window.scrollTo(0, 0);
      showGames(sortingbyMetacritics(games))
    })
    clickByTopOfThisYear.addEventListener('click', ()=>{
      contWrapper.children[1].innerText="Games by highest metacritics points of this year."
      window.scrollTo(0, 0);
      showGames(sortingbyMetacriticscYears(games, 2023))
    })
    clickByTopOf2022.addEventListener('click', ()=>{
      contWrapper.children[1].innerText="Games by highest metacritics points of 2022."
      window.scrollTo(0, 0);
      showGames(sortingbyMetacriticscYears(games, 2022))
    })
    
    
    allGames.addEventListener('click', ()=>{
      loadMore.style.display = "block";
      contWrapper.children[1].innerText="Browse our Games."
      window.scrollTo(0, 0);
      showGames(defaultG);
    })
    
    
    clickByPlatWindows.addEventListener('click', () => {
      platformName = "PC";
      pNameFilt(games, platformName);
    })
    clickByPlatPS.addEventListener('click', () => {
      platformName = "PlayStation 4";
      pNameFilt(games, platformName);
    })
    clickByPlatXbox.addEventListener('click', () => {
      platformName = "Xbox One";
      pNameFilt(games, platformName);
    })
    clickByPlatSwitch.addEventListener('click', () => {
      platformName = "Nintendo Switch";
      pNameFilt(games, platformName);
    })
    clickByPlatiOS.addEventListener('click', () => {
      platformName = "iOS";
      pNameFilt(games, platformName);
    })
    clickByPlatAndroid.addEventListener('click', () => {
      platformName = "Android";
      pNameFilt(games, platformName);
    })
    
    
    clickByAction.addEventListener('click', () => {
      genreName = "Action";
      gNameFilt (games, genreName);
    })
    clickByStrategy.addEventListener('click', () => {
      genreName = "Strategy";
      gNameFilt (games, genreName);
    })
    clickByRPG.addEventListener('click', () => {
      genreName = "RPG";
      gNameFilt (games, genreName);
    })
    clickByShooter.addEventListener('click', () => {
      genreName = "Shooter";
      gNameFilt (games, genreName);
    })
    clickByAdventure.addEventListener('click', () => {
      genreName = "Adventure";
      gNameFilt (games, genreName);
    })
    clickByPuzzle.addEventListener('click', () => {
      genreName = "Puzzle";
      gNameFilt (games, genreName);
    })
    clickByRacing.addEventListener('click', () => {
      genreName = "Racing";
      gNameFilt (games, genreName);
    })
    clickBySports.addEventListener('click', () => {
      genreName = "Sports";
      gNameFilt (games, genreName);
    })
    
    
    clickByAction.children[0].children[0].style.backgroundImage = `url("${ActionImg}")`
    clickByStrategy.children[0].children[0].style.backgroundImage = `url("${StrategyImg}")`
    clickByRPG.children[0].children[0].style.backgroundImage = `url("${RPGImg}")`
    clickByShooter.children[0].children[0].style.backgroundImage = `url("${ShooterImg}")`
    clickByAdventure.children[0].children[0].style.backgroundImage = `url("${AdventureImg}")`
    clickByPuzzle.children[0].children[0].style.backgroundImage = `url("${PuzzleImg}")`
    clickByRacing.children[0].children[0].style.backgroundImage = `url("${RacingImg}")`
    clickBySports.children[0].children[0].style.backgroundImage = `url("${SportsImg}")`
    
    showGames(games)
    
    // Queste operazioni servono per applicare dei filtri coi dati passati dalla pagina Game del gioco selezionato al momento.

    if (sessionStorage.getItem("genreSearched")) {
      contWrapper.children[1].innerText=`${sessionStorage.getItem("genreSearched")} Games`
      showGames(multiFilter2(games, sessionStorage.getItem("genreSearched"), "genres", "name", "metacritic"))
      genreName = sessionStorage.getItem("genreSearched")
      sessionStorage.removeItem("genreSearched")
    }
    
    if (sessionStorage.getItem("platformSearched")) {
      contWrapper.children[1].innerText=`Games you can play on ${sessionStorage.getItem("platformSearched")}.`
      showGames(multiFilter(games, sessionStorage.getItem("platformSearched"), "platforms", "platform", "name", "metacritic")) 
      platformName = sessionStorage.getItem("platformSearched")
      sessionStorage.removeItem("platformSearched")
    }
    
    if (sessionStorage.getItem("tagSearched")) {
      contWrapper.children[1].innerText=`Games by tag: ${sessionStorage.getItem("tagSearched")}.`
      showGames(multiFilter2(games, sessionStorage.getItem("tagSearched"), "tags", "name", "metacritic"))
      tagName = sessionStorage.getItem("tagSearched")
      sessionStorage.removeItem("tagSearched")
    }

    if (sessionStorage.getItem("esrbSearched")) {
      contWrapper.children[1].innerText=`Games by ESRB: ${sessionStorage.getItem("esrbSearched")}.`;
      showGames(ESRBFilter(games, sessionStorage.getItem("esrbSearched")));
      esrbName = sessionStorage.getItem("esrbSearched");
      sessionStorage.removeItem("esrbSearched");
    }
    
  }
  
  generation(games)

  // con questo addEventListener vengono eseguiti più fetch ogni volta che si clicca sul pulsante "Load More".
  
  let numMore = 1;
  loadMore.addEventListener("click", ()=>{
    allGamesUA = [];
    numMore++;
    
    copied = false
    
    fetch(`${BASE_URL}?key=${API_KEY}&page=${numMore}&page_size=40&platforms=18%2C1%2C7`)
    .then(response => response.json())
    .then(data => {
      allGamesAA.push(data.results)
      for (let i = 0; i < allGamesAA.length; i++) {
        for (let j = 0; j < allGamesAA[i].length; j++) {
          allGamesUA.push(allGamesAA[i][j])
        }
      }
      
      defaultG = allGamesUA.map((x)=>x);
      
      loadMore.innerHTML = `Load More<br>(Games fetched globally: ${allGamesUA.length})`;
      
      let fPT = Array.from(document.querySelectorAll("[data-slnk2]"));
      
      for (let i = 0; i < fPT.length; i++) {
        fPT[i].addEventListener("click", (e)=>{
          showGames(multiFilter(allGamesUA, fPT[i].innerText, "stores", "store", "name", "suggestions_count"));      
        })
      }
      
      // Questi switch servono nel caso in cui vengano caricati dei dati e vi sia attualmente applicato un filtro, con questi switch i dati caricati verranno filtrati successivamente in base al tipo di filtro utilizzato al momento.

      switch (contWrapper.children[1].innerText) {
        case "Games searched by you.":
        generation(allGamesUA);
        showGames(srcBar(searchGame.value, allGamesUA))
        break;
        case "Games ordered by Name.":
        sortByName(allGamesUA)
        generation(allGamesUA);
        break;
        case "Our Games, from the newest to the oldest.":
        sortingByNewest(allGamesUA)
        generation(allGamesUA);
        break;
        case "Our Games, from the oldest to the newest.":
        sortingByOldest(allGamesUA)
        generation(allGamesUA);
        break;
        case "Games released this last week.":
        generation(allGamesUA);
        showGames(filterByLastDays(allGamesUA, 7))
        break;
        case "Games released this last month.":
        generation(allGamesUA);
        showGames(filterByLastDays(allGamesUA, 31))
        break;
        case "Games released these last 6 months.":
        generation(allGamesUA);
        showGames(filterByLastDays(allGamesUA, 183))
        break;
        case "Games released this last Year.":
        generation(allGamesUA);
        showGames(filterByLastDays(allGamesUA, 365))
        break;
        case "Games by highest metacritics points.":
        sortingbyMetacritics(allGamesUA)
        generation(allGamesUA);
        break;
        case "Games by highest metacritics points of this year.":
        generation(allGamesUA);
        showGames(sortingbyMetacriticscYears(allGamesUA, 2023))      
        break;        
        case "Games by highest metacritics points of 2022.":
        generation(allGamesUA);
        showGames(sortingbyMetacriticscYears(allGamesUA, 2022))      
        break;
        case `Games you can buy from ${StoreNameGlobal}.`:
        generation(allGamesUA);
        showGames(multiFilter(allGamesUA, StoreNameGlobal, "stores", "store", "name", "suggestions_count"));      
        break;
        case `${genreName} Games`:
        generation(allGamesUA);
        showGames(multiFilter2(allGamesUA, genreName, "genres", "name", "metacritic"))      
        break;
        case `Games you can play on ${platformName}.`:
        generation(allGamesUA);
        showGames(multiFilter(allGamesUA, platformName, "platforms", "platform", "name", "metacritic")) 
        break;
        case `Games by tag: ${tagName}.`:
        generation(allGamesUA);
        showGames(multiFilter2(allGamesUA, tagName, "tags", "name", "metacritic")) 
        break;
        case `Games by ESRB: ${esrbName}.`:
        generation(allGamesUA);
        showGames(ESRBFilter(allGamesUA, esrbName)) 
        break;
        default:
        generation(allGamesUA);
        break;
      }      
    })
  })
})

const gamesWrapper = document.querySelector('#gamesWrapper');
const contWrapper = document.querySelector("#contWrapper");
let gameData = [];

// Le operazioni sotto riportate servono per rendere funzionale il loading spinner, esso svanirà quando il documento sarà interamente caricato.

const loader = document.createElement("div")
loader.classList.add("loader")
contWrapper.insertBefore(loader, contWrapper.children[2])

window.addEventListener("load", ()=>{
  loader.classList.add("loader-hidden")
  loader.addEventListener("transitionend", ()=>{
    if (loader!==undefined) {
      loader.remove()
    }
  })
})

// Le operazioni sotto riportate servono per rendere interattivo il ridimensionamento della lista di vari filtri.

const accMoreDates = document.querySelector("#accMoreDates")
const clickByToShow0 = document.querySelector("#clickByToShow0")
const accMoreGames = document.querySelector("#accMoreGames")
const clickByToShow1 = document.querySelector("#clickByToShow1")
const accMoreGamesT = document.querySelector("#accMoreGamesT");
const clickByToShow2 = document.querySelector("#clickByToShow2")

accMoreDates.style.height = `0px`;
accMoreGames.style.height = `0px`;
accMoreGamesT.style.height = `0px`;
accMoreDates.style.overflow = `hidden`;
accMoreGames.style.overflow = `hidden`;
accMoreGamesT.style.overflow = `hidden`;
accMoreDates.style.transition = `0.4s`;
accMoreGames.style.transition = `0.4s`;
accMoreGamesT.style.transition = `0.4s`;


clickByToShow0.addEventListener('click', ()=>{
  
  if (accMoreDates.classList.contains("now-closed")) {
    accMoreDates.classList.remove("now-closed")
    accMoreDates.classList.add("now-open")
    
    accMoreDates.style.height = 
    `
    ${
      accMoreDates.children[0].getBoundingClientRect().height + 
      accMoreDates.children[1].getBoundingClientRect().height + 
      accMoreDates.children[2].getBoundingClientRect().height + 
      accMoreDates.children[3].getBoundingClientRect().height + 16*4      
    }px
    `;
    
    clickByToShow0.innerHTML=
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-sù-50.png" width="30px" alt=""> Show Less
    </span>   
    `
  } else {
    
    accMoreDates.style.height = `0px`;
    
    accMoreDates.classList.remove("now-open")
    accMoreDates.classList.add("now-closed")
    clickByToShow0.innerHTML=
    
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-giù-50.png" width="30px" alt=""> Show All
    </span>   
    `
  }
})

clickByToShow1.addEventListener('click', ()=>{
  
  if (accMoreGames.classList.contains("now-closed")) {
    accMoreGames.classList.remove("now-closed")
    accMoreGames.classList.add("now-open")
    
    accMoreGames.style.height = 
    `
    ${
      accMoreGames.children[0].getBoundingClientRect().height + 
      accMoreGames.children[1].getBoundingClientRect().height + 
      accMoreGames.children[2].getBoundingClientRect().height + 16*3      
    }px
    `;
    
    clickByToShow1.innerHTML=
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-sù-50.png" width="30px" alt=""> Show Less
    </span>   
    `
  } else {
    accMoreGames.style.height = `0px`;
    
    accMoreGames.classList.remove("now-open")
    accMoreGames.classList.add("now-closed")
    clickByToShow1.innerHTML=
    
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-giù-50.png" width="30px" alt=""> Show All
    </span>   
    `
  }
})

clickByToShow2.addEventListener('click', ()=>{
  
  if (accMoreGamesT.classList.contains("now-closed")) {
    accMoreGamesT.classList.remove("now-closed")
    accMoreGamesT.classList.add("now-open")
    
    accMoreGamesT.style.height = 
    `
    ${
      accMoreGamesT.children[0].getBoundingClientRect().height + 
      accMoreGamesT.children[1].getBoundingClientRect().height + 
      accMoreGamesT.children[2].getBoundingClientRect().height + 
      accMoreGamesT.children[3].getBoundingClientRect().height + 16*4      
    }px
    `;
    
    clickByToShow2.innerHTML=
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-sù-50.png" width="30px" alt=""> Show Less
    </span>   
    `
  } else {
    accMoreGamesT.style.height = `0px`;
    
    accMoreGamesT.classList.remove("now-open")
    accMoreGamesT.classList.add("now-closed")
    clickByToShow2.innerHTML=
    
    `
    <span class="show-color">
    <img class="mb-2" src="./downloads/icons8-segno-a-v-giù-50.png" width="30px" alt=""> Show All
    </span>   
    `
  }
})

const loadMore = document.querySelector("#loadMore")
const backToTop = document.querySelector(".back-to-top")
const navbar = document.querySelector(".navbar")
const fotfot = document.querySelector("#fotfot")

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

// Queste variabili sono indispensabili per il funzionamento corretto di vari filtri.

let dataCopy = []
let copied = false
let genreName = "";
let platformName = "";
let tagName = "";
let esrbName = "";

// La funzione per mostrare le varie card.

function showGames(data) {
  if (copied == false) {
    dataCopy = data.map((x)=>x)
    copied = true
  }
  gameData = [];
  gamesWrapper.innerHTML = "";
  data.forEach(game => {
    let div = document.createElement('div')
    div.classList.add('col-12', 'col-sm-6', 'col-md-8', 'col-lg-6', 'col-xl-4', 'col-xxl-3', 'mb-3')
    div.innerHTML = `
    <div class="card card-game">
    <img src="${game.background_image}" class="card-img-top" alt="img-game">
    <span class="card-body">
    <div class="d-flex justify-content-between mb-2">
    <div>
    ${platformIcons(game)}
    </div>
    <div>
    <div class="metacritics">${game.metacritic!=null ? game.metacritic : "n/a"}</div>
    </div>
    </div>
    <h5 class="card-title f-p my-2">${game.name}</h5>
    <div class="d-flex position-relative">
    <button class="add--stuff small fw-bold mx-1"><i class="bi bi-plus-square me-1"></i>${game.reviews_count}</button>
    <button class="add--stuff small fw-bold mx-1"><i class="bi bi-gift"></i></button>
    <button data-vote=${game.name.replaceAll(" ", "")}Vote class="add--stuff small fw-bold mx-1"><i class="bi bi-three-dots"></i></button>
    </div>
    <div class="d-flex justify-content-between border-infos mb-3 mt-3">
    <p class="f-p">Release date:</p>
    <p class="f-p">${releaseDate(game)}</p>
    </div>
    <div class="d-flex justify-content-between border-infos mb-3">
    <p class="f-p">Genres:</p>
    <p class="f-p small text-secondary">${game.genres.map(genere => {
      return `<a href="#contWrapper" data-genre=${game.name.replaceAll(" ", "")}Genre >` + genere.name + "</a>"
    }).slice(0, 2).join(", ")}</p>
    </div>
    <div class="d-flex justify-content-between border-infos mb-3">
    <p class="f-p">ESRB:</p>
    <a href="#contWrapper" data-esrb=ESRB_rating class="f-p small">${game.esrb_rating ? game.esrb_rating.name : "Not Rated"}</a>
    </div>
    <div class="d-flex justify-content-center mt-3">
    <a href="./Game.html" class="text-decoration-none">
    <button data-game=${game.name.replaceAll(" ", "")}Page class="add--stuff px-4 py-2 fw-bold">Check this game out</button>
    </a>
    </div>
    </div>
    
    `
    gamesWrapper.append(div)
    
    gameData.push(game)
    
  });
  gamesWrapper.classList.add('expose')
  
  let genre = Array.from(document.querySelectorAll("[data-genre]"));
  for (let i = 0; i < genre.length; i++) {
    genre[i].addEventListener('click', (e)=>{
      contWrapper.children[1].innerText=`${e.target.innerText} Games`;
      showGames(multiFilter2(dataCopy, e.target.innerText, "genres", "name", "metacritic"))
      genreName = e.target.innerText
    })
  }
  
  let ESRB = Array.from(document.querySelectorAll("[data-esrb"));
  for (let i = 0; i < ESRB.length; i++) {
    ESRB[i].addEventListener('click', (e)=>{
      contWrapper.children[1].innerText=`Games by ESRB: ${e.target.innerText}.`;
      showGames(ESRBFilter(dataCopy, e.target.innerText))
      esrbName = e.target.innerText;
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
  
  
  
  let gamebtn = Array.from(document.querySelectorAll("[data-game]"))
  for (let i = 0; i < gamebtn.length; i++) {
    gamebtn[i].addEventListener('click', (e)=>{
      sessionStorage.setItem("gameData", JSON.stringify(gameData[i]));
    })
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

// La funzione per formattare la data rilascio dei vari giochi, in seguito nella pagina dei giochi ho utilizzato il metodo Date di Javascript.

function releaseDate(game) {
  let month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let Year = [];
  let Month;
  let Day;
  let i = 0;
  while (game.released[i]!="-") {
    Year.push(game.released[i])
    i++;
  }
  i++;
  for (let j = 1; j <= 12; j++) {
    if (Number(game.released[i]+game.released[i+1])==j)
    Month = month[j-1];
  }
  i+=3
  Day = Number(game.released[i]+game.released[i+1]);
  return Month + " " + Day + ", " + Year.join("")
}

// La funzione per la barra di ricerca.

function srcBar(inText, games) {
  loadMore.style.display = "block";
  let inGame = inText
  let searchedGames = [];
  let stringGame = "";
  for (let i = 0; i < games.length; i++) {
    for (let j = 0; j < inGame.length; j++) {
      if (games[i].name[j]) {
        stringGame += games[i].name[j].toString()
      }
    }
    if (inGame.toUpperCase()==stringGame.toUpperCase()) {
      searchedGames.push(games[i])
    }        
    stringGame = "";
  }
  return searchedGames; 
}

// La funzione per l'ordine alfabetico dei nomi.

function sortByName(games) {
  loadMore.style.display = "block";
  games.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return games;
}

// La funzione per il calcolo del giorno riportato sul calendario in base al numero dei giorni trascorsi prescelto.

function daysCalculator(lastDays) {
  let cDate;
  cDate = Date(cDate);
  let dMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31]
  let cDateYear = new Date(cDate).getFullYear()
  let cDateMonth = new Date(cDate).getMonth()
  let cDateDay= new Date(cDate).getDate()
  let pYear = cDateYear;
  let pDay = cDateDay;
  let pastDate;
  let i = 0;
  while (cDateMonth!=i) {
    i++;
  }
  if ((cDateDay-lastDays)==0) {
    pDay=dMonth[i-1];
    i-=2;
  } else {
    i--;
    if (dMonth[i]==undefined)
    i=11;
    while (lastDays>0) {
      lastDays-=cDateDay
      while (lastDays>0) {
        lastDays-=dMonth[i];
        i--;
        if (dMonth[i]==undefined) {
          i=11;
          pYear--;
        }
      }
    }
    pDay = -1*lastDays;
    if (pDay==-0) {
      pDay=dMonth[i];
      i-=1;
    }
  }
  if (i==11) {
    i=-1
    pYear++;
  }
  let pMonth = i+2
  pastDate = new Date (pYear + "-" +  pMonth + "-" + pDay);
  return pastDate
}

// Questi due filtri sono utlizzati per permettere di filtrare nella maniera più completa e personalizzabile possibile sull'intero API.

function multiFilter(data, value, at0, at1, at2, at3) {
  loadMore.style.display = "block";
  let gameme = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i][at0].length; j++) {
      if (data[i][at0][j][at1][at2]==value) 
      gameme.push(data[i])
    }
  }
  return gameme.sort((a, b) => b[at3] - a[at3]) 
}

function multiFilter2(data, value, at0, at1, at2) {
  loadMore.style.display = "block";
  let gameme = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i][at0].length; j++) {
      if (data[i][at0][j][at1]==value) 
      gameme.push(data[i])
    }
  }
  return gameme.sort((a, b) => b[at2] - a[at2]) 
}

// Funzione per ordinare i giochi in base al punteggio metacritic.

function sortingbyMetacritics(data) {
  loadMore.style.display = "block";
  return data.sort((a, b) => b.metacritic - a.metacritic)
}

// Funzione per filtrare i giochi in base al punteggio metacritic durante l'anno scelto.

function sortingbyMetacriticscYears(data, year) {
  loadMore.style.display = "block";
  return data.filter(e => new Date(e.released).getFullYear()==year).sort((a, b) => b.metacritic - a.metacritic)
}

// Funzione per ordinare i giochi in base alla data (decrescente).

function sortingByNewest(data) {
  loadMore.style.display = "block";
  return data.sort((a, b) => new Date(b.released) - new Date(a.released))          
}  

// Funzione per ordinare i giochi in base alla data (crescente).

function sortingByOldest(data) {
  loadMore.style.display = "block";
  return data.sort((a, b) => new Date(a.released) - new Date(b.released))          
}

// Funzione per filtrare i giochi in base al periodo di rilascio.

function filterByLastDays(data, days) {
  loadMore.style.display = "block";
  let pastDate = daysCalculator(days)
  let dataNewest = data.filter(e => (new Date(e.released)>pastDate))
  return dataNewest.sort((a, b) => new Date(b.released) - new Date(a.released))
}

// Funzione per filtrare i giochi in base alla piattaforma. Serve anche per rendere più compatto il codice.

function pNameFilt (games, pName) {
  contWrapper.children[1].innerText=`Games you can play on ${pName}.`;
  window.scrollTo(0, 0);
  showGames(multiFilter(games, pName, "platforms", "platform", "name", "metacritic"));
}

// Funzione per filtrare i giochi in base al genere. Serve anche per rendere più compatto il codice.

function gNameFilt (games, gName) {
  contWrapper.children[1].innerText=`${gName} Games`;
  window.scrollTo(0, 0);
  showGames(multiFilter2(games, gName, "genres", "name", "metacritic"));
}


let StoreNameGlobal;
let followNameRec = [];
let followNameRecCheck = [];

// Funzione per filtrare i giochi in base al valore ESRB. Permette di rendere noti anche i giochi non valutati.

function ESRBFilter(games, ESRBRating) {
  let ESRBGames = [];
  if ( ESRBRating != "Not Rated") {
    for (let i = 0; i < games.length; i++) {
      if (games[i].esrb_rating && games[i].esrb_rating.name == ESRBRating) {
        ESRBGames.push(games[i])
      }
    }
  } else {
    for (let i = 0; i < games.length; i++) {
      if (!games[i].esrb_rating) {
        ESRBGames.push(games[i])
      }    
    }
  }
  return ESRBGames;
}
