// Global state
let formMode = "add";

// Entry point
fetchUsers(renderUsers);

// Fetch users
function fetchUsers(onUsersFetched) {
  axios
    .get("https://reqres.in/api/users", {
      headers: { "x-api-key": "reqres-free-v1" },
    })
    .then((response) => onUsersFetched(response.data.data))
    .catch((error) => console.error("Error fetching users:", error));
}

// Render users in table
function renderUsers(users) {
  const tableBody = document.querySelector("#user-table tbody");
  tableBody.innerHTML = "";

  users.forEach((user) => tableBody.appendChild(createUserRow(user)));
}

// Create a user table row
function createUserRow(user) {
  const row = document.createElement("tr");
  row.setAttribute("data-user-id", user.id);

  row.innerHTML = `
    <td class="avatar-cell">
      <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}" width="40" height="40" class="user-avatar">
    </td>
    <td class="first-name-cell">${user.first_name}</td>
    <td class="last-name-cell">${user.last_name}</td>
    <td>
      <button onclick="event.stopPropagation(); deleteUser(${user.id}, this)">
        <i class="fa-solid fa-trash-can" style="color: #f00505;"></i>
      </button>
    </td>
  `;

  row.addEventListener("click", () => openUserForm("edit", user));
  return row;
}

// Delete user
function deleteUser(id, button) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  axios
    .delete(`https://reqres.in/api/users/${id}`, {
      headers: { "x-api-key": "reqres-free-v1" },
    })
    .then(() => {
      console.log("User deleted:", id);
      button.closest("tr").remove();
    })
    .catch(() => alert("Error deleting user. Please try again."));
}

// Show modal with form for add/edit
function openUserForm(mode, user = null) {
  formMode = mode;

  document.querySelector("#formTitle").innerText =
    mode === "edit" ? "Update User" : "Add User";
  document.querySelector("#formSubmitBtn").innerText =
    mode === "edit" ? "Update" : "Add User";
  document.querySelector("#userModal").style.display = "block";

  if (mode === "edit" && user) {
    document.querySelector("#userId").value = user.id;
    document.querySelector("#formFirstName").value = user.first_name;
    document.querySelector("#formLastName").value = user.last_name;
    document.querySelector("#formAvatar").value = user.avatar;
  } else {
    document.querySelector("#userForm").reset();
    document.querySelector("#userId").value = "";
  }
}

// Hide modal
function hideUserForm() {
  document.querySelector("#userModal").style.display = "none";
  document.querySelector("#userForm").reset();
}

// Handle form submission
function handleUserForm(event) {
  event.preventDefault();

  const id = document.querySelector("#userId").value;
  const firstName = document.querySelector("#formFirstName").value.trim();
  const lastName = document.querySelector("#formLastName").value.trim();
  const avatar = document.querySelector("#formAvatar").value.trim();

  if (!firstName) return alert("First name is required.");
  if (!lastName) return alert("Last name is required.");
  if (!avatar) return alert("Avatar URL is required.");

  const img = new Image();
  img.src = avatar;

  img.onload = () => {
    const userData = { first_name: firstName, last_name: lastName, avatar };
    (formMode === "edit" ? updateUser : addUser)(id, userData);
  };

  img.onerror = () => alert("Image URL is incorrect.");
}

// Add user
function addUser(id, userData) {
  axios
    .post("https://reqres.in/api/users", userData, {
      headers: { "x-api-key": "reqres-free-v1" },
    })
    .then((res) => {
      alert("User added!");
      appendUserRow({
        id: res.data.id || Math.floor(Math.random() * 10000),
        ...userData,
      });
      hideUserForm();
    })
    .catch(() => alert("Error adding user."));
}

// Update user
function updateUser(id, userData) {
  axios
    .put(`https://reqres.in/api/users/${id}`, userData, {
      headers: { "x-api-key": "reqres-free-v1" },
    })
    .then(() => {
      alert("User updated!");
      updateUserRow({ id, ...userData });
      hideUserForm();
    })
    .catch(() => alert("Error updating user."));
}

// Append new row to table
function appendUserRow(user) {
  document.querySelector("#user-table tbody").appendChild(createUserRow(user));
}

// Update existing row in table
function updateUserRow(updatedUser) {
  const row = document.querySelector(
    `#user-table tbody tr[data-user-id='${updatedUser.id}']`
  );
  if (!row) return;

  row.querySelector(".first-name-cell").innerText = updatedUser.first_name;
  row.querySelector(".last-name-cell").innerText = updatedUser.last_name;
  row.querySelector(".avatar-cell img").src = updatedUser.avatar;
}
