chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getSelectedRows,
    },
    (results) => {
      sendDataToGoogleSheet(results[0].result);
    },
  );
});

function getSelectedRows() {
  const selectedRows = [];
  const checkboxes = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked'),
  ).sort(() => -1);

  const formatDate = (value) => value.replace(/-/g, "/");
  const formatMoney = (value) => value.replace(/\./g, "").replace(/,/g, ".");
  const cleanDescription = (value) =>
    value
      .toLowerCase()
      .split(" ")
      .map((word) =>
        ["COMPRA", "COMPRAS", "COBRANCA"].includes(word.toUpperCase())
          ? ""
          : word,
      )
      .filter((word) => word !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  checkboxes.forEach((checkbox) => {
    if (checkbox.id === "selectAll") return;

    const row = checkbox.closest("tr");
    if (row) {
      const [, date, description, debit, credit] = row.querySelectorAll("td");
      const rowData = {
        date: formatDate(date.innerText.trim()),
        description: cleanDescription(description.innerText.trim()),
        debit: formatMoney(debit.innerText.trim()),
        credit: formatMoney(credit.innerText.trim()),
      };
      selectedRows.push(rowData);
    }
  });

  return selectedRows;
}

async function sendDataToGoogleSheet(data) {
  const { scriptUrl } = await chrome.storage.sync.get("scriptUrl");

  if (!scriptUrl) {
    console.error("No Google Script URL found in storage.");
    return;
  }

  const payload = JSON.stringify(data);

  fetch(scriptUrl, {
    redirect: "follow",
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    console.log("Data sent to Google Sheet successfully");
  });
}
