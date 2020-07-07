function doGet(request) {
  console.log(request);
  if (request.parameters.code == undefined ){
    var template = HtmlService.createTemplateFromFile('Index');
    template.data = {url: githubLogin(request)};
    return template.evaluate();
  }else{
    var template = HtmlService.createTemplateFromFile('Result');
    var access_token = authorize(request);
    template.data = {
      code: request.parameters.code,
      access_token: access_token
    };
    return template.evaluate();
  }
}

function doPost(request) {
  console.log(request);
}

function githubLogin(request) {
  var secrets = getSecrets();
  var headers = {};
  var scope = "repo";
  var options = {"method":"GET","headers":headers};
  var url = "https://github.com/login/oauth/authorize?client_id="
    +secrets.client_id
    +"&redirect_uri="
    +createRedirectUri(request)
    +"&scope="
    +scope
    +"&state="
    +generateState();
  return url;
}

function authorize(request) {
  var secrets = getSecrets();
  var headers = {"Accept":"application/json"};
  var code = request.parameters.code;
  var state = request.parameters.state;
  var payload = "client_id="
      +secrets.client_id
      +"&client_secret="
      +secrets.client_secret
      +"&code="
      +code;
  console.log("input state = "+state);
  console.log("saved state = "+getState());
  if ( state == getState() ) {
    var options = {"method":"POST","headers":headers,"payload":payload};
    var url = "https://github.com/login/oauth/access_token?"+payload;
    var response = UrlFetchApp.fetch(url,options);
    console.log("github response = "+response.getContentText());
    return JSON.parse(response.getContentText()).access_token;
  }else{
    throw "Invalid State";
  }
}

function createRedirectUri(request){
  return PropertiesService.getScriptProperties().getProperty("redirect_uri");
}

function getState() {
  return PropertiesService.getUserProperties().getProperty("state");
}

function generateState() {
  var state = uuid();
  PropertiesService.getUserProperties().setProperty("state", state);
  return state;
}

function uuid() {
  return Utilities.getUuid();
}
  
function getSecrets() {
  return {
    "client_id": PropertiesService.getScriptProperties().getProperty("client_id"),
    "client_secret": PropertiesService.getScriptProperties().getProperty("client_secret")
  }
}

function test_doGet_Step1() {
  var request = { contextPath: '',
    parameter: {},
    queryString: '',
    contentLength: -1,
    parameters: {} };
  var html = doGet(request);
}

function test_doGet_Step2() {
  var state = generateState();
  var request = { parameter: { code: 'this_is_the_code', state: state },
    queryString: 'code=this_is_the_code&state='+state,
    parameters: { state: [ state ], code: [ 'this_is_the_code' ] },
    contentLength: -1,
    contextPath: '' };
  var html = doGet(request);
}

function test_getSecrets() {
  var secrets = getSecrets();
  console.log(secrets.client_id != undefined ? "client_id exists" : "ERROR: client_id does not exist");
  console.log(secrets.client_secret != undefined ? "client_secret exists" : "ERROR: client_secret does not exist");
}
