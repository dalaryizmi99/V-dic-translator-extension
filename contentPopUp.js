//console.log("Content script is running...", chrome);

let valueInput = "";

const bodyAllPopup = document.querySelector("body");

const textInput = document.getElementById("searchTextInput");
const searchBtn = document.getElementById("searchBtn");

//trigger Enter key in search Btn
textInput.addEventListener("keypress", (e) => {
  //e.preventDefault();
  if (e.key == "Enter") {
    e.preventDefault();
    console.log("Enter key is pressed");
    searchBtn.click();
  }
});

//get value
searchBtn.addEventListener("click", async () => {
  const valueInput = document.getElementById("searchTextInput").value;
  //document.getElementById("showValue").innerHTML = valueInput;

  if (textInput && textInput.value) {
    const result = await fetch(
      `http://localhost:4000/api/translator?keywords=${valueInput}&input=en&output=vi`
    );

    //console.log(await result.json());

    const resultJson = await result.json();

    renderTranslateResultPopup(valueInput, resultJson.text);
  } else {
    console.log("Input blank");
  }

  console.log("Value is", valueInput);
});

function renderTranslateResultPopup(valueInput, valueOutput) {
  const translateResultPopupWrapper = document.createElement("div");
  translateResultPopupWrapper.id = "translateResultPopupWrapper";
  const popupResultContainer = document.createElement("div");
  popupResultContainer.classList.add = "popupResultContainer";
  popupResultContainer.innerHTML = `
  <label>
      Input:
      <span>${valueInput}</span>
    </label>
    <br>
    <label>
      Output:
      <span>${valueOutput}</span>
    </label>
  `;
  translateResultPopupWrapper.appendChild(popupResultContainer);

  bodyAllPopup.appendChild(translateResultPopupWrapper);
}
