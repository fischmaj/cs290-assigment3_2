
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
    console.log(favorites);
    var favLength = favorites.length;
    var gistList = userSettings["allGistsArray"];
    var gistListLength = gistList.length;
    var gistResultsElement = document.getElementById("Gist_search_results");
    var favElement = document.getElementById("Gist_favorite_results");

    for (var i = 0; i < favLength ; i++) {

	for (var j = 0; j < gistListLength ; j++) {
	    if (gistList[j] === favorites[i]){
		gistList = gistList.slice(j, 1);
		gistListLength = gistList.length;
		j--;
	    }
	}
    }
    userSettings["allGistsArray"]=gistList;
    localStorage.setItem('userSettings', JSON.stringify(userSettings));

 
    //Create a div for each GIST remaining in GIST array
    gistResultsElement.innerHTML = null;
    for (var i = 0; i < gistListLength; i++)  {
	var resultDiv = createNonFavGistDiv(gistList[i]);
	gistResultsElement.appendChild(resultDiv);
    }

    //Create a div for each Element in the favs Array
    favElement.innerHTML = null;
    for (var j = 0; j < favLength; j++) {
	console.log(favorites);
	console.log(favorites[j]);
	var resultDiv = createFavDiv(favorites[j]);
	favElement.appendChild(resultDiv);
    }
   
}

function createNonFavGistDiv(gistObject ) {
  var resultDiv = document.createElement("div");
  var para = document.createElement("P");
  para.innerHTML = "description: " + gistObject.description; 
  if ((!gistObject.description) || (gistObject.description ==="")) {
    para.innerHTML += '<p style="color:red:>NO DESCRIPTION</p>'; 
  }
  var linkUrl = gistObject.url;
  var link = document.createElement("a");
  link.href = linkUrl;
  link.title = "LINK";
  link.innerHTML = "LINK";
  var button = document.createElement("BUTTON");
  button.type = "button";
  button.setAttribute("onclick", "makeFavorite(this)");
  button.value = "+Favorite";
  button.innerHTML = "+Favorite";
  resultDiv.appendChild(para);
  resultDiv.appendChild(link);
  resultDiv.appendChild(button);
  resultDiv.setAttribute("id", "resultDiv");
  return resultDiv;
}

function createFavDiv(gistObject ) {
    console.log('In createFavDiv');
  console.log(gistObject);
  var resultDiv = document.createElement("div");
  var para = document.createElement("P");
  para.innerHTML = "description: " + gistObject.description; 
  if ((!gistObject.description) || (gistObject.description ==="")) {
    para.innerHTML += '<p style="color:red:>NO DESCRIPTION</p>'; 
  }
  var linkUrl = gistObject.url;
  var link = document.createElement("a");
  link.href = linkUrl;
  link.title = "LINK";
  link.innerHTML = "LINK";
  var button = document.createElement("BUTTON");
  button.type = "button";
  button.setAttribute("onclick", "removeFavorite(this)");
  button.value = "-Favorite";
  button.innerHTML = "-Favorite";
  resultDiv.appendChild(para);
  resultDiv.appendChild(link);
  resultDiv.appendChild(button);
  resultDiv.setAttribute("id", "resultDiv");
  return resultDiv;
}

function makeFavorite(elem){
    //Get and Parse all the local storage items
    var userSettings = JSON.parse(localStorage.getItem('userSettings'));
    var gistList = userSettings["allGistsArray"];
    var favsList = userSettings["favsArray"];
    var gistListLength = gistList.length;


    //get the URL of the <a> tag in the calling DIV
    var linkString = elem.parentNode.childNodes[1].href;

    //search the list of non-fav Gists for the one with that matches the
    //caller.
    for (var i = 0; i < gistListLength; i++){
	if (gistList[i].url === linkString) {
	    //if we've found the item, remove it from gistList and 
	    //add it to favsList
	    favsList.push(gistList.splice(i,1)[0]);
	    break;
	}
    }




    userSettings["allGistsArray"]= gistList;
    userSettings["favsArray"]= favsList;
    localStorage.setItem('userSettings', JSON.stringify(userSettings));

    displayGists();
}