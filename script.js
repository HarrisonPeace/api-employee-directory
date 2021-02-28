// JavaScript Document

const employeeDirectory = document.querySelector('#employee-directory')
const employeeOverlay = document.querySelector('#employee-overlay')

fetch('https://randomuser.me/api/?results=12&nat=au')
	.then(response => response.json())
	.then(data => createEmployeeProfiles(data.results))

function createEmployeeProfiles(data) {
	
	let employeeInfo = data.map(employee => `
		<div>
            <img src="${employee.picture.medium}"> 
            <h3>${employee.name.first} ${employee.name.last}</h3>
            <p><a href="mailto:${employee.email}">${employee.email}</a></p>
            <p>${employee.location.country}</p>
		</div`						  
	);
	
	let employeeAddInfo = data.map(employee => `
		<div>
            <p>${employee.cell}</p>
            <p>${employee.location.street.number} ${employee.location.street.name} ${employee.location.city}, ${employee.location.postcode}</p>
            <p>Birthday:${employee.dob.date.substring(7, 9)}/${employee.dob.date.substring(5, 7)}/${employee.dob.date.substring(0, 4)}</p>
		</div>`
	)

    employeeDirectory.innerHTML = employeeInfo.join("");
	
	for (i = 0; i < data.length; i++) {
		let overlayDiv = document.createElement('DIV');
		overlayDiv.innerHTML = employeeInfo[i] + employeeAddInfo[i];
		employeeOverlay.appendChild(overlayDiv);
	}
	
}
