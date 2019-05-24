

const headers = {
	'Content-Type': 'application/json'
}
const url = 'http://localhost:3000/endpoint';




(function(){
	apiCaller('post', url, headers, {
		test: 'test'
	})
})()






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
      if (current.message) throw new Error(current.message);
    });
    
  }
  return response.json();
}



// Depending on current path, set "Active" class on matched navigation element

const setNavigationCurrentElement = function(byCssClass) {
	return function(request, model) {
		const activeClass = byCssClass;

		const { navigation } = model;
		const { path } = request;
		const navExists = navigation && 
			navigation.hasOwnProperty('navItems') &&
			Array.isArray(navigation.navItems) &&
			navigation.navItems.length > 0;

		if (!(navExists || path)) return;	
		const pathPart = '/' + path.split('/')[1];
		console.log(pathPart);
		const preparedNavItems = navigation.navItems.map(model => {
			const cssClass = model.meta.class;

			if (model.url ===  pathPart) {
				model.meta.class = cssClass.concat(' ', activeClass);
			}
			return model;
		})

		navigation.navItems = preparedNavItems;
		return Object.assign(model, navigation);
	}
}

	