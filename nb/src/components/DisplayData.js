import React, { useState, useEffect } from 'react';
import axios from "axios"
import CanvasJSReact from "./canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let oldData
function DisplayData(props) {

    const [data, setdata] = useState(
        {
            events: [],
            players: [],
        }
    )
    const [options, setoptions] = useState({})

    useEffect(()=> {
        axios.get("http://localhost:8080/api/data").then(response => {
            oldData = response.data
            setdata(oldData)

            let finalPlayerArray = []

            let filteredPlayers = oldData.players.filter(player => {
                let total = 0
                for(let i = oldData.events.length - 1; i >= oldData.events.length - 10; i--) {
                    
                    player.events.forEach(event => {
                        if (event.id === oldData.events[i].id) {
                            total++
                        }
                    })
                }
                
                return total >= 5
            })

            let allDates = oldData.events.slice(4)

            filteredPlayers.forEach(player => {
                let newAverageData = {
                    type: "spline",
                    name: player.tag,
                    showInLegend: true,
                    dataPoints:[]
                }
                let missedDates = 0;
                allDates.forEach(date => {
                    let dateString = String(new Date(date.date)) 
                    dateString = dateString.substr(0, 15)
                    let graphdata = {
                        y: 0,
                        label: dateString
                    }
                    if (getPRforDate(player, date) === -1) {
                        let betweeenScore;
                        if (missedDates > 0) {
                            if(newAverageData.dataPoints[newAverageData.dataPoints.length - 1]) {
                                betweeenScore = ((newAverageData.dataPoints[newAverageData.dataPoints.length - 1].y - (0.05*missedDates)))
                                if (betweeenScore < 0){
                                    betweeenScore = 0;
                                }
                                missedDates++;
                                graphdata.y = betweeenScore
                                newAverageData.dataPoints.push(graphdata)
                            } else {
                                betweeenScore = 0;
                            }
                        } else {
                            console.log(newAverageData.dataPoints.length)
                            if (newAverageData.dataPoints[newAverageData.dataPoints.length - 1]) {
                                betweeenScore = newAverageData.dataPoints[newAverageData.dataPoints.length - 1].y
                                missedDates++;
                                graphdata.y = betweeenScore
                                newAverageData.dataPoints.push(graphdata)
                            }   else {
                                graphdata.y = 0;
                                newAverageData.dataPoints.push(graphdata)
                            }
                            
                        }
                    } else {
                        missedDates = 0;
                        graphdata.y = getPRforDate(player, date)
                        newAverageData.dataPoints.push(graphdata)
                    }
                    // console.log("His Previous Score was " + newAverageData.scores[newAverageData.scores.length - 1])
                    // newAverageData.scores.push(getPRforDate(player, date))
                    
                })
                finalPlayerArray.push(newAverageData);
            })
            // console.log(allDates)

            // console.log(filteredPlayers);
            console.log(finalPlayerArray)
            let newoptions = {
                animationEnabled: true,	
                zoomEnabled: true,
                title:{
                    text: "North Battlefield Power Rankings"
                },
                axisY : {
                    title: "Power Ranking",
                    includeZero: true
                },
                toolTip: {
                    shared: true
                },
                data: []
            }
            newoptions.data = finalPlayerArray;
            setoptions(newoptions);
        })
    },[])

    function getPRforDate(player, event) {
        let id = event.id;
        let startindex;
        let penaltyPoints = 0;
        let averageScore = 0;
        let totalscore = 0;
        let previousDate;
        let previousId;
        let index = player.events.findIndex(playedEvent => {
            return playedEvent.id === id;
        })

        console.log("Calculating Average for " + event.name)
        console.log("Index is " + index)

        if(index === -1) {
            return -1;
        }

        if (index < 4) {
            startindex = 0
        } else {
            startindex = index - 4
        }

        for(let i = startindex; i <= index; i++) {
            console.log("I is " + i)
            if (i > 0) {

                let currentEvent = oldData.events.findIndex(item => {
                    return item.id === player.events[i].id
                })

                if (player.events.findIndex(item => {
                    return item.id === oldData.events[currentEvent-1].id;
                }) == -1) {
                    if((oldData.events[currentEvent].date - oldData.events[currentEvent].date) > 518400000) {
                        penaltyPoints++;
                    }
                }

                console.log(player.tag)

                console.log("Event was: " + oldData.events[currentEvent].name)
                console.log("Previous event was: " + oldData.events[currentEvent-1].name)
                
                console.log("Total Penalty Points: " + penaltyPoints)

            }
            console.log(player.events[i].score)
            totalscore = totalscore + player.events[i].score
            console.log("Total Score: " + totalscore)
        }
        
        averageScore = totalscore / ((index - startindex) + 1)
        
        let penalty = (penaltyPoints * 0.05)
        console.log(penalty)
        console.log(averageScore);

        averageScore = averageScore - penalty; 
        return averageScore;
    }

    


    return (
        <div>
            <CanvasJSChart options = {options} />
        </div>
			
	
    )
    
    
    
    
    
    // return (
    //     <div>
    //         <table>
    //             <tbody>
    //                 <tr>
    //                     <th>Tag</th>
    //                     <th>Events Entered</th>
    //                     <th>Scores</th>
    //                 </tr>
    //             </tbody>
                
    //             {data.players.map(player => {
    //             return (
    //                 <tr>
    //                     <td>{player.tag}</td>
    //                     <td>{player.events.length}</td>
    //                     <td>
    //                         {player.events.map(event => {
    //                              return (
    //                                  <div>{Math.round(event.score * 100) / 100}</div>
    //                              )
    //                          })}
    //                      </td>
    //                 </tr>
    //             )
    //         })}
    //         </table>
            
    //     </div>
    // )
}

export default DisplayData