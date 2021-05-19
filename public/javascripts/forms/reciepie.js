let value = 0;
let i = 1;
$("#food-options-button").click(() => {
  value = value + parseInt($("#food-options").val());
  for (; i < value + 1; i++) {
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "text";
    input.name = `insturction${i}`;
    input.placeholder = `Instruction ${i}`;
    label.for = "instruction" + i;
    label.innerHTML = `Instruction ${i}`;
    div.appendChild(label);
    div.appendChild(input);
    document.getElementById("reciepie-container").appendChild(div);
  }
});
