let sound
let howls = []
let rain_sound, lofi_music


/**
 * Adds the mix to the database and plays it
 * after the "play" button is clicked.
 * @param {Event} e The onclick event
 */
const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    let inputs = [
      document.getElementsByName('rain_level'),
      document.getElementsByName('environment'),
      document.getElementsByName('lofi')
    ];
    let input_values = []
    let rain_level_index = 0, environment_index = 1, lofi_index = 2
    let mix_name = document.getElementsByName('rain_mix_name')[0].value
    let sounds = []

    // get input values from the html form
    for (let i = 0; i < inputs.length; i++) {
      current_input = inputs[i]
      
      for(j = 0; j < current_input.length; j++) {
        if(current_input[j].checked) {
          // console.log(current_input[j].id)
          input_values.push(current_input[j].id)

          // add rain and lofi specs to sounds array
          if (i == rain_level_index || i == lofi_index)
            sounds.push(current_input[j].id)
        } 
      }
    }

    // store data in json
    json = { 
      rain_mix_name: mix_name,
      rain_level: input_values[rain_level_index],
      environment: input_values[environment_index],
      lofi: input_values[lofi_index],
      sounds: sounds,
      // rain_volume: rain_volume.toFixed(1)
    },
    body = JSON.stringify( json )
    console.log(body)
    // debugger
    fetch( '/submit', {
      method:'POST',
      body 
    })
    .then(function(response) {
      if(response.ok)
        return response.json()
    })
    .then( jsonstr => JSON.parse(jsonstr))
    .then(function (json) {
      console.log(json)
      playNewSound(json)
      setBG(json.environment)
      updateHistory()
        // howls[1].volume(0.5)
    })
    return false
  }

window.onload = function() {
  const play_button = document.getElementById( 'play' )
  play_button.onclick = submit
  updateHistory()

  // const play_history_button = document.getElementById('play_history')
  // play_history_button.onclick = playHistory
}

/**
 * Sets the background image according
 * to the environment specified
 * @param {String} environment The environment
 */
function setBG(environment) {
  let bg = document.getElementById("bg-image")
  bg.style.backgroundImage = "url(../backgrounds/"+environment+".jpeg)"
}

/**
 * Gets the correct audio file paths
 * based on the given json
 * @param {Object} input_json The given json
 * @returns An array of audio file paths
 */
function getAudioFiles(input_json) {
  let result = []

  // add lofi if necessary
  if (input_json.lofi === "lofi_on") {
    result.push('../sounds/lofi.mp3')
  }
  // add rain sound
  result.push('../sounds/'+input_json.rain_level+'.wav')
  // console.log('sounds', result)
  return result
}


/**
 * Plays the new sounds based on
 * the given json
 * @param {Object} json The given json
 * @param {boolean} isSnippet Whether or not to
 * play a snippet instead of looping
 */
function playNewSound(json, isSnippet = false) {
  let newSound = getAudioFiles(json)
  let volumes = [json.rain_volume, "1.0"]

  // stop the previous sound
  if (howls[0] !== undefined) {
    howls[0].stop(['rain_sound'])
    howls[0].stop()
    if (isSnippet) howls[0].stop('snippet')
  }
  if (howls[1] !== undefined) {
    howls[1].stop(['lofi_music'])
    howls[1].stop()
    if (isSnippet) howls[1].stop('snippet')
  }

  // set up the Howl(s)
  if (!isSnippet) {  // looping
    for (let i = 0; i < newSound.length; i++) {
      howls[i] = new Howl({
        src: newSound[i],
        autoplay: true,
        loop: true,
        volume: parseFloat(volumes[i])
      })
      // console.log('howl', howls[i])
    }
  // } else {  // snippet
  //   for (let i = 0; i < newSound.length; i++) {
  //     console.log('i', i)
  //     console.log('math random', Math.floor(Math.random()*10000))
  //     console.log('volumes', volumes)
  //     console.log('newSound', newSound)
  //     howls[i] = new Howl({
  //       src: newSound[i],
  //       volume: parseFloat(volumes[i]),
  //       sprite: {
  //         snippet: [Math.floor(Math.random()*10000), 5000]
  //       }
  //     })
  //     // console.log('howl', howls[i])
  //   }
  } else {  // snippet
    for (let i = 0; i < newSound.length; i++) {
      // console.log('i', i)
      // console.log('math random', Math.floor(Math.random()*10000))
      // console.log('volumes', volumes)
      // console.log('newSound', newSound)
      howls[i] = new Howl({
        src: newSound[i],
        volume: parseFloat(volumes[i]),
        onend: function() {
          console.log('finished snippet')
        },
        sprite: {
          snippet: [0, 5000]
        }
      })
      // console.log('howl', howls[i])
    }
  }

  // play the sound(s)
  // console.log('volume is', json.rain_volume)
  // howls[0].volume(parseFloat(json.rain_volume))
  if(!isSnippet) {
    rain_sound = howls[0].play();
    if (howls[1] !== undefined)
      lofi_music = howls[1].play();
  } else {
    rain_sound = howls[0].play('snippet');
    if (howls[1] !== undefined)
      lofi_music = howls[1].play('snippet');
    console.log('playing')

    setTimeout(function() {
      howls[0].stop('snippet')
      howls[1].stop('snippet')
    }, 5000);
  }



  // show the mix name
  // let text = document.getElementById('current_mix_name')
  // text.innerHTML = json.rain_mix_name
}

// todo separate function for remove


/**
 * Updates the history table using the data
 * from the database
 */
function updateHistory() {
  let history_table = document.getElementById("history_table")

  // call the /getHistory route
  // returns array of json objects for all the mixes
  fetch( '/getHistory', {
    method:'GET'
  })
  .then(function(response) {
    // console.log('get history response', response)
    if(response.ok)
      return response.json()
  })
  .then( function(jsonArr) {
    console.log('mix history')
    console.log(jsonArr)

    let num_rows = history_table.rows.length

    // clear the table
    for (let i = 1; i < num_rows; i++) {
      console.log(i)
      console.log(history_table)
      history_table.deleteRow(1)
    }

    // add each mix json to the table
    jsonArr.forEach((object)  => {
      // console.log('mix', object)
      let row = history_table.insertRow(1)
      let json_keys = []

      // get json keys
      for (var key in object) {
        json_keys.push(key)
      }
      // console.log(json_keys)
      // update table with new data from json
      for (let i = 1; i < 7; i++) {
        let cell = row.insertCell(i-1)
        if (i === 5) {i = 6}
        cell.innerHTML = object[json_keys[i]].replace('_', ' ')
      }

      // todo add modify button

      // add delete button
      let del_cell = row.insertCell(5)
      let del_btn = document.createElement("button")
      let del_t = document.createTextNode('delete')
      del_btn.appendChild(del_t)
      del_cell.appendChild(del_btn)

      del_btn.onclick = remove
    })
  })
}


/**
 * Removes the selected mix after the "delete"
 * button is pressed.
 * @param {Event} e The onclick event
 */
const remove = function(e) {
  // prevent default form action from being carried out
  e.preventDefault()

  let row_index = e.path[2].rowIndex

  // get the mix history (array)
  fetch( '/getHistory', {
    method:'GET'
  })
  .then(function(response) {
    if(response.ok)
      return response.json()
  })
  .then(function(jsonArr) {
    // console.log('get history response', response)
    console.log('jsonArr', jsonArr)
    let json = jsonArr[jsonArr.length - row_index]
    console.log('this json', json)
    let json_keys = []
    for (var key in json) {
      json_keys.push(key)
    }
    // tell the database to remove the selected mix
    body = JSON.stringify({_id: json[json_keys[0]]})
    fetch( '/remove', {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    .then(async function(response) {
      console.log('delete response', response.json)
      // if the removal was successful, delete the row from the table
      if(response.ok)
        history_table.deleteRow(row_index)
    })
    return false
  })
}


/**
 * Play each mix for 10 sec after the
 * "play history" button is clicked.
 * @param {Event} e The onclick event
 */
// todo finish this function
const playHistory = function(e) {
  // prevent default form action from being carried out
  e.preventDefault()

  fetch('/getHistory', {
    method: 'GET',
  })
  .then(function (response) {
    if(response.ok)
      return response.json()
  })
  .then(function(jsonArr) {
    console.log('json history array', jsonArr)
    for (json_idx = 0; json_idx < jsonArr.length; json_idx++) {
      json = jsonArr[json_idx]
      console.log('json index', json_idx)
      console.log('current json', json)
      // if (json_idx > 0) {
      // console.log('before timeout')
      setTimeout(function() {
        console.log('before timeout')
        playNewSound(json, true)
        console.log('after timeout')
      }, 5000 * json_idx)
      // console.log('after timeout')
      // }
      // else
      //   playNewSound(json)
    }
  })
  //   response.text().then(function (jsonData) {
  //       console.log(jsonData)
  //       let appdata = JSON.parse(jsonData);
  //       if (appdata.length !== 0) {
  //           appdata.forEach(element => addNewElt(element));
  //       }
  //   })
  // })
}