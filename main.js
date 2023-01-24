const iDs = [];
const checkboxAttributes = {
  id: "",
  type: "checkbox",
  name: "todo",
};
const labelAttributes = {
  for: "",
};

const todoSection = document.querySelector(".todo-list");
const todoInput = document.getElementById("new-todo");

function addTodo(event) {
  event.preventDefault();

  const todo = todoInput.value;

  if (todo.length < 5) {
    alert("Bitte gib einen längeren Namen ein");
    return false;
  }

  const currentId = createID(iDs);
  const div = document.createElement("div");
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const todoText = document.createTextNode(todo);

  todoSection.appendChild(div);
  div.appendChild(checkbox);
  div.appendChild(label);
  label.appendChild(todoText);

  setAttributes(checkbox, checkboxAttributes, currentId);
  setAttributes(label, labelAttributes, currentId);
  div.classList.add("todo");

  todoInput.value = "";
  todoInput.focus();
}

// * Helper Functions *

function setAttributes(element, attributes, value) {
  Object.keys(attributes).forEach((attr, key) => {
    if (attr === "id" || attr === "for") {
      attributes[attr] = value;
    }
    element.setAttribute(attr, attributes[attr]);
  });
}

function createID(existingIDs) {
  let id = "#";
  while (id.length < 5) {
    id += Math.floor(Math.random() * 9);
  }
  const exist = existingIDs.find((el) => el === id);
  if (exist === undefined) {
    iDs.push(id);
    return id;
  } else {
    createID(existingIDs);
  }
}

document.addEventListener("submit", addTodo);
document.addEventListener("keyup", (key) => {
  if (key.code === "Enter") addTodo();
});
