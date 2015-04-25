
window.onload= function() {
  console.log('window.onload running');
  var GistArray = [];
  localStorage.setItem('GistArray', JSON.stringify(GistArray));
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

    url = url+'?page='+pages+'&per_page=30';
    /*    
    //when the request is fulfilled
    req.onreadystatechange = function(){
	var gistList = JSON.parse(this.responseText);
	console.log(gistList);

    }
    req.open('GET', url);
    req.send();
    */
}