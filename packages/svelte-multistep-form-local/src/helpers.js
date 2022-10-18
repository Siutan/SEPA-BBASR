import { currentStep } from './stores.js';
import {
	UUID_PATTERN,
	ERROR_DISPLAY_TIME,
	BUTTON_OPACITY,
	BUTTON_DISABLED_OPACITY
} from './constants.js';

let activeStep;
currentStep.subscribe((value) => {
	activeStep = value;
});

export const formHasError = () => {
	const steps = document.querySelectorAll('.step');
	const step = steps[activeStep];

	const requiredFields = step.querySelectorAll('[required]');
	let hasError = false;
	let errorMessages = ['Please fix any errors and fill out all fields!'];

	requiredFields.forEach((el) => {
		let id = el.id;
		console.log('id:', id);
		if (id !== 'driver_permission_question' || id !== 'last_driver_insurance_question') {
			//clear any errors
			if (document.getElementById(`${id}_error`).value !== '') {
				document.getElementById(`${id}_error`).innerHTML = '';
			}
		}

		//if not filled out add in a required field message
		if (!el.checkValidity()) {
			hasError = true;
			document.getElementById(`${id}_error`).innerHTML = 'Required Field';
		}
	});

	//turn radio question back to gray if weren't filled out last pass
	if (document.getElementById('floating_last_rider').value === '2') {
		document
			.getElementById('driver_permission_question')
			.classList.replace('dark:text-red-600', 'dark:text-gray-400');
		document
			.getElementById('last_driver_insurance_question')
			.classList.replace('dark:text-red-600', 'dark:text-gray-400');
		document
			.getElementById('driver_permission_question')
			.classList.replace('text-red-600', 'text-gray-900');
		document
			.getElementById('last_driver_insurance_question')
			.classList.replace('text-red-600', 'text-gray-900');
	}

	//validate first name
	const firstName = document.getElementById('floating_first_name').value;
	let regexName = /^[A-Za-z ]+$/;
	if (firstName) {
		if (firstName.match(regexName)) {
			console.log('valid first name');
		} else {
			console.log('Not valid first name');
			hasError = true;
			//Add error message
			document.getElementById('floating_first_name_error').innerHTML = 'Only letter characters';
		}
	}

	//validate last name
	const lastName = document.getElementById('floating_last_name').value;
	if (lastName) {
		if (lastName.match(regexName)) {
			console.log('valid last name');
		} else {
			console.log('Not valid last name');
			hasError = true;
			document.getElementById('floating_last_name_error').innerHTML = 'Only letter characters';
		}
	}

	//validate phone number
	const phone = document.getElementById('floating_phone').value;
	let regexPhone = /^61 4\d{2}-\d{3}-\d{3}$/;
	if (phone) {
		if (phone.match(regexPhone)) {
			console.log('valid phone format');
		} else {
			console.log('Not valid phone format');
			hasError = true;
			document.getElementById('floating_phone_error').innerHTML = "'614XXXXXXXX' format";
		}
	}

	//validate datestring
	const dateString = document.getElementById('floating_date').value;
	let regexDate = /^\d{4}-\d{2}-\d{2}$/;
	if (dateString) {
		console.log('date1: ', dateString);
		//check that date is in correct format
		if (dateString.match(regexDate)) {
			console.log('valid format');

			let d = new Date(dateString);
			let dNum = d.getTime();

			//Check if is a valid date
			if (!dNum) {
				hasError = true;
				document.getElementById('floating_date_error').innerHTML = 'Not valid date';
			}
			//Apply error if dob is before 1900
			const dMin = new Date('1900-1-1').getTime();

			if (dMin - dNum > 0) {
				hasError = true;
				document.getElementById('floating_date_error').innerHTML = "Must be after '01/01/1900'";
			}

			//Apply error if dob is in the future
			const dMax = new Date().getTime();
			if (dMax - dNum <= 0) {
				hasError = true;
				document.getElementById('floating_date_error').innerHTML = "Can't be a future date";
			}
		} else {
			console.log('invalid date format');
			hasError = true;
			document.getElementById('floating_date_error').innerHTML = 'Not valid date format';
		}
	}

	//validate email
	const email = document.getElementById('floating_email').value;
	let regexEmail =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email) {
		if (email.match(regexEmail)) {
			console.log('valid email format');
		} else {
			console.log('Not valid email format');
			hasError = true;
			document.getElementById('floating_email_error').innerHTML = 'Require a valid email address';
		}
	}

	//validate address
	const address = document.getElementById('floating_address').value;
	let regexAddress = /^[a-zA-Z0-9,\- \/\(\)]+$/;
	if (address) {
		if (address.match(regexAddress)) {
			console.log('valid address');
		} else {
			console.log('Not valid address format');
			hasError = true;
			document.getElementById('floating_address_error').innerHTML = 'No special characters';
		}
	}

	//validate membershipID
	const membershipID = document.getElementById('floating_memberID').value;
	let regexMembership = /^[A-Z]{2}\d{6}$/;
	if (membershipID) {
		if (membershipID.match(regexMembership)) {
			console.log('valid membershipID');
		} else {
			console.log('Not valid membership ID format');
			hasError = true;
			document.getElementById('floating_membershipID_error').innerHTML = '`XX000000` format';
		}
	}

	//Check if policy holder was last one driving
	let lastRider = document.getElementById('floating_last_rider').value;
	console.log('lastRider: ', lastRider);
	if (lastRider === '2') {
		//validate first name of last rider
		const nonPolicyFirstName = document.getElementById('non_policy_first_name').value;
		if (nonPolicyFirstName) {
			if (nonPolicyFirstName.match(regexName)) {
				console.log('valid first name of non-policy rider');
			} else {
				console.log('Not valid first name of non-policy rider');
				hasError = true;
				document.getElementById('non_policy_first_name_error').innerHTML = 'Only letter characters';
			}
		}

		//validate last name of last rider
		const nonPolicyLastName = document.getElementById('non_policy_last_name').value;
		if (nonPolicyLastName) {
			if (nonPolicyLastName.match(regexName)) {
				console.log('valid last name of non-policy rider');
			} else {
				console.log('Not valid last name of non-policy rider');
				hasError = true;
				document.getElementById('non_policy_last_name_error').innerHTML = 'Only letter characters';
			}
		}

		//validate phone number
		const nonPolicyPhone = document.getElementById('non_policy_phone').value;

		if (nonPolicyPhone) {
			if (nonPolicyPhone.match(regexPhone)) {
				console.log('valid phone format for last rider');
			} else {
				console.log('Not valid phone format for last rider');
				hasError = true;
				document.getElementById('non_policy_phone_error').innerHTML = "'614XXXXXXXXX' format";
			}
		}

		//validate date of birth of last rider
		const nonPolicyDate = document.getElementById('non_policy_date').value;
		if (nonPolicyDate) {
			//check that date is in correct format
			if (nonPolicyDate.match(regexDate)) {
				console.log('valid format');
				let d = new Date(dateString);
				let dNum = d.getTime();

				//Check if is a valid date
				if (!dNum) {
					hasError = true;
					document.getElementById('non_policy_date_error').innerHTML = 'Not a valid date';
				}
				//Apply error if dob is before 1900
				const dMin = new Date('1900-1-1').getTime();

				if (dMin - dNum > 0) {
					hasError = true;
					document.getElementById('non_policy_date_error').innerHTML = "Must be after '01/01/1900'";
				}

				//Apply error if dob is in the future
				const dMax = new Date().getTime();
				if (dMax - dNum <= 0) {
					hasError = true;
					document.getElementById('non_policy_date_error').innerHTML = "Can't be future date";
				}
			} else {
				console.log('invalid date format');
				hasError = true;
				document.getElementById('non_policy_date_error').innerHTML = 'Invalid date format';
			}
		}

		//check if relation selected was other
		let relation = document.getElementById('floating_relation').value;
		if (relation === '5') {
			//validate other relation details
			let otherDetails = document.getElementById('relation_other').value;
			if (otherDetails) {
				if (otherDetails.match(regexName)) {
					console.log('valid other details ');
				} else {
					console.log('Not valid input for other relation details');
					hasError = true;
					document.getElementById('relation_other_error').innerHTML = 'Only letter characters';
				}
			}
		}

		//check if permission question was answered
		let permission = document.getElementsByName('driverPermission');
		console.log('Permission: ');
		console.log(permission);

		if (permission[0].checked || permission[1].checked) {
			console.log('Permission question selected');
		} else {
			console.log('Permission question not selected');
			//change the colour of the question to indicate not selected
			console.log('DRIVER PERMI', document.getElementById('driver_permission_question'));
			document.getElementById('driver_permission_question').classList.remove('dark:text-gray-400');
			document.getElementById('driver_permission_question').classList.add('dark:text-red-600');
			document.getElementById('driver_permission_question').classList.remove('text-gray-900');
			document.getElementById('driver_permission_question').classList.add('text-red-600');
			hasError = true;
		}

		//check if last driver has insurance question was answered
		let insurance = document.getElementsByName('nonDriverHasInsurance');
		console.log('insurancey: ', insurance[0].checked);
		console.log('insurancen: ', insurance[1].checked);
		if (insurance[0].checked || insurance[1].checked) {
			console.log('insurance question selected');
		} else {
			console.log('Insurance question not selected');
			hasError = true;
			//Change colour of question if not selected
			document
				.getElementById('last_driver_insurance_question')
				.classList.remove('dark:text-gray-400');
			document.getElementById('last_driver_insurance_question').classList.add('dark:text-red-600');
			document.getElementById('last_driver_insurance_question').classList.remove('text-gray-900');
			document.getElementById('last_driver_insurance_question').classList.add('text-red-600');
		}
	}
	//check if license number has been entered and is valid format
	let licenseNumber = document.getElementById('licenseNumber').value;
	if (licenseNumber) {
		let regexLicense = /^\d{9,11}$/;
		if (licenseNumber.match(regexLicense)) {
			console.log("valid driver's license number");
		} else {
			console.log("Not valid driver's license number");
			hasError = true;
			document.getElementById('licenseNumber_error').innerHTML = 'Between 9 to 11 digits';
		}
	}

	//Check if license issue date is valid
	let licenseIssueDate = document.getElementById('licenseIssueDate').value;
	if (licenseIssueDate) {
		console.log('date: ', licenseIssueDate);
		//check that date is in correct format
		if (licenseIssueDate.match(regexDate)) {
			console.log('valid format');
			let d = new Date(licenseIssueDate);
			let dNum = d.getTime();

			//Check if is a valid date
			if (!dNum) {
				hasError = true;
				document.getElementById('licenseIssueDate_error').innerHTML = 'Not a valid date';
			}
			//Apply error if dob is before 1900
			const dMin = new Date('1900/01/01').getTime();

			if (dMin - dNum > 0) {
				hasError = true;
				document.getElementById('licenseIssueDate_error').innerHTML = 'Must be after 01/01/1900';
			}

			//Apply error if dob is in the future
			const dMax = new Date().getTime();
			if (dMax - dNum <= 0) {
				hasError = true;
				document.getElementById('licenseIssueDate_error').innerHTML =
					'The date cannot be in the future';
			}
		} else {
			console.log('invalid license issue date format');
			hasError = true;
			document.getElementById('licenseIssueDate_error').innerHTML = 'Invalid date format';
		}
	}

	//validate the vehicle make input
	let make = document.getElementById('floating_vehicleMake').value;
	if (make) {
		if (make.match(regexAddress)) {
			console.log('valid make format');
		} else {
			console.log('Not valid make format');
			hasError = true;
			document.getElementById('floating_vehicleMake_error').innerHTML =
				'Please use yyyy/mm/dd format';
		}
	}

	//validate the vehicle model input
	let vehicleModel = document.getElementById('vehicleModel').value;
	if (vehicleModel) {
		if (vehicleModel.match(regexAddress)) {
			console.log('valid vehicle model format');
		} else {
			console.log('Not valid vehicle make format');
			hasError = true;
			document.getElementById('vehicleModel_error').innerHTML = 'No special characters';
		}
	}

	//validate the vehicle year input
	let year = document.getElementById('floating_vehicle_year').value;
	let regexYear = /^\d{4}|\d{4}-\d{4}$/;
	if (year) {
		if (year.match(regexYear)) {
			console.log('valid vehicle year format');
		} else {
			console.log('Not valid vehicle year format');
			hasError = true;
			document.getElementById('floating_vehicle_year_error').innerHTML = 'yyyy or yyyy-yyyy format';
		}
	}

	//validate the vehicle generation input
	let generation = document.getElementById('floating_vehicle_generation').value;
	if (generation) {
		if (vehicleModel.match(regexAddress)) {
			console.log('valid vehicle generation format');
		} else {
			console.log('Not valid vehicle generation format');
			hasError = true;
			document.getElementById('floating_vehicle_generation_error').innerHTML =
				'No special characters';
		}
	}

	//validate the vehicle license input
	let rego = document.getElementById('floating_vehicle_license').value;
	let regexRego = /^[A-Za-z0-9]{1,6}$/;
	if (rego) {
		if (rego.match(regexRego)) {
			console.log('valid vehicle license plate format');
		} else {
			console.log('Not valid vehicle license plate format');
			hasError = true;
			document.getElementById('floating_vehicle_license_error').innerHTML = 'No special characters';
		}
	}
	
	//validate the vehicle colour input
	let colour = document.getElementById('floating_vehicle_colour').value;
	
	if (colour) {
		if (colour.match(regexName)) {
			console.log('valid colour input format');
		} else {
			console.log('Not valid vehicle colour format');
			hasError = true;
			document.getElementById('floating_vehicle_colour_error').innerHTML = 'Only letter characters';
		}
	}

	//validate the vehicle engine input
	let engine = document.getElementById('floating_engine').value;
	if (engine) {
		if (engine.match(regexAddress)) {
			console.log('valid vehicle engine format');
		} else {
			console.log('Not valid vehicle engine format');
			hasError = true;
			document.getElementById('floating_engine_error').innerHTML = 'No special characters';
		}
	}

	//validate the vehicle generation input
	let vehicleID = document.getElementById('floating_vehicleId').value;
	if (vehicleID) {
		if (vehicleID.match(regexAddress)) {
			console.log('valid vehicle ID format');
		} else {
			console.log('Not valid vehicle ID format');
			hasError = true;
			document.getElementById('floating_vehicleId_error').innerHTML = 'No special characters';
		}
	}

	if (hasError) {
		showError(errorMessages);
		console.log('errorMessages', errorMessages);
	}
	return hasError;
};

export const showError = (errorMessages) => {
	let errorField = document.querySelector('#multistep-error-messages');

	deleteChildNodes(errorField);
	showOrHide(errorField, 'visible');

	errorMessages.forEach((message) => {
		createElementAppendTo('p', message, errorField);
	});

	setTimeout(() => {
		showOrHide(errorField, 'hidden');
	}, ERROR_DISPLAY_TIME);
};

export const updateStepStatus = (operation) => {
	if (!operation) return;
	const steps = document.querySelectorAll('.step');

	steps[activeStep].classList.remove('step-is-active');
	steps[activeStep].classList.add('step-not-active');

	operation();

	steps[activeStep].classList.remove('step-not-active');
	steps[activeStep].classList.add('step-is-active');

	updateButtonVisibility();
};

export const updateButtonVisibility = () => {
	const steps = document.querySelectorAll('.step');
	const stepsLength = steps.length;

	const prev = document.querySelector('#multistep-prev');
	const next = document.querySelector('#multistep-next');

	prev.style.opacity = BUTTON_OPACITY;
	next.style.opacity = BUTTON_OPACITY;

	if (activeStep === 0) {
		prev.style.opacity = BUTTON_DISABLED_OPACITY;
	}
	if (activeStep === stepsLength - 1) {
		next.style.opacity = BUTTON_DISABLED_OPACITY;
	}
};

export const showOrHide = (el, status) => {
	if (!el) return;

	const statusOptions = {
		hidden: BUTTON_DISABLED_OPACITY,
		visible: BUTTON_OPACITY
	};

	el.style.visibility = statusOptions[status] ? status : null;
	el.style.opacity = statusOptions[status] ? statusOptions[status] : null;
};

// TODO: think about it if this is nedeed or useless
export const uuidv4 = () => {
	return UUID_PATTERN.replace(/[xy]/g, function (c) {
		let r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const deleteChildNodes = (el) => {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
};

export const createElementAppendTo = (type, content, target) => {
	let el = document.createElement(type);
	el.innerHTML = content;
	target.appendChild(el);
};
