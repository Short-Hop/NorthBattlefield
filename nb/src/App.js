import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios"
import Merge from "./components/Merge"

const API_KEY = "qRuqnEF3gOqILOkbPfdzDFrJ1Ct4P8HjdbWOSzCq";
const username = "pomegranatron"


let newData
let oldData
function App() {
  const [merger, setmerger] = useState(<></>)

  
  function handleForm(event) {
    event.preventDefault()
    console.log(event.target.tournament.value)
    let url = event.target.tournament.value
    url = url.replace("https://challonge.com/", "")
    console.log(url)
    axios.get("http://localhost:8080/api/challonge/" + url).then(response => {

      newData = response.data
      console.log(newData.players)
      axios.get("http://localhost:8080/api/data").then(response => {
        
        oldData = response.data
        let foundDate = oldData.dates.filter(date => {
          return date === newData.timestamp
        })

        if (foundDate.length > 0) {
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
        oldData.players[oldDataIndex].brackets.push({
          score: newData.players[newDataIndex].score,
          timestamp: newData.timestamp
        })
      } else {
        let newplayer = {
          tag: newData.players[index].tag,
          brackets:[{
            score: newData.players[index].score,
            timestamp: newData.timestamp,
          }]
        }
        oldData.players.push(newplayer);
      }
    })

    oldData.dates.push(newData.timestamp)

    console.log(oldData)
    axios.post("http://localhost:8080/api/data", oldData).then(response => {
      console.log(response);
    })

  }

  return (
    <div className="App">
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
      

    </div>
  );
}

export default App;
