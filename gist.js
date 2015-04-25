
window.onload= function() {
  console.log('window.onload running');
  var settingsStr = localStorage.getItem('userSettings');
  if (true){
      settingsStr = { favsArray:[], allGistsArray:[]};
      localStorage.setItem('userSettings', JSON.stringify(settingsStr));
  }
}




//function to get new Gists based on settings
//gets 150 of the most recent Gists, then filters
//and displays
function getGists(){
    console.log('in getGists');
    var req = new XMLHttpRequest();
    if (!req){
	throw 'Unable to create HttpRequest.';
    }
    var url = 'https://api.github.com/gists/public';
    var numElement =document.getElementsByName('numPerPage');
    var pages = numElement[0].value;
    if (pages > 5){
	pages = 5;
    } else if (pages < 1){
	pages = 1;
    }
    numElement[0].value = pages;

    console.log('pages =' + pages);

    url = url+'?page='+pages+'&per_page=3';
 
    //when the request is fulfilled
    req.onreadystatechange = function(){
	if(req.readyState == 4){

	  //load the XMLHttpRequest response into a variable 
	  var gistList = JSON.parse(this.responseText);

	  //load the local storage variable
          var userSettings = JSON.parse(localStorage.getItem('userSettings'));
	  console.log (userSettings);
	  userSettings["allGistsArray"] = gistList;
	  localStorage.setItem('userSettings', JSON.stringify(userSettings));

	  console.log(userSettings['allGistsArray']);
	}
    }
    req.open('GET', url);
    req.send();

    displayGists();
}


//
function displayGists(){

}