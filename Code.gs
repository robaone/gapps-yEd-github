function doGet(request) {
  console.log(request);
}
  
function getSecrets() {
  return {
    "client_id": PropertiesService.getScriptProperties().getProperty("client_id"),
    "client_secret": PropertiesService.getScriptProperties().getProperty("client_secret")
  }
}

function test_getSecrets() {
  var secrets = getSecrets();
  console.log(secrets.client_id != undefined ? "client_id exists" : "ERROR: client_id does not exist");
  console.log(secrets.client_secret != undefined ? "client_secret exists" : "ERROR: client_secret does not exist");
}
