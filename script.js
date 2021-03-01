// JavaScript Document

const employeeDirectory = document.querySelector('#employee-directory')
const employeeOverlay = document.querySelector('#employee-overlay')

fetch('https://randomuser.me/api/?results=12&nat=au')
	.then(response => response.json())
	.then(data => createEmployeeProfiles(data.results))

function createEmployeeProfiles(data) {
	//collate employee info
	const employeeInfo = data.map(employee => `
		<div class="employee-info">
            <img src="${employee.picture.medium}">
			<div>
                <h3>${employee.name.first} ${employee.name.last}</h3>
                <p><a href="mailto:${employee.email}">${employee.email}</a></p>
                <p>${employee.location.country}</p>
			</div>
		</div>`						  
	);
	//collate additonal employee info
	const employeeAddInfo = data.map(employee => `
		<div>
            <p>${employee.cell}</p>
            <p>${employee.location.street.number} ${employee.location.street.name} ${employee.location.city}, ${employee.location.postcode}</p>
            <p>Birthday:${employee.dob.date.substring(7, 9)}/${employee.dob.date.substring(5, 7)}/${employee.dob.date.substring(0, 4)}</p>
		</div>`
	)
	//add employee information to page
    employeeDirectory.innerHTML = employeeInfo.join('');
	//join employee info and additional info together then add to overlay (aside) section
	for (i = 0; i < data.length; i++) {
		let overlayDiv = document.createElement('DIV');
			overlayDiv.id = data[i].name.first + data[i].name.last
			overlayDiv.className = "employee-overlay"
		overlayDiv.innerHTML = employeeInfo[i] + employeeAddInfo[i];
		employeeOverlay.appendChild(overlayDiv);
	}
}

function searchFunction() {
  // Declare variables
  let input, filter, employee, searchCritera;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  employee = employeeDirectory.querySelectorAll('div');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < employee.length; i++) {
    searchCritera = employee[i].querySelector('h3').innerHTML.toUpperCase();
    if (searchCritera.indexOf(filter) > -1) {
      employee[i].style.display = "";
    } else {
      employee[i].style.display = "none";
    }
  }
}
