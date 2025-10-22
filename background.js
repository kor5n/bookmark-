import {Bookmark} from "./bookmarkClass.js"

let clicked = false;
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
    //console.log(sender, msg);
    let clicked = await chrome.storage.sync.get("clicked");
    console.log(clicked);
    if (clicked.clicked === true){
      try{
        storage = await chrome.storage.sync.get("storage");
      }catch{
        await chrome.storage.sync.set({"storage":[]});
        storage = await chrome.storage.sync.get("storage");
      }
      //console.log("message:",msg);
      let newBookmark = new Bookmark(tab.url.split("//")[1].split("/")[0].replace("www.", ""), tab.url, msg.details[0], msg.details[1]);
      storage.storage.push(newBookmark);
      console.log("current storage", storage);
      await chrome.storage.sync.set({"storage": storage});
      await chrome.storage.sync.set({"clicked":false});
    }
  }
  chrome.runtime.onMessage.removeListener(msg, sender);
});

console.log(chrome.tabs.onActivated);