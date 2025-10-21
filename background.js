import {Bookmark} from "./bookmarkClass.js"

let storage = []
let clicked = false

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId);
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
    //console.log(sender, msg);
    console.log("Click detected on position", msg.details);
    let clicked = await chrome.storage.sync.get({"clicked": clicked});
    console.log(clicked);
    if (clicked === true){
      try{
      storage = await chrome.storage.sync.get({"storage": storage});
    }catch{
      storage = [];
    }
    chrome.storage.sync.set({"clicked":false});
    }
    
    console.log(tab);

    let newBookmark = new Bookmark(tab.url.split("//")[1].split("/")[0].replace("www.", ""), tab.url, msg.details[0], msg.details[1]);
    storage.push(newBookmark);
    console.log("current storage", storage);
  }
  chrome.runtime.onMessage.removeListener(msg, sender);
});

console.log(chrome.tabs.onActivated);