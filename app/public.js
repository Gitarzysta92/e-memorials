
const headers = {
	'Content-Type': 'application/json'
}
const port = window.location.port ? ':' + window.location.port : '';
const host = `${window.location.protocol}//${window.location.hostname}${port}`;



document.addEventListener("DOMContentLoaded", function() {
	console.log('Your document is ready!');


	const promoForm = document.getElementById('promo-form');
	const basicPrice = document.getElementById('basic-price');
	const premiumPrice = document.getElementById('premium-price');
	const submitSecondStep = document.getElementById('second-step-submit')
	const questions = document.querySelectorAll('.questions-accordion li');
	
	// question accordion
	const questionCallback = function(event) {
		const active = 'active';
		const isActive =  Object.values(this.classList).find(curr => curr === active);
		if (isActive) {
			this.classList.remove(active);
		} else {
			this.classList += active;
		}
	}
	questions.forEach(current => current.addEventListener('click',questionCallback))


	// Subscription plan 
	const subscription = (function(){
		const plan = {
			type: 'premium-plan',
			buttons: [
				document.getElementById('basic-plan'),
				document.getElementById('premium-plan')
			]
		}

		const toggleActive =  function(context) {
			plan.buttons.forEach(current => {
				if(current.id === context.id) {
					context.classList.add('active');
				} else {
					current.classList.remove('active');
				}
			});
		}
		
		const changePlanType = function(event) {
			plan.type = this.dataset.plan;
			toggleActive(this);
		}

		plan.buttons.forEach(current => {
			current && current.addEventListener('click', changePlanType);
		});
		return plan; 
	})()

	// Forms alert box
	const alertBox = (function(){
		const box = document.getElementById('alert-box');
		
		return {
			setStatusSuccess: function(successMessage) {
				box.classList.remove('error');
				box.classList.add('success');
				box.innerHTML = successMessage;
			},
			setStatusError: function(errorMessage) {
				box.classList.add('error');
				box.innerHTML = errorMessage;
			}
		}
	})(); 


	// SIGN UP form - first step
	const signUpForm = document.getElementById('sign-up-form');
	const firstStepEndpoint = '/register'

	signUpForm && signUpForm.addEventListener('submit', function(event){
		event.preventDefault();
		const dryData= {};
		const data = new FormData(this);
		data.forEach((value, key) => {dryData[key] = value})
		apiCaller('post', firstStepEndpoint, headers, dryData)
			.then(result => {
				const { redirect, error } = result;
				if (error) {
					return alertBox.setStatusError('Użytkownik z podanym adresem e-mail już istnieje')
				}
				window.location.replace(redirect);
			});
	})



	// PROMO CODE form - second step	
	const checkPromoCode = `${host}/register/check-promo-code`;

	promoForm && promoForm.addEventListener('submit', function(event){
		event.preventDefault();
		console.log(host);
		const givenCode = event.target[0].value;
		apiCaller('post', checkPromoCode, headers, {
			promoCode: givenCode
		}).then(result => {
			const { basic, premium, error } = result;
			if (error) {
				return alertBox.setStatusError(error);
			}
			basicPrice.innerHTML = basic;
			premiumPrice.innerHTML = premium;
		})
	})

	// PLAN form - second step
	const secondStepEndpoint = host +'/register/next-step';

	submitSecondStep && submitSecondStep.addEventListener('click', function(){
		apiCaller('post', secondStepEndpoint, headers, {
			subscription: subscription.type
		}).then(result => {
			const { redirect, error } = result;
			if (error) {
				return alertBox.setStatusError(error);
			}
			window.location.replace(redirect)
		})
	});


	
	
	// CONTACT form
	const contactForm = document.getElementById('contact-form');
	const sendFormEndpoint = '/form-send-message'
	
	contactForm && contactForm.addEventListener('submit', function(event){
		event.preventDefault();
		const dryData= {};
		const data = new FormData(this);
		data.forEach((value, key) => {dryData[key] = value})
		apiCaller('post', sendFormEndpoint, headers, dryData)
			.then(result => {
				result.hasOwnProperty('success') 
				? alertBox.setStatusSuccess('Wiadomość została wysłana')
				: alertBox.setStatusError('Wystąpił problem z wysłaniem Twojej wiadomości.')
			});
	})

	// Authorize form
	const authForm = document.getElementById('authenticate-form');
	const authFormEndpoint = '/authenticate'
	
	authForm && authForm.addEventListener('submit', function(event){
		event.preventDefault();
		const dryData= {};
		const data = new FormData(this);
		data.forEach((value, key) => {dryData[key] = value})
		apiCaller('post', authFormEndpoint, headers, dryData)
			.then(result => {
				const { error, redirect } = result;
				if (error) {
					return alertBox.setStatusError(error);
				}
				window.location.replace(redirect);
			});
	})


});






	






function apiCaller(method, url, headers, body) {
  const requestOptions = {
    method: method,
    headers: { ...headers },
    body: JSON.stringify(body)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    const error = response.statusText;
    return response.json().then(current => {
			displayAlert(current.message);
      if (current.message) throw new Error(current.message);
    });
    
	}
  return response.json();
}