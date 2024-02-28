let openTabs = [];
let tabObjects = [];
let tabGroup = [];

function manageTabs(tabs) {

  openTabs = tabs.slice();
  
  let list = document.getElementById("list");

  for (let i = 0; i < openTabs.length; i++) {
    
    const tabObj = { 
      index: i, 
      url: openTabs[i].url,
      id: openTabs[i].id
    };

    tabObjects.push(tabObj);

    let div = document.createElement('div');
    div.classList.add("innerDiv");
    list.appendChild(div);
  
    let titleP = document.createElement('p');
    titleP.innerText = openTabs[i].title;
    div.appendChild(titleP);
    titleP.classList.add('item');

    let img = document.createElement('img');
    img.src = 'delete.svg';
    div.appendChild(img);

    img.addEventListener("click", async () => {

      let indexRandom = tabObjects.map(function(obj) {
        return obj.index
      }).indexOf(tabObj.index);

      if (indexRandom === -1) {
        tabObjects.push(tabObj);
        titleP.classList.remove('removedItem');
        titleP.classList.add('item');
      
      } else {
        tabObjects.splice(indexRandom, 1);
        titleP.classList.remove('item');
        titleP.classList.add('removedItem');
      }
    });
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

function getOneTab() {
  if (tabObjects.length === 0) {
    alert("You need to leave at least one tab in the list");
  
  } else {
    const randomObj = tabObjects[Math.floor(Math.random() * tabObjects.length)];
    chrome.tabs.highlight({tabs: randomObj.index})
  }
}

async function getMultipleTabs(number) {

  if(number >= openTabs.length) {
    alert("You must select a number less than the open tabs")
  
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
