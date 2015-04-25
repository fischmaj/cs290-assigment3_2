
window.onload= function() {
  console.log('window.onload running');
  var settingsStr = localStorage.getItem('userSettings');
  if (settingsStr === null){
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

    url = url+'?pages='+pages+'&per_page=30';
    console.log(url);
 
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

          displayGists();
	}
    }
    req.open('GET', url);
    req.send();

}


//
function displayGists(){

    console.log('in displayGists');

    var userSettings = JSON.parse(localStorage.getItem('userSettings'));
    var favorites = userSettings["favsArray"];
    var favLength = favorites.length;
    var gistList = userSettings["allGistsArray"];
    var gistListLength = gistList.length;
    var gistResultsElement = document.getElementById("Gist_search_results");
    var favElement = document.getElementById("Gist_favorite_results");

    for (var i = 0; i < favLength ; i++) {

	for (var j = 0; j < gistListLength ; j++) {
	    if (gistList[j]===favorites[i]){
		gistList = gistList.slice(j, 1);
		gistListLength = gistList.length;
		j--;
	    }
	}
    }
    console.log(' through favorites stripping');

    gistResultsElement.innerHTML = null;

    for (var i = 0; i < gistListLength ; i ++){
	console.log('trying to add element' + i + ' to page');
	var resultDiv = document.createElement("div");
	var para = document.createElement("P");
	para.innerHTML = "description: " + gistList[i].description; 
	if ((!gistList[i].description) || (gistList[i].description ==="")){
	    para.innerHTML += '<p style="color:red:>NO DESCRIPTION</p>'; 
	}
	var linkUrl = gistList[i].url;
	var link = document.createElement("a");
	link.href = linkUrl;
	link.title = "LINK";
	link.innerHTML = "LINK";
	resultDiv.appendChild(para);
	resultDiv.appendChild(link);
	resultDiv.setAttribute("id", "resultDiv");
	gistResultsElement.appendChild(resultDiv);
    }
   
}