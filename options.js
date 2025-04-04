document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("scriptUrl", (data) => {
    document.getElementById("scriptUrl").value = data.scriptUrl || "";
  });

  document.getElementById("save").addEventListener("click", () => {
    const scriptUrl = document.getElementById("scriptUrl").value;
    chrome.storage.sync.set({ scriptUrl }, () => {
      document.getElementById("status").textContent = "Saved!";
      setTimeout(
        () => (document.getElementById("status").textContent = ""),
        2000,
      );
    });
  });
});
