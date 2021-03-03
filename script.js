// JavaScript Document

const employeeDirectory = document.querySelector('#employee-directory');
const employeeOverlayContainer = document.querySelector('#employee-overlay');
const screenOverlay = document.querySelector('#screen-overlay');
let employeeOverlays;
let leftArrow = document.querySelector('#left-arrow');
let rightArrow = document.querySelector('#right-arrow');

/*==========================================================================
---------------------------    Loading Symbol   ----------------------------
============================================================================*/

window.addEventListener('load', () => {
  employeeDirectory.innerHTML = `<img src="img//ajax-loader.gif" alt="loading-icon" id="loading-icon">`;
});


/*==========================================================================
------------------    Fetching Employee Info From Api   --------------------
============================================================================*/

fetch('https://randomuser.me/api/?results=12&nat=au')
	.then(response => response.json())
	.then(data => createEmployeeProfiles(data.results))
	.then(() => employeeOverlays = document.querySelectorAll('.employee-overlay'))
	

function createEmployeeProfiles(data) {
	//collate employee info
	const employeeInfo = data.map(employee => `
		<div class="employee-info" id="${employee.name.first.toLowerCase()}-${employee.name.last.toLowerCase()}-directory">
            <img src="${employee.picture.large}">
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
            <p>Birthday:${employee.dob.date.substring(8, 10)}/${employee.dob.date.substring(5, 7)}/${employee.dob.date.substring(0, 4)}</p>
		</div>`
	)
	//add employee information to page
    employeeDirectory.innerHTML = employeeInfo.join('');
	//join employee info and additional info together then add to overlay (aside) section
	for (let i = 0; i < data.length; i++) {
		let overlayDiv = document.createElement('DIV');
		let overlayClose = `<img src="img/icon-x.svg" alt="close employee info" class="close-icon">`
			overlayDiv.id = `${data[i].name.first.toLowerCase()}-${data[i].name.last.toLowerCase()}-overlay`
			overlayDiv.className = "employee-overlay"
		overlayDiv.innerHTML = overlayClose + employeeInfo[i] + employeeAddInfo[i];
		employeeOverlayContainer.appendChild(overlayDiv);
	}
}

/*==========================================================================
------------------------    Search Functionality   --------------------------
============================================================================*/

function searchFunction() {
  // Declare variables
  let input, filter, employee, searchCritera;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  employee = employeeDirectory.querySelectorAll('div');

  // Loop through all list items, and hide those who don't match the search query
  for (let i = 0; i < employee.length; i++) {
    searchCritera = employee[i].querySelector('h3').innerHTML.toUpperCase();
    if (searchCritera.indexOf(filter) > -1) {
      employee[i].style.display = "";
    } else {
      employee[i].style.display = "none";
    }
  }
}

/*==========================================================================
------------------------------    Overlay   --------------------------------
============================================================================*/

//function to show related overlay when employee is clicked
employeeDirectory.addEventListener('click', (e) => {
	let event;
	//check which element was clicked then select employee-info container / remove -directory for comparison with overlay ID
	if (e.target.className === 'employee-info') {
		event = e.target.id.replace('-directory', '')
	} else if (e.target.tagName === 'IMG' || e.target.tagName === 'DIV') {
		event = e.target.parentNode.id.replace('-directory', '')
	} else if (e.target.tagName === 'P' || e.target.tagName === 'H3') {
		event = e.target.parentNode.parentNode.id.replace('-directory', '')
	}
	//loop through overlays to check which one matches the click event then display
	for (let i = 0; i < employeeOverlays.length; i++) {
		let employeeOverlay = employeeOverlays[i].id.replace('-overlay', '')
		if (employeeOverlay === event) {
			employeeOverlays[i].classList.add('selected', 'transition')
			screenOverlay.style.display = 'block'
			setTimeout(() => {
				leftArrow.style.display = 'block'
				rightArrow.style.display = 'block'
			}, 900);
		}
	}
})

//functionality for the close button
employeeOverlayContainer.addEventListener('click', (e) => {
	//only fire if X icon is clicked
	if (e.target.className === 'close-icon') {
		//select parent element and add class to remove from screen
		e.target.parentNode.classList.add('closed');
		e.target.parentNode.classList.remove('selected');
		leftArrow.style.display = 'none'
		rightArrow.style.display = 'none'
		//once employee overlay is removed return overlay to left side and remove screenoverlay
		setTimeout(() => {
			screenOverlay.style.display = 'none'
			e.target.parentNode.classList.remove('transition', 'closed')
		}, 600);
	}
})

//functionality for right arrow
rightArrow.addEventListener('click', () => {
	leftArrow.style.display = 'none'
	rightArrow.style.display = 'none'
	let selected = document.querySelector('.selected');
	let nextSibling = selected.nextSibling;
	//select first sibling if at end of list
	if (nextSibling === null) {
		//remove current employee overlay from screen and bring in first sibling
		selected.classList.add('closed');
		employeeOverlayContainer.firstChild.classList.add('selected', 'transition');
		//return selected overlay to left hand side of screen
		setTimeout(() => {
			selected.classList.remove('closed', 'transition', 'selected');
		}, 600);
		setTimeout(() => {
			leftArrow.style.display = 'block'
			rightArrow.style.display = 'block'
		}, 900);
	//select next sibling
	} else {
		//remove current employee overlay from screen and bring in next sibling
		selected.classList.add('closed');
		nextSibling.classList.add('selected', 'transition');
		//return selected overlay to left hand side of screen
		setTimeout(() => {
			selected.classList.remove('closed', 'transition', 'selected');
		}, 600);
		setTimeout(() => {
			leftArrow.style.display = 'block';
			rightArrow.style.display = 'block';
		}, 900);
	}
})

//functionality for left arrow
leftArrow.addEventListener('click', () => {
	leftArrow.style.display = 'none'
	rightArrow.style.display = 'none'
	let selected = document.querySelector('.selected');
	let previousSibling = selected.previousSibling;
	//select last sibling if at start of list
	if (previousSibling === null) {
		//move last sibling to right of screen
		employeeOverlayContainer.lastChild.classList.add('move-right');
		//remove current employee overlay to the left and bring in new overlay
		setTimeout(() => {
			selected.classList.remove('selected');
			employeeOverlayContainer.lastChild.classList.add('selected','transition');
		}, 10);
		//remove un-needed styles
		setTimeout(() => {
			selected.classList.remove('transition');
			employeeOverlayContainer.lastChild.classList.remove('move-right');
		}, 600);
		setTimeout(() => {
			leftArrow.style.display = 'block'
			rightArrow.style.display = 'block'
		}, 900);
	//select previous sibling
	} else {
		//move previous sibling to right of screen
		previousSibling.classList.add('move-right');
		//remove current employee overlay to the left and bring in new overlay
		setTimeout(() => {
			selected.classList.remove('selected');
			previousSibling.classList.add('selected', 'transition');
		}, 10);
		//remove un-needed styles
		setTimeout(() => {
			selected.classList.remove('transition');
			previousSibling.classList.remove('move-right');
		}, 600);
		setTimeout(() => {
			leftArrow.style.display = 'block';
			rightArrow.style.display = 'block';
		}, 900);
	}
})