document.addEventListener("click", (e) => {
  chrome.runtime.sendMessage({
    type: "page_click",
    details: {
      //tag: e.target.tagName,
      //text: e.target.innerText.slice(0, 50),
      positon: [e.pageX, e.pageY] 
    }
  });
});