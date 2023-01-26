const state = {
  todos: [],
  iDs: [],
};

//******** HELPER FUNCTIONS ********

function $(qS) {
  return document.querySelector(qS);
}
function $$(id) {
  return document.getElementById(id);
}
function createID(existingIDs) {
  let id = "#";
  while (id.length < 5) {
    id += Math.floor(Math.random() * 9);
  }
  const exist = existingIDs.find((el) => el === id);
  if (exist === undefined) {
    state.iDs.push(id);
    return id;
  } else {
    createID(existingIDs);
  }
}
function responseHandler(response) {
  const footer = $("footer");
  let msg = "";

  if (response === "success") {
    msg = "Daten wurden erfolgreich gespeichert";

    footer.innerText = msg;
    footer.classList.add("success");

    setTimeout(() => {
      footer.innerText = "";
      footer.classList.remove("success");
    }, 2000);

    return "success";
  }
  if (response === "empty") {
    msg = "Keine Daten vorhanden";

    footer.innerText = msg;
    footer.classList.add("error");

    setTimeout(() => {
      footer.innerText = "";
      footer.classList.remove("error");
    }, 2000);

    return "storage empty";
  }
}
function validation(input) {
  if (input.length < 5) {
    alert("Bitte gib einen längeren Namen ein");
    return false;
  }
  return true;
}
//***********************************

function updateLocalStorage() {
  Object.keys(state).forEach((key) => {
    localStorage.setItem(key, JSON.stringify(state[key]));
  });
  return console.info(responseHandler("success"));
}
function loadStorageData() {
  if (localStorage.length === 0) {
    console.warn(responseHandler("empty"));
    return [];
  }
  const todos = JSON.parse(localStorage.getItem("todos"));
  return todos;
}
function buildTodoComponent(todoData) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const todoDescription = document.createTextNode(todoData.description);

  checkbox.type = "checkbox";
  checkbox.name = "todo";
  checkbox.id = todoData.id;
  $(".todo-list").appendChild(li);
  li.appendChild(checkbox);
  li.appendChild(label);
  li.classList.add("todo");
  label.setAttribute("for", todoData.id);
  label.appendChild(todoDescription);

  checkbox.checked = todoData.done;
  return li;
}
function render() {
  $(".todo-list").innerHTML = "";
  state.todos.forEach((todo) => {
    $(".todo-list").insertBefore(
      buildTodoComponent(todo),
      $(".todo-list").childNodes[0]
    );
  });
}
function addTodo(event) {
  event.preventDefault();

  const todo = $$("new-todo").value;

  if (!validation(todo)) return false;

  const currentId = createID(state.iDs);
  state.todos.push({
    id: currentId,
    description: todo,
    done: false,
  });

  updateLocalStorage();
  render();

  $$("new-todo").focus();
}

state.todos = loadStorageData();

//************ EVENT LISTENERS ************/

document.addEventListener("DOMContentLoaded", render);
document.addEventListener("submit", (event) => {
  addTodo(event);
  event.target.reset();
});
$("input").addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    addTodo(event);
    event.target.parentElement.reset();
  }
});
$(".todo-list").addEventListener("change", (event) => {
  state.todos.find((el) => {
    if (el.id === event.target.id) {
      el.done = true;
    }
  });

  updateLocalStorage();
  state.todos = loadStorageData();
});
$(".remove-todos").addEventListener("click", () => {
  const doneTodos = state.todos.filter((todo) => todo.done === true);
  if (doneTodos.length === 0) return console.warn(responseHandler("empty"));
  for (let i = state.todos.length - 1; i >= 0; i--) {
    if (state.todos[i].done === true) {
      state.todos.splice(i, 1);
    }
  }
  updateLocalStorage();
  render();
});
$(".filter-selection").addEventListener("change", (event) => {
  const todos = state.todos;
  const doneTodos = todos.filter((todo) => todo.done === true);
  const openTodos = todos.filter((todo) => todo.done === false);

  console.log("all:", todos);
  console.log("done:", doneTodos);
  console.log("open:", openTodos);

  if (event.target.id === "filter-all") {
    doneTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.remove("invisible");
    });
    openTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.remove("invisible");
    });
  }
  if (event.target.id === "filter-open") {
    doneTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.add("invisible");
    });
    openTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.remove("invisible");
    });
  }
  if (event.target.id === "filter-done") {
    doneTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.remove("invisible");
    });
    openTodos.forEach((todo) => {
      $$(todo.id).parentElement.classList.add("invisible");
    });
  }
});
