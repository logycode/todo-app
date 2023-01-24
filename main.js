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
document.querySelector(".remove-todos").addEventListener("click", () => {
  const todos = Array.from(document.getElementsByName("todo"));

  if (todos.length === 0) {
    alert("Du hast noch keine todos angelegt");
    return false;
  }

  const checkedTodos = todos.filter((todo) => todo.checked === true);
  checkedTodos.forEach((todo) => {
    document.getElementById(todo.id).parentElement.remove();
    iDs.find((el, i) => {
      if (el === todo.id) {
        iDs.splice(i, 1);
      }
    });
  });
});
document
  .querySelector(".filter-selection")
  .addEventListener("change", (event) => {
    const todos = Array.from(document.getElementsByName("todo"));
    const checkedTodos = todos.filter((todo) => todo.checked === true);
    const openTodos = todos.filter((todo) => todo.checked === false);

    if (event.target.id === "filter-all") {
      checkedTodos.forEach((todo) => {
        todo.parentElement.classList.remove("invisible");
      });
      openTodos.forEach((todo) => {
        todo.parentElement.classList.remove("invisible");
      });
    }
    if (event.target.id === "filter-open") {
      checkedTodos.forEach((todo) => {
        todo.parentElement.classList.add("invisible");
      });
      openTodos.forEach((todo) => {
        todo.parentElement.classList.remove("invisible");
      });
    }
    if (event.target.id === "filter-done") {
      checkedTodos.forEach((todo) => {
        todo.parentElement.classList.remove("invisible");
      });
      openTodos.forEach((todo) => {
        todo.parentElement.classList.add("invisible");
      });
    }
  });
