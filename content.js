console.log("Content script is running...", chrome);

let selectionText = "";

const bodyDOM = document.querySelector("body");

//get selection text when scan
function getSelectedText() {
  let selectedText = "";

  // window.getSelection
  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  }
  // document.getSelection
  else if (document.getSelection) {
    selectedText = document.getSelection().toString();
  }
  // document.selection
  else if (document.selection) {
    selectedText = document.selection.createRange().text;
  } else return "";

  return selectedText;
}

function getSelectedTextNode() {
  let selectedText = "";

  // window.getSelection
  if (window.getSelection) {
    selectedText = window.getSelection();
  }
  // document.getSelection
  else if (document.getSelection) {
    selectedText = document.getSelection();
  }
  // document.selection
  else if (document.selection) {
    selectedText = document.selection.createRange();
  } else return "";

  return selectedText;
}

function getRangeSelectionText() {
  const selectionTextNode = getSelectedTextNode();
  const getRange = selectionTextNode.getRangeAt(0);
  const selectionRect = getRange.getBoundingClientRect();

  return selectionRect;
}

function renderTooltipTranslator(selectionTextRange, selectionText) {
  const tooltipWrapper = document.createElement("div");

  tooltipWrapper.id = "v-translator-extension";

  const tooltipIcon = document.createElement("div");
  tooltipIcon.classList.add("v-translator-extension-icon");

  tooltipIcon.innerHTML =
    '<svg width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_bazel</title><path d="M9,2l7,7L9,16,2,9Z" style="fill:#76d275"/><path d="M2,9v7l7,7V16Z" style="fill:#43a047"/><path d="M23,2l7,7-7,7L16,9Z" style="fill:#76d275"/><path d="M30,9v7l-7,7V16Z" style="fill:#43a047"/><path d="M16,9l7,7-7,7L9,16Z" style="fill:#43a047"/><path d="M16,23v7L9,23V16Z" style="fill:#00701a"/><path d="M16,23l7-7v7l-7,7Z" style="fill:#004300"/></svg>';

  tooltipWrapper.appendChild(tooltipIcon);

  //determine top,left of tooltip
  const top = selectionTextRange.top + selectionTextRange.height + "px";
  const left =
    selectionTextRange.left +
    (selectionTextRange.width / 2 - tooltipWrapper.offsetWidth / 2) +
    "px";

  tooltipWrapper.style.position = "absolute";
  tooltipWrapper.style.padding = "4px";
  tooltipIcon.style.cursor = "pointer";
  tooltipWrapper.style.top = top;
  tooltipWrapper.style.left = left;

  bodyDOM.appendChild(tooltipWrapper);

  //add eventListener when user click on translator icon
  if (tooltipWrapper) {
    tooltipWrapper.addEventListener("click", async () => {
      console.log("testlog", selectionText);
      if (selectionText.length > 0) {
        const result = await fetch(
          `http://localhost:4000/api/translator?keywords=${selectionText}&input=en&output=vi`
        );

        //console.log(await result.json());

        const resultJson = await result.json();

        renderTooltipResultTranslator(
          selectionTextRange,
          selectionText,
          resultJson.text
        );
      }
    });
  }
}

function renderTooltipResultTranslator(
  selectionTextRange,
  selectionText,
  selectionTextTranslated
) {
  const tooltipWrapper = document.createElement("div");
  tooltipWrapper.id = "translatorResultExt";
  const tooltipContainer = document.createElement("div");
  tooltipContainer.classList.add("translatorResultExtContainer");
  tooltipContainer.innerHTML = `
    <label>
      Input:
      <span>${selectionText}</span>
    </label>
    <br>
    <label>
      Output:
      <span>${selectionTextTranslated}</span>
    </label>
  `;
  tooltipWrapper.appendChild(tooltipContainer);

  // determine top, left of tooltip
  const top = selectionTextRange.top - selectionTextRange.height - 6 + "px";
  const left =
    selectionTextRange.left +
    (selectionTextRange.width / 2 - tooltipWrapper.offsetWidth / 2) +
    "px";

  tooltipWrapper.style.position = "absolute";
  tooltipWrapper.style.background = "yellow";
  tooltipWrapper.style.cursor = "pointer";
  tooltipWrapper.style.padding = "4px";
  tooltipWrapper.style.top = top;
  tooltipWrapper.style.left = left;

  bodyDOM.appendChild(tooltipWrapper);
}

//show translator icon after scan text
bodyDOM.addEventListener("mouseup", () => {
  const tooltipResult = document.querySelector("div#translatorResultExt");

  if (tooltipResult) tooltipResult.remove();

  selectionText = getSelectedText();

  if (selectionText.length > 0) {
    //console.log(selectionText);

    const selectionTextRange = getRangeSelectionText();

    renderTooltipTranslator(selectionTextRange, selectionText);

    setTimeout(() => {
      const tooltipWrapper = document.querySelector(
        "div#v-translator-extension"
      );

      if (tooltipWrapper) tooltipWrapper.remove();
    }, 3000);
  }
});
