// todo refactor html to make the whole list entry clickablenpm i serve --save-dev

let todos = [];
const ul = $("#todo-list");
const todoInput = $("#todo-description");
const addButton = $(".add-todo");
const deleteAllButton = $(".delete-all");
const deleteDoneButton = $(".remove-todos");
const filterSelection = $(".filter-selection");

// ** helper functions ** //

function $(element) {
  return document.querySelector(element);
}
function $$(element) {
  return document.getElementById(element);
}
function userFeedback(messageType) {
  if (messageType === "duplicate")
    return "Du hast schon eine identische Aufgabe eingetragen";
}
const normalizedString = (string) => {
  return string.replaceAll(" ", "").toLocaleLowerCase();
};
const isDuplicate = (todo) => {
  for (todoItem of todos) {
    if (
      normalizedString(todoItem.description) ===
      normalizedString(todo.description)
    ) {
      return true;
    }
  }
  return false;
};

// ** data related functions ** //

async function fetchTodos() {
  await fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      todos = data;
    });
}

async function addTodo(todo) {
  if (isDuplicate(todo)) {
    userFeedback("duplicate");
    return false;
  }

  await fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then((data) => {
      todos.push(data);
    });
}

// ** render function ** //

function render() {
  ul.innerHTML = "";
  todoInput.value = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const todoContent = document.createTextNode(todo.description);
    li.appendChild(checkbox);
    li.appendChild(label);
    label.appendChild(todoContent);
    ul.appendChild(li);
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", todo.id);
    label.setAttribute("for", todo.id);
    if (todo.done) checkbox.setAttribute("checked", "");
  });

  todoInput.focus();
}

// ** event listeners ** //

document.addEventListener("DOMContentLoaded", async () => {
  await fetchTodos();
  render();
  $$("filter-all").setAttribute("checked", "");
});

todoInput.addEventListener("keyup", () => {
  if (todoInput.value.length > 0) {
    addButton.removeAttribute("disabled", "");
  } else {
    addButton.setAttribute("disabled", "");
  }
});

addButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const todo = {
    description: todoInput.value,
    done: false,
  };
  await addTodo(todo);
  render();
});

deleteAllButton.addEventListener("click", () => {
  const fetches = [];

  todos.forEach((todoItem) => {
    fetches.push(
      fetch(`http://localhost:4730/todos/${todoItem.id}`, {
        method: "DELETE",
      })
    );
  });
  Promise.all(fetches).then(() => {
    todos = [];
    render();
  });
});

ul.addEventListener("change", (event) => {
  fetch(`http://localhost:4730/todos/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      done: event.target.checked,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const currentTodo = todos.find((item) => item.id === data.id);
      currentTodo.done = !currentTodo.done;
    });
});

deleteDoneButton.addEventListener("click", () => {
  // todo filter needs to be reset when done tasks are deleted

  const fetches = [];

  todos.forEach((todoItem) => {
    if (todoItem.done === true) {
      fetches.push(
        fetch(`http://localhost:4730/todos/${todoItem.id}`, {
          method: "DELETE",
        })
      );
    }
  });

  Promise.all(fetches).then(async () => {
    await fetchTodos();
    render();
  });
});

filterSelection.addEventListener("change", (event) => {
  const doneTodos = todos.filter((todoItem) => todoItem.done === true);
  const openTodos = todos.filter((todoItem) => todoItem.done === false);

  if (event.target.id === "filter-all") {
    doneTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.remove("invisible");
    });
    openTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.remove("invisible");
    });
  }
  if (event.target.id === "filter-open") {
    doneTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.add("invisible");
    });
    openTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.remove("invisible");
    });
  }
  if (event.target.id === "filter-done") {
    doneTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.remove("invisible");
    });
    openTodos.forEach((todoItem) => {
      $$(todoItem.id).parentElement.classList.add("invisible");
    });
  }
});
