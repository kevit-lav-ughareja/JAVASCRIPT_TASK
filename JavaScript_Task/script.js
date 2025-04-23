
const apiUrl = 'https://reqres.in/api/users?page=1&&per_page=15';


fetch(apiUrl)
    .then(response => response.json())
    
    .then(response => {
       
        const tableBody = document.querySelector('tbody');
        
       
        response.data.forEach(user => {
            
            const row = document.createElement('tr');

            const avatarCell = document.createElement('td');
            const firstNameCell = document.createElement('td');
            const lastNameCell = document.createElement('td');

            const avatar = document.createElement('img');
            avatar.src = user.avatar;
            avatarCell.appendChild(avatar);

            const first_name=document.createElement('p')
            first_name.innerText=user.first_name;
            firstNameCell.appendChild(first_name);

            const last_name=document.createElement('p')
            last_name.innerText=user.last_name;
            lastNameCell.appendChild(last_name);

            row.appendChild(avatarCell);
            row.appendChild(firstNameCell);
            row.appendChild(lastNameCell);

           
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });