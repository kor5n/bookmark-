const container = document.querySelector(".bookmark-div");
const btn = document.querySelector(".bookmark-btn");
let storage = [];

chrome.storage.sync.get("storage", (result) => {
  storage = result.storage || [];
  console.log("Loaded storage:", storage);

  storage.forEach((url) => {
    const newEl = document.createElement("div");
    newEl.className = "bookmark";
    newEl.innerHTML = `<span>${url.split("//")[1].split("/")[0]}</span>`;
    newEl.onclick = () => chrome.tabs.create({ url });
    container.appendChild(newEl);
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
      div.className = "bookmark";
      div.innerHTML = `<span>${url.split("//")[1].split("/")[0]}</span>`;

      div.onclick = () => chrome.tabs.create({ url });

      container.appendChild(div);

      //console.log("saving storage");
      chrome.storage.sync.set({"storage": storage });//save files
    }

    
  } catch (err) {
    console.error("Error getting active tab:", err);
  }
});
