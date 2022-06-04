document.onreadystatechange = function () {
    if (document.readyState === 'complete') {


if ((document.title.indexOf("Google") != -1) || (document.title.indexOf("Co-WIN Application") != -1)) {
    //Creating Elements
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("Sort Centres");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);
    console.log("button created");


function sleep(milliseconds) {
  const start = Date.now();
  while (Date.now() - start < milliseconds);
}

console.log("Hello"+Date.now());
sleep(1000);
console.log("World!"+Date.now());



}
var setButton = document.createElement("button");
    setButton.textContent = "Sort Centres";
    setButton.id = "setter2";
    setButton.type = "button";	
    setButton.style.background = "Green";
    setButton.addEventListener("click", function() {
	      start();
    });
document.getElementsByTagName('h3')[0].appendChild(setButton);


function start(){
console.log(document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].childElementCount)
//start = new Date(document.getElementsByClassName("availability-date")[0].children[0].innerText)
console.log(document.getElementsByClassName("availability-date")[0].children[0].innerText)
numberofvenue  = document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].childElementCount
if (new Date().getHours() < 17) {
selectdate=0;}
else {selectdate=1;}

var todaywrtstart = parseInt((new Date(document.getElementsByClassName("availability-date")[0].children[0].innerText) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24), 10)+selectdate; 
//document.getElementsByClassName('availability-date')[0].appendChild(setButton);

for(k=0; k<numberofvenue; k++){
obj = {}
for(var i = 0; i < document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].childElementCount; i++)
{
//j=i*document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].children[0].children[0].children[0].children[1].children[0].children[1].children[0].childElementCount + todaywrtstart;
b = document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].children[i].innerHTML
a = parseInt(document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].children[i].getElementsByClassName("slot-available-wrap")[0].children[todaywrtstart].children[0].children[0].children[0].innerText)
a = a || 0
obj[i]=a
//console.log(i)
};
var items = Object.keys(obj).map(function(key) {
  return [key,obj[key]];
});
console.log(items);
// Sort the array based on the second element
items.sort(function(first, second) {
  return second[1] - first[1];
});
console.log(items)
var fillin = document.getElementsByClassName("mat-main-field center-main-field")[0].children[0]
console.log(fillin.children[parseInt(items[numberofvenue-1][0])])
fillin.insertBefore(fillin.children[parseInt(items[numberofvenue-k-1][0])],fillin.firstElementChild)
//document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].appendChild(document.getElementsByClassName("mat-main-field center-main-field")[0].children[0].children[parseInt(items[k][0])])
console.log(numberofvenue-k-1)
console.log(items[numberofvenue-k-1][0])
//console.log(fillin.children[parseInt(items[numberofvenue-k-1][0])])
console.log("======================="+k)
}
};
    console.log("function created");

//document.getElementsByClassName("button-native").onclick  = start
 //   console.log("function executed	");


//document.getElementsByClassName("pin-search-btn district-search md button button-solid ion-activatable ion-focusable hydrated ion-activated").onclick = start()


    }
  }

