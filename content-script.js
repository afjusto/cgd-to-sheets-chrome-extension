function addCheckboxesAndListeners() {
  const elementsById = document.querySelectorAll('[id^="element"]');
  const elementsByClass = document.querySelectorAll(".headertable");

  const elements = [...elementsById, ...elementsByClass];

  let lastChecked = null;

  elements.forEach((row) => {
    if (!row.querySelector('input[type="checkbox"]')) {
      const newTd = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      if (row.classList.contains("headertable")) {
        checkbox.id = "selectAll";
      }

      newTd.appendChild(checkbox);
      row.insertBefore(newTd, row.firstChild);

      checkbox.addEventListener("click", (event) => {
        if (event.shiftKey && lastChecked) {
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]',
          );
          const start = Array.from(checkboxes).indexOf(lastChecked);
          const end = Array.from(checkboxes).indexOf(checkbox);
          const range = [start, end].sort((a, b) => a - b);

          for (let i = range[0]; i <= range[1]; i++) {
            checkboxes[i].checked = lastChecked.checked;
          }
        }

        lastChecked = checkbox;
      });
    }
  });

  const selectAll = document.getElementById("selectAll");
  if (selectAll) {
    selectAll.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      elements.forEach((row) => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox !== selectAll) {
          checkbox.checked = isChecked;
        }
      });
    });
  }
}

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      addCheckboxesAndListeners();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

addCheckboxesAndListeners();
