let openTabs = [];
let tabObjects = [];

function manageTabs(tabs) {

  openTabs = tabs.slice(0);
  
  let list = document.getElementById("list");

  for (let i = 0; i < openTabs.length; i++) {
    
    const tabObj = { 
      index: i, 
      url: openTabs[i].url
    };

    tabObjects.push(tabObj);

    let div = document.createElement('div');
    div.classList.add("innerDiv");
    list.appendChild(div);
  
    let titleP = document.createElement('p');
    titleP.innerText = openTabs[i].title;
    div.appendChild(titleP);

    let button = document.createElement('button');
    let t = document.createTextNode("remove");
    button.appendChild(t);

    div.appendChild(button);

    button.addEventListener("click", async () => {

      //tabObjects.splice(tabObjects.find(a => a.index === tabObj.index) , 1);

      let indexTest = tabObjects.map(function(obj) {
        return obj.index
      }).indexOf(tabObj.index);
    
      tabObjects.splice(indexTest, 1);

      //let tab = openTabs[Math.floor(Math.random() * openTabs.length)];
      //chrome.tabs.highlight({tabs: tab.index});
    });
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

const selectRandomBtn = document.getElementById("selectRandom");

selectRandomBtn.addEventListener("click", async () => {

  let randomObj = tabObjects[Math.floor(Math.random() * tabObjects.length)];

  chrome.tabs.highlight({tabs: randomObj.index})
});

/*
const getButton = document.getElementById("getTabs");

getButton.addEventListener("click", async () => {

  chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);
}); */

chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);