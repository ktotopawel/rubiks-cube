const ui = document.createElement("div");
ui.classList.add("ui");

const style = document.createElement("style");
document.head.appendChild(style);

const scrambleButton = document.createElement("button");
scrambleButton.innerText = "Pomieszaj";
scrambleButton.classList.add("btn", "btn-scramble");
ui.appendChild(scrambleButton);

const autoSolveButton = document.createElement("button");
autoSolveButton.innerText = "Rozwiąż";
autoSolveButton.classList.add("btn", "btn-solve");
ui.appendChild(autoSolveButton);

const renderUi = () => {
  document.body.appendChild(ui);
  return {
    scramble: scrambleButton,
    solve: autoSolveButton,
  };
};

export default renderUi;
