import {Bookmark} from "./bookmarkClass.js"

const container = document.querySelector(".bookmark-div");
const btn = document.querySelector(".bookmark-btn");
let storage = [];

//reseting temporary storage
const reset = async () => {
  await chrome.storage.sync.set({"goto":[]});
  await chrome.storage.sync.set({"clicked": false})
}
reset();

const listener = async (curDiv, index) => {
  curDiv.querySelector(".rm-btn").addEventListener("click", async () => {
    //console.log("remove button clicked");
    storage.remove(document.querySelectorAll(".bookmark")[index]);
    curDiv.remove();
    await chrome.storage.sync.set({"storage":storage});
}); 
};

const syncStorage = async () => {
  await chrome.storage.sync.get("storage", async (result) => {
  storage = result.storage || [];
  console.log("Loaded storage:", storage);
  let goto = [];
  storage.forEach((bookmark, index) => {
    const newEl = document.createElement("div");
    newEl.innerHTML = `<div class="bookmark">${bookmark.title}</div><button class="rm-btn">x</button>`;
    container.appendChild(newEl);
    //console.log(document);
    goto.push([bookmark.x, bookmark.y]);
    document.querySelectorAll(".bookmark")[index].onclick = () => chrome.tabs.create(bookmark.url);
    listener(newEl, index);
  });
  await chrome.storage.sync.set({"goto" : goto});
});
}

syncStorage();

btn.addEventListener("click", async () => {
  await chrome.storage.sync.set({"clicked" : true});
  /*console.log(storage);
  try {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (!tab || !tab.url) {
      console.log("Cannot access the tab URL. Make sure host permissions match.");
      return;
    }

    const url = tab.url;

    if (!storage.includes(url)) {
      storage.push(url);
      const div = document.createElement("div");
      div.innerHTML = `<div class="bookmark">${url.split("//")[1].split("/")[0].replace("www.", "")}</div><button class="rm-btn">x</button>`;

      container.appendChild(div);
      document.querySelectorAll(".bookmark")[storage.length -1].onclick = () => chrome.tabs.create({ url });

      listener(div);

      //console.log("saving storage");
      chrome.storage.sync.set({"storage": storage });//save files
    }

    
  } catch (err) {
    console.error("Error getting active tab:", err);
  }*/
});
