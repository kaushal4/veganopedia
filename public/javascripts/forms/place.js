let value = 0;
let i = 1;
$("#food-options-button").click(() => {
  value = value + parseInt($("#food-options").val());
  for (; i < value + 1; i++) {
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "text";
    input.name = `item${i}`;
    input.placeholder = `food item ${i}`;
    label.for = "item" + i;
    label.innerHTML = `Food Item ${i}`;
    div.appendChild(label);
    div.appendChild(input);
    document.getElementById("food-container").appendChild(div);
  }
});
