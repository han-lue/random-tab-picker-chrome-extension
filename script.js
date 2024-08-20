let openTabs = [];
let tabObjects = [];
let tabGroup = [];

function manageTabs(tabs) {

  openTabs = tabs.slice();
  
  let list = document.getElementById("list");

  let availableTabsText = document.getElementById("availableTabs");
  let warningMessage = document.getElementById("warningMessage");
  let span = document.getElementById("span");
  let buttonOne = document.getElementById("selectOne");
  let buttonMultiple = document.getElementById("selectMultiple");
  
  span.textContent = openTabs.length;

  availableTabsText.classList.add('visible');
  warningMessage.classList.add('hidden');

  for (let i = 0; i < openTabs.length; i++) {
    
    const tabObj = { 
      index: i, 
      url: openTabs[i].url,
      id: openTabs[i].id
    };

    tabObjects.push(tabObj);

    let div = document.createElement('div');
    div.classList.add("inner-div");
    list.appendChild(div);
  
    let titleP = document.createElement('p');
    titleP.innerText = openTabs[i].title;
    div.appendChild(titleP);
    titleP.classList.add('item');

    div.addEventListener("click", async () => {

      let indexRandom = tabObjects.map(function(obj) {
        return obj.index
      }).indexOf(tabObj.index);

      if (indexRandom === -1) {
        tabObjects.push(tabObj);
        titleP.classList.remove('removed-item');
        div.classList.remove("inner-div-removed");
        titleP.classList.add('item');
      
      } else {
        tabObjects.splice(indexRandom, 1);
        div.classList.add("inner-div-removed");
        titleP.classList.remove('item');
        titleP.classList.add('removed-item');
      }

      if (tabObjects.length === 0) {
        availableTabsText.classList.add('hidden');
        availableTabsText.classList.remove('visible');

        warningMessage.classList.add('visible');
        warningMessage.classList.remove('hidden');

        buttonOne.setAttribute("disabled", "");
        buttonMultiple.setAttribute("disabled", "");

      } else {
        availableTabsText.classList.add('visible');
        availableTabsText.classList.remove('hidden');

        warningMessage.classList.add('hidden');
        warningMessage.classList.remove('visible');

        buttonOne.removeAttribute("disabled", "");
        buttonMultiple.removeAttribute("disabled", "");

        span.textContent = tabObjects.length;
      }
    });
  }  
}

function onError(error) {
  console.error(`Error: ${error}`);
}

function getOneTab() {
    const randomObj = tabObjects[Math.floor(Math.random() * tabObjects.length)];
    chrome.tabs.highlight({tabs: randomObj.index})
}

async function getMultipleTabs(number) {

  if(number >= openTabs.length) {
    alert("You must select a number less than the available tabs")
  
  } else if(number === 1) {
    getOneTab();
  
  } else {
    let copyTabObjects = tabObjects.slice();

    for (let i = 1; i <= number; i++) {

      let index = Math.floor(Math.random() * copyTabObjects.length);

      const randomTabObj = copyTabObjects[index];
      tabGroup.push(randomTabObj);

      copyTabObjects.splice(index, 1);
    }

    const tabIds = tabGroup.map(({ id }) => id);

    const group = await chrome.tabs.group({tabIds});
    await chrome.tabGroups.update(group, { color: 'purple', title: 'SELECTED' });  
    await chrome.tabGroups.move(group, {index: -1});

    const firstTab = await chrome.tabs.get(tabIds[0]);
    await chrome.tabs.highlight({tabs: firstTab.index});
  }

}

const selectOneBtn = document.getElementById("selectOne");

selectOneBtn.addEventListener("click", async () => {
  getOneTab()
  
});

const selectMultipleBtn = document.getElementById("selectMultiple");

selectMultipleBtn.addEventListener("click", async () =>{

  const number = Number(window.prompt("How many tabs do hou want to select?", "2"));

  getMultipleTabs(number);

});

chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);
