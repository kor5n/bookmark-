const container = document.querySelector(".bookmark-div");
const btn = document.querySelector(".bookmark-btn");
let storage = [];

const addBtnListener = (curDiv) => {
  curDiv.querySelector(".rm-btn").addEventListener("click", () => {
    console.log("remove button clicked");
    storage.splice(storage.length-1, 1);
    curDiv.remove();
    chrome.storage.sync.set({"storage":storage});
      })
}

chrome.storage.sync.get("storage", (result) => {
  storage = result.storage || [];
  console.log("Loaded storage:", storage);

  storage.forEach((url) => {
    const newEl = document.createElement("div");
    newEl.innerHTML = `<div class="bookmark">${url.split("//")[1].split("/")[0]}</div><button class="rm-btn">x</button>`;
    container.appendChild(newEl);
    document.querySelectorAll(".bookmark")[storage.length -1].onclick = () => chrome.tabs.create({ url });
    addBtnListener(newEl);
  });
});


btn.addEventListener("click", async () => {
  console.log(storage);
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
      div.innerHTML = `<div class="bookmark">${url.split("//")[1].split("/")[0]}</div><button class="rm-btn">x</button>`;

      container.appendChild(div);
      document.querySelectorAll(".bookmark")[storage.length -1].onclick = () => chrome.tabs.create({ url });

      addBtnListener(div);

      //console.log("saving storage");
      chrome.storage.sync.set({"storage": storage });//save files
    }

    
  } catch (err) {
    console.error("Error getting active tab:", err);
  }
});
