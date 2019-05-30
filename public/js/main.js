
const headers = {
	'Content-Type': 'application/json'
}
const url = {
	checkPromoCode: '/register/check-promo-code',
	submitSecondStep: '/register/next-step'
};


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



function displayAlert(message) {
	const alertBox = document.getElementById('alert-box');
	alertBox && (alertBox.innerHTML = message);
}


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



	
	promoForm && promoForm.addEventListener('submit', function(event){
		event.preventDefault();
		const givenCode = event.target[0].value;
		apiCaller('post', url.checkPromoCode, headers, {
			promoCode: givenCode
		}).then(data => {
			const { basic, premium } = data;
			basicPrice.innerHTML = basic;
			premiumPrice.innerHTML = premium;
		})
	})

	const contactForm = document.getElementById('contact-form');
	const sendFormEndpoint = '/form-send-message'
	console.log(contactForm);
	contactForm && contactForm.addEventListener('submit', function(event){
		event.preventDefault();
	
		apiCaller('post', sendFormEndpoint, headers, {
			promoCode: givenCode
		}).then(data => {
			const { basic, premium } = data;
			basicPrice.innerHTML = basic;
			premiumPrice.innerHTML = premium;
		})
	})




	submitSecondStep && submitSecondStep.addEventListener('click', function(){
		apiCaller('post', url.submitSecondStep, headers, {
			subscription: subscription.type
		}).then(redirect => window.location.replace(redirect.url))
	});
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