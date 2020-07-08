const GITHUB_API="https://api.github.com";
const YED_URL="https://www.yworks.com/yed-live/?file=";

function doGet(request) {
  console.log(request);
  if (request.parameters.code == undefined ){
    var template = HtmlService.createTemplateFromFile('Index');
    template.data = {url: githubLogin(request)};
    saveFileData(request);
    return template.evaluate();
  }else{
    var template = HtmlService.createTemplateFromFile('Result');
    var access_token = authorize(request);
    template.data = {
      code: request.parameters.code,
      access_token: access_token,
      download_url: YED_URL+getDownloadUrl(access_token,apiPath())
    };
    return template.evaluate();
  }
}

function doPost(request) {
  console.log(request);
}

function getDownloadUrl(access_token,api_path) {
  var headers = {
    "Accept":"application/vnd.github.v3+json",
    "Authorization":"token "+access_token
  };
  var options = {"method":"GET","headers":headers};
  var url = GITHUB_API+api_path;
  var response = UrlFetchApp.fetch(url,options);
  var response_jo = JSON.parse(response.getContentText());
  return response_jo.download_url;
}


function apiPath() {
  var file_data = JSON.parse(PropertiesService.getUserProperties().getProperty("file_data"));
  var path = "/repos/"
    +file_data.owner
    +"/"
    +file_data.repo
    +"/contents"
    +file_data.path;
  return path;
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
  if ( state == getState() ) {
    var options = {"method":"POST","headers":headers,"payload":payload};
    var url = "https://github.com/login/oauth/access_token?"+payload;
    var response = UrlFetchApp.fetch(url,options);
    return JSON.parse(response.getContentText()).access_token;
  }else{
    throw "Invalid State";
  }
}

function saveFileData(request) {
  var file_data = {
    path: request.parameter.file_path,
    repo: request.parameter.repo,
    owner: request.parameter.owner
  };
  console.log("saving: " + JSON.stringify(file_data));
  PropertiesService.getUserProperties().setProperty("file_data", JSON.stringify(file_data));
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

function test_saveFileData(){
  var request = { parameters: {file_path: "/doc/assets/file.graphml", owner: "owner", repo: "repo"}};
  saveFileData(request);
  var api_path = apiPath();
  console.log(api_path);
}

function test_getSecrets() {
  var secrets = getSecrets();
  console.log(secrets.client_id != undefined ? "client_id exists" : "ERROR: client_id does not exist");
  console.log(secrets.client_secret != undefined ? "client_secret exists" : "ERROR: client_secret does not exist");
}
