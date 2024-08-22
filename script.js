let openTabs = [];
let tabObjects = [];
let tabGroup = [];

let tabList = document.getElementById("tabList");

let messageInfo = document.getElementById("messageInfo");
let messageWarning = document.getElementById("messageWarning");
let messageTabCount = document.getElementById("messageTabCount");

let buttonPickOne = document.getElementById("buttonPickOne");
let buttonPickMultiple = document.getElementById("buttonPickMultiple");


function manageTabs(tabs) {

  openTabs = tabs.slice();
  
  messageTabCount.textContent = openTabs.length;

  for (let i = 0; i < openTabs.length; i++) {
    
    const tabObj = { 
      index: i, 
      url: openTabs[i].url,
      id: openTabs[i].id
    };

    tabObjects.push(tabObj);

    chrome.action.setBadgeText({text: tabObjects.length.toString()});

    let tabListItem = document.createElement('div');
    tabListItem.classList.add("tab-list__item");
    tabList.appendChild(tabListItem);
  
    let tabListItemTitle = document.createElement('p');
    tabListItemTitle.innerText = openTabs[i].title;
    tabListItem.appendChild(tabListItemTitle);
    tabListItemTitle.classList.add('tab-list__item__title');

    tabListItem.addEventListener("click", async () => {

      let indexRandom = tabObjects.map(function(obj) {
        return obj.index
      }).indexOf(tabObj.index);

      if (indexRandom === -1) {
        tabObjects.push(tabObj);

        tabListItemTitle.classList.remove('tab-list__item__title--removed');
        tabListItem.classList.remove("tab-list__item--removed");
      
      } else {
        tabObjects.splice(indexRandom, 1);

        tabListItem.classList.add("tab-list__item--removed");
        tabListItemTitle.classList.add('tab-list__item__title--removed');
      }

      if (tabObjects.length === 0) {
        messageInfo.classList.add('message--hidden');

        messageWarning.classList.add('message--visible');
        messageWarning.classList.remove('message--hidden');

        buttonPickOne.setAttribute("disabled", "");
        buttonPickMultiple.setAttribute("disabled", "");

      } else {
        messageInfo.classList.remove('message--hidden');

        messageWarning.classList.add('message--hidden');
        messageWarning.classList.remove('message--visible');

        buttonPickOne.removeAttribute("disabled", "");
        buttonPickMultiple.removeAttribute("disabled", "");

        messageTabCount.textContent = tabObjects.length;
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

buttonPickOne.addEventListener("click", async () => {
  getOneTab()
  
});


buttonPickMultiple.addEventListener("click", async () =>{

  const number = Number(window.prompt("How many tabs do hou want to select?", "2"));

  getMultipleTabs(number);

});

chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);
