const form = document.getElementById("form");
const table = document.getElementById("table");
const DATA_KEY = "FormValues";

const columns = [
  {
    title: "Id",
    name: "id",
  },
  {
    title: "First name",
    name: "firstname",
  },
  {
    title: "Last name",
    name: "lastname",
  },
  {
    title: "Address",
    name: "address",
  },
  {
    title: "Birth date",
    name: "dateofbirth",
  },
  {
    title: "Gender",
    name: "sex",
  },
  {
    title: "",
    name: "actions",
  },
];

const localStorage = window.localStorage;
let data = JSON.parse(localStorage.getItem(DATA_KEY)) || [];

(() => {
  init();
})();

function init() {
  const theadEl = document.createElement("thead");
  const trEl = document.createElement("tr");
  const tbody = document.getElementById("tbody");

  theadEl.append(trEl);

  columns.forEach((col) => {
    const thEl = document.createElement("th");
    thEl.innerHTML = col.title;
    trEl.append(thEl);
  });

  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.id = "table-row-" + row.id;
    columns.forEach((col) => {
      const tdEl = document.createElement("td");
      if (col.name === "actions") {
        const button = document.createElement("button");
        button.innerHTML = "Delete";
        button.className = "btn btn-danger";
        button.addEventListener("click", () => deleteRecord(row.id));
        tdEl.appendChild(button);
      } else {
        tdEl.innerHTML = row[col.name];
        tdEl.addEventListener("click", () => document.getElementById("modal").innerHTML = row.notes);
        appendModal(tdEl);
      }
      tableRow.appendChild(tdEl);
    });
    tbody.appendChild(tableRow);
  });

  //append table header and table body to table
  table.appendChild(theadEl);
  table.appendChild(tbody);
}

function onSubmit(e) {
  e.preventDefault();
  const messageEl = document.getElementById("message");
  const formEl = document.getElementById("form");

  if (!validateForm(e)) {
    return;
  }

  const record = {};

  const maxId = data.map((r) => r.id)[data.length - 1] || 0;

  for (let i = 0; i < 6; i++) {
    const name = e.target[i].name;
    const value = e.target[i].value;
    record[name] = value;
  }

  record["id"] = maxId + 1;

  data.push(record);
  formEl.reset();

  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  insert(record);
  messageEl.hidden = true;
}

function insert(record) {
  const tbody = document.getElementById("tbody");
  const tableRow = document.createElement("tr");
  tableRow.id = "table-row-" + record.id;

  columns.forEach((col) => {
    const tdEl = document.createElement("td");

    if (col.name === "actions") {
      const button = document.createElement("button");
      button.innerHTML = "Delete";
      button.className = "btn btn-danger button-custom";
      button.addEventListener("click", () => deleteRecord(record.id));
      tdEl.appendChild(button);
    } else {
      tdEl.innerHTML = record[col.name];
      tdEl.addEventListener(
        "click", (e) => document.getElementById("modal").innerHTML = record.notes
      );
  appendModal(tdEl);

    }

    tableRow.appendChild(tdEl);
  });
  tbody.appendChild(tableRow);
}

function containsSpecialCharsOrNumber(str) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const numbers = /\d/;
  return specialChars.test(str) || numbers.test(str);
}

function validateForm(form) {
  const messages = [];
  const messagesContainer = document.getElementById("message");

  for (let i = 0; i < 6; i++) {
    const name = form.target[i].name;
    const value = form.target[i].value;

    if (
      name === "firstname" &&
      (!value || value.length < 3 || containsSpecialCharsOrNumber(value))
    ) {
      messages.push(
        "First name is required and must be at least 3 characters long and may only contain letters"
      );
    }

    if (
      name === "lastname" &&
      (!value || value.length < 4 || containsSpecialCharsOrNumber(value))
    ) {
      messages.push(
        "Last name is required and must be at least 4 characters long and may only contain letters"
      );
    }

    if (name === "address" && (!value || value.length > 35)) {
      messages.push(
        "Address is required cannot be more than 35 characters long"
      );
    }

    if (
      name === "dateofbirth" &&
      new Date(value).getTime() > new Date().getTime()
    ) {
      messages.push("Birth date cannot be in the future");
    }
  }

  if (messages.length > 0) {
    messagesContainer.innerHTML = "";
    messages.forEach((message) => {
      const pEl = document.createElement("p");
      pEl.innerHTML = message;
      messagesContainer.appendChild(pEl);
    });

    messagesContainer.hidden = false;

    return false;
  }

  return true;
}

function appendModal(element) {
  element.setAttribute("data-bs-toggle", "modal");
  element.setAttribute("data-bs-target", "#exampleModal");
}

function deleteRecord(id) {
  document.getElementById(`table-row-${id}`).remove();
  const newData = data.filter((r) => r.id !== id);
  data = newData;
  localStorage.setItem(DATA_KEY, JSON.stringify(newData));
}

form.addEventListener("submit", onSubmit);

