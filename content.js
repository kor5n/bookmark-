document.addEventListener("click", (e) => {
  chrome.runtime.sendMessage({
    type: "page_click",
    details: {
      position: [e.pageX, e.pageY] 
    }
  });
});