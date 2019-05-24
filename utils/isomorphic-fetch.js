
function apiCaller(method, headers, body, url) {
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


export { apiCaller };