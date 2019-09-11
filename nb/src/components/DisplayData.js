import React, { useState, useEffect } from 'react';
import axios from "axios"
import CanvasJSReact from "./canvasjs.react";
import Nav from "./Nav"
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


let oldData
function DisplayData(props) {
    const [options, setoptions] = useState({})
    const [rankings, setrankings] = useState([])

    useEffect(()=> {
        axios.get("http://localhost:8080/api/data").then(response => {
            oldData = response.data


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
                })
                finalPlayerArray.push(newAverageData);
            })

            
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
            finalPlayerArray = finalPlayerArray.sort((player1, player2) => {
                // console.log(player1.dataPoints[player1.dataPoints.length - 1]);
                // console.log(player1.name);
                return player2.dataPoints[player2.dataPoints.length - 1].y - player1.dataPoints[player1.dataPoints.length - 1].y
            })


            newoptions.data = finalPlayerArray;
            console.log(finalPlayerArray)
            setoptions(newoptions);
            setrankings(finalPlayerArray)

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

        if(index === -1) {
            return -1;
        }

        if (index < 4) {
            startindex = 0
        } else {
            startindex = index - 4
        }

        for(let i = startindex; i <= index; i++) {
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
            }
            totalscore = totalscore + player.events[i].score
        }
        averageScore = totalscore / ((index - startindex) + 1)
        let penalty = (penaltyPoints * 0.05)
        averageScore = averageScore - penalty; 
        return averageScore;
    }

    return (
        <div className="pr">
            <Nav match={props.match}></Nav>
            <div className="chart">
                <CanvasJSChart options = {options} />
            </div>
            <h1>Top 10</h1>
            <div className="top10">
                {rankings.map((player, index) => {
                    if (index < 10) {
                        return (
                            <>
                            <h2>{index + 1}.  {player.name}</h2>
                            <h5>Score: {Math.round(player.dataPoints[player.dataPoints.length - 1].y * 100)}</h5>
                            </>
                        )
                    }
                    
                })}
            </div>
        </div>
    )
}

export default DisplayData