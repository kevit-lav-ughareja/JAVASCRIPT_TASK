
axios
  .get("https://reqres.in/api/users"  ,{ 'headers': { 'x-api-key': 'reqres-free-v1' } })
  .then((response) => {
    const users = response.data.data; 
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; 
    users.forEach((user) => {
      const row = document.createElement("tr");

      row.setAttribute("data-user-id", user.id);

      
      const avatarCell = document.createElement("td");
      const avatar = document.createElement("img");
      avatar.src = user.avatar;
      avatar.alt = `${user.first_name} ${user.last_name}`;
      avatarCell.appendChild(avatar);

     
      const firstNameCell = document.createElement("td");
      firstNameCell.innerText = user.first_name;

     
      const lastNameCell = document.createElement("td");
      lastNameCell.innerText = user.last_name;

      
      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML =
        '<i class="fa-solid fa-trash-can" style="color: #f00505;"></i>';
      deleteButton.onclick = function (event) {
        event.stopPropagation(); 
        deleteUser(user.id, this);
      };
      actionCell.appendChild(deleteButton);

      
      row.appendChild(avatarCell);
      row.appendChild(firstNameCell);
      row.appendChild(lastNameCell);
      row.appendChild(actionCell);

      
      row.addEventListener("click", (event) => handleRowClick(event, user));

      
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching users:", error));


function deleteUser(id, button) {
  const confirmation = confirm("Are you sure you want to delete this user?");

  if (confirmation) {
   
    axios
      .delete(`https://reqres.in/api/users/${id}`, { headers: { 'x-api-key': 'reqres-free-v1' } })
      .then(() => {
        console.log("User deleted:", id);

        
        const row = button.closest("tr");
        row.remove(); 

        
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


function handleRowClick(event, user) {
  openUpdateForm(user);
}


function showAddUserForm() {
  const modal = document.querySelector("#userModal");
  const title = document.querySelector("#formTitle");
  const submitBtn = document.querySelector("#formSubmitBtn");

  
  document.querySelector("#userId").value = "";
  document.querySelector("#formFirstName").value = "";
  document.querySelector("#formLastName").value = "";
  document.querySelector("#formAvatar").value = "";

  title.innerText = "Add User";
  submitBtn.innerText = "Add User";

  modal.style.display = "block";
}


function openUpdateForm(user) {
  const modal = document.querySelector("#userModal");
  const title = document.querySelector("#formTitle");
  const submitBtn = document.querySelector("#formSubmitBtn");

  
  document.querySelector("#userId").value = user.id;
  document.querySelector("#formFirstName").value = user.first_name;
  document.querySelector("#formLastName").value = user.last_name;
  document.querySelector("#formAvatar").value = user.avatar;

  title.innerText = "Update User";
  submitBtn.innerText = "Update";

  modal.style.display = "block";
}


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

  
  const img = new Image();
  img.onload = () => {
    if (id) {
      
      axios
        .put(`https://reqres.in/api/users/${id}`, {
          first_name: firstName,
          last_name: lastName,
          avatar: avatar,
        },{ 'headers': { 'x-api-key': 'reqres-free-v1' } })
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
      
      axios
        .post("https://reqres.in/api/users", {
          first_name: firstName,
          last_name: lastName,
          avatar: avatar,
        },{ 'headers': { 'x-api-key': 'reqres-free-v1' } })
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


function appendUserRow(user) {
  const tableBody = document.querySelector("tbody");

  const row = document.createElement("tr");
  row.setAttribute("data-user-id", user.id);


  const avatarCell = document.createElement("td");
  const avatarImg = document.createElement("img");
  avatarImg.src = user.avatar;
  avatarImg.alt = `${user.first_name} ${user.last_name}`;
  avatarCell.appendChild(avatarImg);

 
  const firstNameCell = document.createElement("td");
  firstNameCell.textContent = user.first_name;

  
  const lastNameCell = document.createElement("td");
  lastNameCell.textContent = user.last_name;


  const actionCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML =
    '<i class="fa-solid fa-trash-can" style="color: #f00505;"></i>';

 
  deleteButton.onclick = function (event) {
    event.stopPropagation(); 
    deleteUser(user.id, this); 
  };
  actionCell.appendChild(deleteButton);

 
  row.onclick = function () {
    openUpdateForm({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    });
  };

 
  row.appendChild(avatarCell);
  row.appendChild(firstNameCell);
  row.appendChild(lastNameCell);
  row.appendChild(actionCell);

  
  tableBody.appendChild(row);
}


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



function hideUserForm() {
  const modal = document.querySelector("#userModal");
  modal.style.display = "none";


  document.querySelector("#userForm").reset();
}
