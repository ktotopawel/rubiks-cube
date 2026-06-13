const ui = document.createElement("div");
ui.classList.add("ui");

const scrambleButton = document.createElement("button");
scrambleButton.innerText = "Pomieszaj";
scrambleButton.classList.add("btn");
ui.appendChild(scrambleButton);

const autoSolveButton = document.createElement("button");
autoSolveButton.innerText = "Rozwiąż";
autoSolveButton.classList.add("btn");
ui.appendChild(autoSolveButton);

const renderUi = () => {
  document.body.appendChild(ui);
  return {
    scramble: scrambleButton,
    solve: autoSolveButton,
  };
};

export default renderUi;
