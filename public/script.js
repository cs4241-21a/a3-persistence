// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
let user = null
let list = document.getElementById("mat_list")
const template = document.getElementById("material")
window.onload = function() {
  document.getElementById("welcome").innerHTML = "Welcome!"
  fetch( "/update", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: "{}"
  })
  .then( ( response ) => response.json() )
  .then( function( data ) {
    console.log(data)
    load( data )
  })

}

const calcDens = function (mass, volume){
  return mass/volume
}

const calcCost = function (mass, cost){
  return mass * cost
}

const load = function ( json ) {

    list.innerHTML = ""

    json.forEach( mat => {
        let element = template.cloneNode( true )
        console.log(mat)

        
      list.append( element )
    });

    return false
}