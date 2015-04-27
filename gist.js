/************************************************
 **  gist.js
 **  This javascript controls the functions on
 **  assign32.html.  On load, the script makes
 **  2 XMLHttpRequests to the github api, and
 **  downloads 100 gist objects per request
 **  (200 total).  Then displayGists() responds
 **  to user selections on the webpage to display
 **  a subset of these.
 ************************************************/

window.onload = function() {
  console.log('window.onload running');
  var settings = JSON.parse(localStorage.getItem('userSettings'));
  if (settings === null) {
      settings = { favsArray: [], allGistsArray: []};
      localStorage.setItem('userSettings', JSON.stringify(settings));
  } else {
      settings['allGistsArray'] = [];
      localStorage.setItem('userSettings', JSON.stringify(settings));
  }
  displayGists();
};




/***************************************************
 ** function to get new Gists
 ** gets 200 of the most recent Gists, then stores
 ** them in local settings and calls displayGists()
 *************************************************/
function getGists() {
  console.log('in getGists');
  var req1 = new XMLHttpRequest();
  var req2 = new XMLHttpRequest();
  if (!req1 && !req2) {
    throw 'Unable to create HttpRequest.';
  }
  var url = 'https://api.github.com/gists/public';

  //load the local storage variable
  var userSettings = JSON.parse(localStorage.getItem('userSettings'));
  console.log(userSettings);

  //clear out the old gists in the gist array to prepare for reload
  userSettings['allGistsArray'] = [];

  //when the request is fulfilled
  req1.onreadystatechange = function() {
    if (req1.readyState == 4) {

      //load the XMLHttpRequest response into a variable
      var gistList = JSON.parse(this.responseText);
      var previousGistList = userSettings['allGistsArray'];
      userSettings['allGistsArray'] = [].concat(previousGistList, gistList);
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      displayGists();
    }
  };

  req2.onreadystatechange = function() {
    if (req2.readyState == 4) {

      //load the XMLHttpRequest response into a variable
      var gistList = JSON.parse(this.responseText);
      var previousGistList = userSettings['allGistsArray'];
      userSettings['allGistsArray'] = [].concat(previousGistList, gistList);
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      displayGists();
    }
  };

  //get the first 100
  req1.open('GET', (url + '?page=1&per_page=100'));
  req1.send();

  //Now do the same thing with the second page of 100 gists
  console.log(url);
  req2.open('GET', (url + '?page=2&per_page=100'));
  req2.send();
}


/********************************************************
 ** displayGists() is the main function on the page. Most
 ** of the interactive components of the page call this
 ** function, which updates the display.  It reads the
 ** array of downloaded gists and favorite gists, removes
 ** any favorites that are in the downloaded list, and
 ** then displays divs containing each gist.
 ********************************************************/
function displayGists() {
  var userSettings = JSON.parse(localStorage.getItem('userSettings'));
  var favorites = userSettings['favsArray'];
  var favLength = favorites.length;
  var gistList = userSettings['allGistsArray'];
  var gistListLength = gistList.length;
  var gistResultsElement = document.getElementById('Gist_search_results');
  var favElement = document.getElementById('Gist_favorite_results');
  var numPerPageElement = document.getElementsByName('numPerPage');
  var numPerPage = numPerPageElement[0].value;

  //ensure numPerPage is between 1 and 30
  if ((numPerPage > 30) || (numPerPage < 1)) {
    numPerPage = 30;
    numPerPageElement[0].value = 30;
  }
  var pageNumberElement = document.getElementsByName('page#');

  //determine which page number is selected.
  for (var j = 0; j < pageNumberElement.length; j++) {
    if (pageNumberElement[j].checked) {
      var pageNumber = j;
      break;
    }
  }

  for (var i = 0; i < favLength; i++) {
    for (var j = 0; j < gistListLength; j++) {
      if (gistList[j].url === favorites[i].url) {
        gistList = gistList.slice(j, 1);
        gistListLength = gistList.length;
        j--;
      }
    }
  }
  userSettings['allGistsArray'] = gistList;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));


  //Create a div for each GIST to be displayed and display
  if (gistList.length > 0) {
    gistResultsElement.innerHTML = null;
    for (var i = ((pageNumber) * numPerPage);
         i < ((pageNumber + 1) * numPerPage);
         i++) {
      var resultDiv = createNonFavGistDiv(gistList[i]);
      gistResultsElement.appendChild(resultDiv);
    }
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


/*****************************************
 ** creates a div for each downloaded Gist
 ** that isn't a favorite, including a
 ** description, a url, a link, and a
 ** button to make it a favorite
 ** @param {gistObject} gistObject A gist object
 ** @return {resultDiv} div A div containing
 ** the gist object
 *****************************************/
function createNonFavGistDiv(gistObject) {
  var resultDiv = document.createElement('div');
  var para = document.createElement('P');
  var linkUrl = gistObject.url;
  var link = document.createElement('a');

  para.innerHTML = 'description: ' + gistObject.description;
  if ((!gistObject.description) || (gistObject.description === '') ||
      (gistObject.description == null)) {
    para.innerHTML += '<p style="color:red:>NO DESCRIPTION</p>';
  }
  para.innerHTML += '<br>' + linkUrl;
  link.href = linkUrl;
  link.title = 'LINK';
  link.innerHTML = 'LINK';
  var button = document.createElement('BUTTON');
  button.type = 'button';
  button.setAttribute('onclick', 'makeFavorite(this)');
  button.value = '+Favorite';
  button.innerHTML = '+Favorite';
  resultDiv.appendChild(para);
  resultDiv.appendChild(link);
  resultDiv.appendChild(button);
  resultDiv.setAttribute('id', 'resultDiv');
  return resultDiv;
}



/*****************************************
 ** creates a div for each downloaded Gist
 ** that IS a favorite, including a
 ** description, a url, a link, and a
 ** button to remove it from the favorites
 ** list.
 ** @param {gistObject} gistObject A gist object
 ** @return {resultDiv} div A div containing
 ** the gist object
 *****************************************/
function createFavDiv(gistObject) {
  console.log('In createFavDiv');
  console.log(gistObject);
  var resultDiv = document.createElement('div');
  var para = document.createElement('P');
  var linkUrl = gistObject.url;
  var link = document.createElement('a');

  para.innerHTML = 'description: ' + gistObject.description;
  if ((!gistObject.description) || (gistObject.description === '') ||
      (gistObject.description == null)) {
    para.innerHTML += '<p style="color:red:>NO DESCRIPTION</p>';
  }
  para.innerHTML += '<br>' + linkUrl;

  link.href = linkUrl;
  link.title = 'LINK';
  link.innerHTML = 'LINK';
  var button = document.createElement('BUTTON');
  button.type = 'button';
  button.setAttribute('onclick', 'removeFavorite(this)');
  button.value = '-Favorite';
  button.innerHTML = '-Favorite';
  resultDiv.appendChild(para);
  resultDiv.appendChild(link);
  resultDiv.appendChild(button);
  resultDiv.setAttribute('id', 'resultDiv');
  return resultDiv;
}


/***********************************************
 ** function called when "+favorite" button is
 ** pressed.  Removes the item from the downloaded
 ** gist array and adds it to the favorites array.
 ** @param {html element} elem -- the div that
 ** called the makeFavorite function
 ************************************************/
function makeFavorite(elem) {
  //Get and Parse all the local storage items
  var userSettings = JSON.parse(localStorage.getItem('userSettings'));
  var gistList = userSettings['allGistsArray'];
  var favsList = userSettings['favsArray'];
  var gistListLength = gistList.length;

  //get the URL of the <a> tag in the calling DIV
  var linkString = elem.parentNode.childNodes[1].href;

  //search the list of non-fav Gists for the one with that matches the
  //caller.
  for (var i = 0; i < gistListLength; i++) {
    if (gistList[i].url === linkString) {
      //if we've found the item, remove it from gistList and
      //add it to favsList
      favsList.push(gistList.splice(i, 1)[0]);
      break;
    }
  }

  userSettings['allGistsArray'] = gistList;
  userSettings['favsArray'] = favsList;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));

  displayGists();
}




/***********************************************
 ** function called when "-favorite" button is
 ** pressed.  Removes the item from the favorites
 ** array.
 ** @param {html element} elem -- the div that
 ** called the removeFavorite function
 ************************************************/
function removeFavorite(elem) {
  //Get and Parse all the local storage items
  var userSettings = JSON.parse(localStorage.getItem('userSettings'));
  var favsList = userSettings['favsArray'];
  var favsListLength = favsList.length;


  //get the URL of the <a> tag in the calling DIV
  var linkString = elem.parentNode.childNodes[1].href;
  console.log('linkString');
  //search the list of fav Gists for the one with that matches the
  //caller.
  for (var i = 0; i < favsListLength; i++) {
    if (favsList[i].url === linkString) {
      //if we've found the item, remove it from favsList
      favsList.splice(i, 1);
      break;
    }
  }

  //store the arrays back in local storage
  userSettings['favsArray'] = favsList;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));

  //display the updated results.
  displayGists();
}
