//to do
//fix bug: if same item is "removed twice" extension wont work, do some error handling to fix it



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
    titleP.classList.add('item');

    let img = document.createElement('img');
    img.src = 'delete.svg';
    div.appendChild(img);

    img.addEventListener("click", async () => {

      if (tabObjects.length === 1) {
        alert("You need to leave at least one tab");

      } else {
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
      }
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

chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);