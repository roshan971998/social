export function getFormBody(params) {
  let formBody = [];
  for (let property in params) {
    let encodeKey = encodeURIComponent(property); //'user name' => 'user%20name'
    let encodeValue = encodeURIComponent(params[property]); //'aakaash verma' => 'aakaash%20verma' formBody

    formBody.push(encodeKey + "=" + encodeValue);
  }
  return formBody.join("&"); //'username=aakash%20verma&password=12321'
}

export function getAuthTokenFromLocalStorage() {
  return localStorage.getItem("token");
}
