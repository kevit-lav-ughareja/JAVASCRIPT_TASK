// Fetch and display users (GET call)
axios
  .get("https://reqres.in/api/users")
  .then((response) => {
    const users = response.data.data; // Correctly access the 'data' array from the response
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.setAttribute("data-user-id", user.id);

      // Avatar column
      const avatarCell = document.createElement("td");
      const avatar = document.createElement("img");
      avatar.src = user.avatar;
      avatar.alt = `${user.first_name} ${user.last_name}`;
      avatarCell.appendChild(avatar);

      // First Name column
      const firstNameCell = document.createElement("td");
      firstNameCell.innerText = user.first_name;

      // Last Name column
      const lastNameCell = document.createElement("td");
      lastNameCell.innerText = user.last_name;

      // Action column
      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML =
        '<i class="fa-solid fa-trash-can" style="color: #f00505;"></i>';
      deleteButton.onclick = function (event) {
        event.stopPropagation(); // Prevent the row click
        deleteUser(user.id, this);
      };
      actionCell.appendChild(deleteButton);

      // Append cells to the row
      row.appendChild(avatarCell);
      row.appendChild(firstNameCell);
      row.appendChild(lastNameCell);
      row.appendChild(actionCell);

      // Attach row click listener only if not deleted
      row.addEventListener("click", (event) => handleRowClick(event, user));

      // Append the row to the table
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching users:", error));

// Delete user function with confirmation
function deleteUser(id, button) {
  const confirmation = confirm("Are you sure you want to delete this user?");

  if (confirmation) {
    // Send DELETE request to the API if confirmed
    axios
      .delete(`https://reqres.in/api/users/${id}`)
      .then(() => {
        console.log("User deleted:", id);

        // Remove the user row from the table
        const row = button.closest("tr");
        row.remove(); // Remove the corresponding row from the table

        // Prevent row click to open update form after deletion
        row.removeEventListener("click", handleRowClick);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      });
  } else {
    console.log("User deletion canceled.");
  }
}

// Function to handle row click for opening update form
function handleRowClick(event, user) {
  openUpdateForm(user);
}

// Function to open the form for adding a new user
function showAddUserForm() {
  const modal = document.querySelector("#userModal");
  const title = document.querySelector("#formTitle");
  const submitBtn = document.querySelector("#formSubmitBtn");

  // Clear fields for new user
  document.querySelector("#userId").value = "";
  document.querySelector("#formFirstName").value = "";
  document.querySelector("#formLastName").value = "";
  document.querySelector("#formAvatar").value = "";

  title.innerText = "Add User";
  submitBtn.innerText = "Add User";

  modal.style.display = "block"; // Show the modal
}

// Function to open the form for updating an existing user
function openUpdateForm(user) {
  const modal = document.querySelector("#userModal");
  const title = document.querySelector("#formTitle");
  const submitBtn = document.querySelector("#formSubmitBtn");

  // Populate form fields with existing user data
  document.querySelector("#userId").value = user.id;
  document.querySelector("#formFirstName").value = user.first_name;
  document.querySelector("#formLastName").value = user.last_name;
  document.querySelector("#formAvatar").value = user.avatar;

  title.innerText = "Update User";
  submitBtn.innerText = "Update";

  modal.style.display = "block";
}

// Function to handle form submission (add or update)
function handleUserForm(event) {
  event.preventDefault();

  const id = document.querySelector("#userId").value;
  const firstName = document.querySelector("#formFirstName").value.trim();
  const lastName = document.querySelector("#formLastName").value.trim();
  const avatar = document.querySelector("#formAvatar").value.trim();

  if (!firstName || !lastName || !avatar) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate image URL
  const img = new Image();
  img.onload = () => {
    if (id) {
      // Update mode
      axios
        .put(`https://reqres.in/api/users/${id}`, {
          first_name: firstName,
          last_name: lastName,
          avatar: avatar,
        })
        .then((res) => {
          alert("User updated!");
          updateUserRow({
            id: id,
            first_name: firstName,
            last_name: lastName,
            avatar: avatar,
          });
          hideUserForm();
        })
        .catch(() => alert("Error updating user."));
    } else {
      // Add new user mode
      axios
        .post("https://reqres.in/api/users", {
          first_name: firstName,
          last_name: lastName,
          avatar: avatar,
        })
        .then((res) => {
          alert("User added!");
          appendUserRow({
            id: res.data.id || Math.floor(Math.random() * 10000),
            first_name: firstName,
            last_name: lastName,
            avatar: avatar,
          });
          hideUserForm();
        })
        .catch(() => alert("Error adding user."));
    }
  };

  img.onerror = () => {
    alert("Image URL is incorrect.");
  };

  img.src = avatar;
}

// Function to append a new user to the table
function appendUserRow(user) {
  const tableBody = document.querySelector("tbody");

  const row = document.createElement("tr");
  row.setAttribute("data-user-id", user.id);

  // Avatar cell
  const avatarCell = document.createElement("td");
  const avatarImg = document.createElement("img");
  avatarImg.src = user.avatar;
  avatarImg.alt = `${user.first_name} ${user.last_name}`;
  avatarCell.appendChild(avatarImg);

  // First name cell
  const firstNameCell = document.createElement("td");
  firstNameCell.textContent = user.first_name;

  // Last name cell
  const lastNameCell = document.createElement("td");
  lastNameCell.textContent = user.last_name;

  // Action cell with delete button
  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML =
    '<i class="fa-solid fa-trash-can" style="color: #f00505;"></i>';

  // ❗ Prevent row click from opening update form when deleting
  deleteButton.onclick = function (event) {
    event.stopPropagation(); // Stop the event from bubbling to row
    deleteUser(user.id, this); // Call the delete function
  };
  actionCell.appendChild(deleteButton);

  // Row click to open update form
  row.onclick = function () {
    openUpdateForm({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    });
  };

  // Append all cells to row
  row.appendChild(avatarCell);
  row.appendChild(firstNameCell);
  row.appendChild(lastNameCell);
  row.appendChild(actionCell);

  // Append row to table body
  tableBody.appendChild(row);
}

// Function to update the row in the table after a successful PUT request
function updateUserRow(updatedUser) {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const userId = row.getAttribute("data-user-id");

    if (userId == updatedUser.id) {
      row.querySelector("td:nth-child(2)").innerText = updatedUser.first_name;
      row.querySelector("td:nth-child(3)").innerText = updatedUser.last_name;
      row.querySelector("td:nth-child(1) img").src = updatedUser.avatar;
    }
  });
}

// Function to hide the form modal after submission

function hideUserForm() {
  const modal = document.querySelector("#userModal");
  modal.style.display = "none";

  // Optional: reset the form
  document.querySelector("#userForm").reset();
}
