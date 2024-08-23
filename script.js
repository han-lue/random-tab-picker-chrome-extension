let selectedTabs = []; // Array of tabs to do the random pick

// Get the necessary HTML elements
const tabList = document.getElementById("tabList");
const messageInfo = document.getElementById("messageInfo");
const messageWarning = document.getElementById("messageWarning");
const messageTabCount = document.getElementById("messageTabCount");
const buttonPickOne = document.getElementById("buttonPickOne");
const buttonPickMultiple = document.getElementById("buttonPickMultiple");


function manageTabs(tabs) {
  let openTabs = []; 
  openTabs = tabs.slice();
  
  messageTabCount.textContent = openTabs.length; // Initialize the message

  for (let i = 0; i < openTabs.length; i++) {
    const tabObject = { // Get the info about the tab
      index: i, 
      url: openTabs[i].url,
      id: openTabs[i].id
    };

    selectedTabs.push(tabObject); // Add the tab to the array from which the random pick will be made

    // Create an HTML element for an item in tab list
    const tabListItem = document.createElement('div');
    tabList.appendChild(tabListItem);
    tabListItem.classList.add("tab-list__item");
  
    // Create an HTML element for the title of the item created above
    const tabListItemTitle = document.createElement('p');
    tabListItemTitle.innerText = openTabs[i].title;
    tabListItem.appendChild(tabListItemTitle);
    tabListItemTitle.classList.add('tab-list__item__title');

    // Handle tab list item click
    tabListItem.addEventListener("click", async () => {

      // Returns the index of the clicked tab. Returns -1 if it's not in the array
      let indexRandom = selectedTabs.map(function(obj) {
        return obj.index
      }).indexOf(tabObject.index);

      // Add or remove the clicked tab from the random selection. And change the list items style
      if (indexRandom === -1) {
        selectedTabs.push(tabObject);

        tabListItemTitle.classList.remove('tab-list__item__title--removed');
        tabListItem.classList.remove("tab-list__item--removed");
      } else {
        selectedTabs.splice(indexRandom, 1);

        tabListItem.classList.add("tab-list__item--removed");
        tabListItemTitle.classList.add('tab-list__item__title--removed');
      }

      // Change the message and buttons' styles based on how many tabs are available for the random selection
      if (selectedTabs.length === 0) {
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
        
        messageTabCount.textContent = selectedTabs.length;
      }
    });
  }  
}

// Pick a random tab and switch to it
function pickOneTab() {
    const randomTab = selectedTabs[Math.floor(Math.random() * selectedTabs.length)];
    chrome.tabs.highlight({tabs: randomTab.index})
}

// Pick multiple random tabs, create a tab group and switch to a tab in the group
async function pickMultipleTabs(numberToPick) {
  if(numberToPick >= selectedTabs.length) {
    alert("You must choose a number smaller than the selected tabs")
  
  } else if(numberToPick === 1) {
    pickOneTab();
  
  } else {
    let tabGroup = [];

    for (let i = 1; i <= numberToPick; i++) {
      let index = Math.floor(Math.random() * selectedTabs.length);
      const randomTab = selectedTabs[index];
      tabGroup.push(randomTab);
      selectedTabs.splice(index, 1);
    }

    const tabIds = tabGroup.map(({ id }) => id); // Get the IDs of the picked tabs

    // Create a Chrome tab group with the picked tabs and switch to the first tab in the group 
    const group = await chrome.tabs.group({tabIds}); 
    await chrome.tabGroups.update(group, { color: 'blue', title: 'PICKED TABS' });  
    await chrome.tabGroups.move(group, {index: -1});
    const firstTab = await chrome.tabs.get(tabIds[0]);
    await chrome.tabs.highlight({tabs: firstTab.index});
  }
}

// Handle "pick one" button click
buttonPickOne.addEventListener("click", async () => {
  pickOneTab()
});

// Handle "pick multiple" button click
buttonPickMultiple.addEventListener("click", async () =>{
  const numberToPick = Number(window.prompt("How many tabs do hou want to select?", "2")); // User input on how many random tabs to pick
  pickMultipleTabs(numberToPick);
});

// Handle error
function onError(error) {
  console.error(`Error: ${error}`);
}

// Get the open tabs from the current Chrome window
chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);
