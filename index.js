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
    name: "actions"
  }
];

const localStorage = window.localStorage;
const data = JSON.parse(localStorage.getItem(DATA_KEY)) || [];

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
    appendModal(tableRow)
    tableRow.addEventListener("click", (e) => {
        e.stopPropagation()
        document.getElementById("modal").innerHTML = row.notes
    })
    tableRow.id = "table-row-" + row.id
    columns.forEach((col) => {
        const tdEl = document.createElement("td");
        if(col.name === "actions") {
            const button = document.createElement("button")
            button.innerHTML = "Delete"
            button.className = "btn btn-danger"
            button.addEventListener("click", (e) => {
                e.stopPropagation()
                deleteRecord(row.id)
            })
            tdEl.appendChild(button)
        } else {
            tdEl.innerHTML = row[col.name];
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

  if (!validateForm(e)) {
    return;
  }

  const record = {};
  const maxId = Math.max(...data.map((r) => r.id)) ?? 0;

  for (let i = 0; i < 6; i++) {
    const name = e.target[i].name;
    const value = e.target[i].value;
    record[name] = value;
  }

  record["id"] = maxId + 1;

  data.push(record);

  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  insert(record);
}

function insert(record) {
  const tbody = document.getElementById("tbody");
  const tableRow = document.createElement("tr");
  appendModal(tableRow)
  tableRow.addEventListener("click", () => document.getElementById("modal").innerHTML = record.notes)
  columns.forEach((col) => {
    const tdEl = document.createElement("td");
    tdEl.innerHTML = record[col.name];
    tableRow.appendChild(tdEl);
  });
  tbody.appendChild(tableRow);
}

function validateForm(form) {
  const messages = [];
  const messagesContainer = document.getElementById("message");

  for (let i = 0; i < 6; i++) {
    const name = form.target[i].name;
    const value = form.target[i].value;

    if (name === "firstname" && (!value || value.length < 3)) {
      messages.push(
        "First name is required and must be at least 3 characters long"
      );
    }

    if (name === "lastname" && (!value || value.length < 4)) {
      messages.push(
        "Last name is required and must be at least 4 characters long"
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
    element.setAttribute("data-bs-toggle", "modal")
    element.setAttribute("data-bs-target", "#exampleModal")
}

function deleteRecord(id) {
    document.getElementById(`table-row-${id}`).remove();
    const newData = data.filter(r => r.id !== id)
    localStorage.setItem(DATA_KEY, JSON.stringify(newData))
}



form.addEventListener("submit", onSubmit);