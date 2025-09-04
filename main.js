  const container = document.querySelector(".bookmark-div");
  const btn = document.querySelector(".bookmark-btn");

  btn.addEventListener("click", async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      console.log(tab);

      if (!tab || !tab.url) {
        console.log("Cannot access the tab URL. Make sure host permissions match.");
        return;
      }

      const url = tab.url;

      const div = document.createElement("div");
      div.className = "bookmark";
      div.innerHTML = `<span>${url.split("//")[1]}</span>`;

      div.onclick = () => chrome.tabs.create({ url });

      container.appendChild(div);
    } catch (err) {
      console.error("Error getting active tab:", err);
    }
});
