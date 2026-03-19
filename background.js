import {Bookmark} from "./bookmarkClass.js"

let tab;
let storage;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab && /^https?:/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});

// Receive messages from content script
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === "page_click") {
    let clicked = await chrome.storage.sync.get();
    //console.log(clicked);
    if (clicked.clicked === true){
      try{
        const data = await chrome.storage.sync.get();
        storage = data.storage;  
      }catch{
        await chrome.storage.sync.set({"storage":[]});
        const data = await chrome.storage.sync.get("storage");
        storage = data.storage;  
      }

      console.log(tab.url);
      const newBookmark = new Bookmark(tab.url.split("//")[1].split("/")[0].replace("www.", ""), tab.url, msg.details.position[0], msg.details.position[1]);
      console.log(newBookmark);
      console.log(storage);
      storage.push(newBookmark);
      await chrome.storage.sync.set({"storage": storage});
      await chrome.storage.sync.set({"clicked":false});
      console.log("new storage: ", await chrome.storage.sync.get());
    }
  }
  chrome.runtime.onMessage.removeListener(msg, sender);
});

//console.log(chrome.tabs.onActivated);