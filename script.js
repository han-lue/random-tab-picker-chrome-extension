let openTabs = []

function manageTabs(tabs) {

  openTabs = tabs.slice(0);

  //let tab = tabs[Math.floor(Math.random()*tabs.length)];

  //chrome.tabs.highlight({tabs: tab.index})
  
  let list = document.getElementById("list");

  for (let i = 0; i < openTabs.length; ++i) {
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

        let tab = openTabs[Math.floor(Math.random() * openTabs.length)];
        chrome.tabs.highlight({tabs: tab.index});

      });

  }

}

function onError(error) {
  console.error(`Error: ${error}`);
}


const button = document.querySelector("button");

button.addEventListener("click", async () => {
  let tab = openTabs[Math.floor(Math.random() * openTabs.length)];

  chrome.tabs.highlight({tabs: tab.index})

});


chrome.tabs.query({ currentWindow: true }).then(manageTabs, onError);