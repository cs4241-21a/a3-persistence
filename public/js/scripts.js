// Add some Javascript code here, to run on the front end.

const table = document.getElementById("displayinfo")

const constructTable = function(jsonarray){

    table.innerHTML = ""

    jsonarray = sortListBySharedHobbies(jsonarray)

    applyHeaders()

    //console.log(jsonarray)

    for(let i = 0; i<jsonarray.length; i++){
        let currentrow = table.insertRow()
        
        let nameslot = currentrow.insertCell(-1)
        nameslot.innerHTML = jsonarray[i].name

        let yearslot = currentrow.insertCell(-1)
        yearslot.innerHTML = jsonarray[i].year.toString()
        
        let major1slot = currentrow.insertCell(-1)
        major1slot.innerHTML = jsonarray[i].major1
        
        let major2slot = currentrow.insertCell(-1)
        major2slot.innerHTML = jsonarray[i].major2

        let minorsslot = currentrow.insertCell(-1)
        minorsslot.innerHTML = convertToString(jsonarray[i].minors)
        
        let hobbiesslot = currentrow.insertCell(-1)
        hobbiesslot.innerHTML = convertToString(jsonarray[i].hobbies)
    }
}

const applyHeaders = function(){
    let headerrow = table.insertRow()
    
    let nameheader = headerrow.insertCell()
    nameheader.outerHTML = "<th>Name</th>"

    let yearheader = headerrow.insertCell()
    yearheader.outerHTML = "<th>Grad Year</th>"
    
    let major1header = headerrow.insertCell()
    major1header.outerHTML = "<th>Primary Major</th>"
    
    let major2header = headerrow.insertCell()
    major2header.outerHTML = "<th>Secondary Major</th>"
    
    let minorsheader = headerrow.insertCell()
    minorsheader.outerHTML = "<th>Minors</th>"
    
    let hobbiesheader = headerrow.insertCell()
    hobbiesheader.outerHTML = "<th>Hobbies</th>"
}

const convertToString = function(arr){
    //console.log(arr)
    let temp = ""
    for(let i = 0; i < arr.length; i++){
        if(i === arr.length - 1){
            temp = temp.concat(arr[i])
            
        }
        else {
            temp = temp.concat(arr[i] + ", ")
        }
        //console.log(temp)
    }

    //console.log(temp)
    return temp
}

const sortListBySharedHobbies = function (jsonarray){
    let temparr = []
    temparr.push(jsonarray[0])

    let rest = []
    for(let i = 1; i < jsonarray.length; i++){
        rest.push(jsonarray[i])
    }

    let sortvalues = []
    sortvalues.push(Infinity)

    let sorting = true
    while(sorting){
        if(rest.length === 0){
            sorting = false
            break
        }
        let sortval = 0
        for(let i = 0; i < temparr[0].hobbies.length; i++){
            if(rest[0].hobbies.includes(temparr[0].hobbies[i])){
                sortval++;
            }
        }
        console.log(sortval)

        //sorting process
        if(sortvalues.length === 0){
            sortvalues.push(sortval)
        }
        else {
            let placed = false
            let traverseIndex = 0
            while(!placed){
                // check if current traverse index is equal to length
                if(traverseIndex === sortvalues.length){
                    temparr.push(rest.shift()) //remove rest[0] from rest and place it
                    placed = true
                }
                else {

                    if(sortval > sortvalues[traverseIndex]){
                        // place both the sortvalue and the object in the proper slots
                        temparr.splice(traverseIndex,0,rest.shift())
                        sortvalues.splice(traverseIndex,0,sortval)
                        console.log(temparr)
                        console.log(sortval)
                        placed = true
                    }
                    else {
                        traverseIndex++;
                    }

                }
            }
        }
        
    }

    console.log("sorted list:")
    console.log(temparr)

    return temparr
}