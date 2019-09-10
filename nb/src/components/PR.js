import React, { useState, useEffect } from 'react';
import axios from "axios"
import Merge from "./Merge"
import DisplayData from "./DisplayData"
import Nav from "./Nav"
import Home from "./Home"
import Footer from "./Footer"

const API_KEY = "qRuqnEF3gOqILOkbPfdzDFrJ1Ct4P8HjdbWOSzCq";
const username = "pomegranatron"


let newData
let oldData
let tourneyId

function App() {
  const [merger, setmerger] = useState(<></>)

  function handleForm(event) {
    event.preventDefault()
    console.log(event.target.tournament.value)
    tourneyId = event.target.tournament.value
    tourneyId = tourneyId.replace("https://challonge.com/", "")
    tourneyId = tourneyId.replace("http://www.challonge.com/", "")
    
    axios.get("http://localhost:8080/api/challonge/" + tourneyId).then(response => {

      newData = response.data
      console.log(newData.players)
      axios.get("http://localhost:8080/api/data").then(response => {
        
        oldData = response.data
        let foundId = oldData.events.filter(event => {
          return event.id === newData.id
        })

        if (foundId.length > 0) {
          console.log("Tournament already added")
          return 0;
        }

        let newNames = []
        newData.players.forEach(player => {
          let foundtag = oldData.players.filter((item) => {
            return item.tag === player.tag
          })
  
          if (foundtag.length <= 0) {
            newNames.push(player.tag);
          }
        })
        console.log(newNames);
        if (newNames.length > 0) {
          setmerger(<Merge names={newNames} newData={newData} oldData={oldData} updateData={updateData} merge={merge}></Merge>)
        } else {
          merge()
        }
        
      })
    })
  }

  function updateData(data) {
    newData = data
  }

  function merge() {
    
    newData.players.forEach((player, index) => {
      let newDataIndex = null
      let oldDataIndex = null
      oldData.players.forEach((oldplayer, index2) => {
        if (oldplayer.tag === player.tag) {
          newDataIndex = index;
          oldDataIndex = index2
        }
              
      })

      if (newDataIndex != null) {
        oldData.players[oldDataIndex].displayName = newData.players[newDataIndex].displayName;
        oldData.players[oldDataIndex].events.push({
          score: newData.players[newDataIndex].score,
          id: tourneyId
        })
      } else {
        let newplayer = {
          tag: newData.players[index].tag,
          displayName: newData.players[index].displayName,
          events:[{
            score: newData.players[index].score,
            id: tourneyId,
          }]
        }
        oldData.players.push(newplayer);
      }
    })

    let newEventdata = {
      name: newData.name,
      id: newData.id,
      date: newData.date,
    }

    oldData.events.push(newEventdata)

    oldData.events = SortEvents(oldData.events)
    console.log(oldData.events)

    setmerger(<></>)

    console.log(oldData)
    axios.post("http://localhost:8080/api/data", oldData).then(response => {
      console.log(response);
    })

  }

  function SortEvents(eventArray) {
    let newArray = eventArray.sort((a, b) => {
      return a.date - b.date
    })

    return newArray
  }

  function SortScores() {
    axios.get("http://localhost:8080/api/data").then(response => {
      oldData = response.data;

      oldData.players.forEach(player => {
        let sortedEvents = []
        oldData.events.forEach((event, index) => {
          player.events.forEach(playedEvent => {
            if (playedEvent.id === event.id) {
              sortedEvents.push(playedEvent);
            }
          })
        })

        player.events = sortedEvents;
      })

      axios.post("http://localhost:8080/api/data", oldData).then(response => {
        console.log(response);
      })
    })
  }

  return (
    <div className="pr">
      {merger}

      <form onSubmit={handleForm}>
      
        <select>
          <option>
            Challonge
          </option>
          <option>
            Smash.gg
          </option>
        </select>
        URL<input type="url" name="tournament"></input>
        {/* <input type="date" name="tournament"></input> */}
        <button type="submit">Submit</button>

      </form>
      <button onClick={SortScores}>Sort Data</button>
      {/* <DisplayData></DisplayData> */}

    </div>
  );
}

export default App;
