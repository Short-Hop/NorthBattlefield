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
        console.log(player)
        console.log(averageScore);
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
                <table>
                    <tbody>

                    
                        <tr>
                            <th>Ranking</th>
                            <th>Tag</th>
                            <th>Score</th>
                        </tr>
                    
                        {rankings.map((player, index) => {
                            if (index < 10) {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{player.name}</td>
                                        <td>Score: {Math.round(player.dataPoints[player.dataPoints.length - 1].y * 100)}</td>
                                    </tr>
                                )
                            }
                            
                        })}
                    </tbody>
                </table>
                
            </div>
            <h2>How is the PR Calculated?</h2>
            <p>For every weekly event we host, each participant gets a score for that event.  The score is calculated as follows: </p>
            <p>The first factor taken into account is the player's final rank in the bracket, let's use <a href="https://challonge.com/hbya1wfy">this bracket</a> as our example.</p>
            <p>The winner of this bracket is Veto, with second place going to JaZz</p>
            <p>The first thing we do is calculate how many people placed higher than each player, which can be calculated by subtracting one from the player's final ranking.</p>
            <p>Veto got first so he was beat by zero players, JaZz got second so he was beat by one player.</p>
            <p>The number of players that beat each player is then subtracted from the total number of players, giving us the number of players each player beat.</p>
            <p>There are 10 players in this bracket, so for Veto, this value is 10, for JaZz it's 9.</p>
            
            <p>That number is then used to generate a "max score" value.  The max score is the number of players you beat, divided by the total amount of players in the bracket</p>
            <p>(Technically Veto only beat 9 out of the 10 participants, because he didnt fight himself.  It's calculated this way so that the winner of a bracket gets a "max score" value of 1)</p>

            <p>Max Score = (Total Players - (Final Ranking - 1)) / Total players)</p>
            <p>For Veto, the calculation would look like this: </p>
            <p>Max Score = (10 - (1 - 1))/10</p>
            <p>Max Score = (10 - 0)/10</p>
            <p>Max Score = 10/10</p>
            <p>Max Score = 1</p>

            <p>For Pasta who placed 5th, it would look like this: </p>
            <p>Max Score = (10 - (5 - 1))/10</p>
            <p>Max Score = (10 - 4)/10</p>
            <p>Max Score = 6/10</p>
            <p>Max Score = 0.6</p>

            <p>Keep in mind that even if you do not win a set, this max score value will not be zero, as the lowest you can place in a 10 player bracket is 9th which will still give you a score of 0.2.</p>

            <p>Once the "max score" is calculated, each player recieves a multiplier based on the ratio of induvidual games they won or lost.</p>
            <p>Multiplier = Games won / Games played</p>
            <p>For example, in this set, Veto played 16 games.  Out of these 16 games he won 11.</p>
            <p>Multiplier = 11 / 16</p>
            <p>Multiplier = 0.6875</p>

            <p>JaZz played 17 games and won 9.</p>
            <p>Multiplier = 9 / 17</p>
            <p>Multiplier = 0.5294</p>

            <p>Finally, each player's max score gets multipled by their multiplier.</p>

            <p>Veto: 1 x 0.6875 = 0.6875</p>
            <p>JaZz: 0.9 x 0.5294 = 0.4765</p>

            <p>As you can see, if you won the bracket without losing a single game, your final score would be 1, and if you didn't win a single game during the bracket, your final score would be 0.</p>
            <p>We aren't quite dont yet.  With this, we can calculate each player's score for each bracket they participate in, however, the player's past results are taken into account as well.</p>
            <p>First we find the average of the player's scores for the last 5 events they participated in</p>
            <p>In order to prevent a player from staying on the top of the PR without participating in brackets, there is a penalty system for missing brackets.</p>

            <p>Here's where things get a little complicated</p>
            <p>If you miss one weekly event, you recieve no penalty, but for every subsiquent event you miss, you recieve a penalty point.</p>
            <p>Each penalty point will be multiplied by 0.05, and subtracted from the player's average score for that week.</p>
            <p>Every time you participate in an event, your penalty points go back to zero.</p>

            <p>So let's say, Veto goes on a vacation and misses four weekly events.  When the data for week 1 is added to the PR, Veto's score will carry over from the previous week unaffected.</p>
            <p>However, when week 2's data is entered, Veto's score will be reduced by 0.05.  By week three his score will be reduced by another 0.10, and by week four, another 0.15.</p>
            <p>When Veto finally returns and participates in a bracket, his score will have been reduced by a total of 0.30.</p>

            <p>An example of this can be seen with Tilter's score.  Tilter stopped attending brackets after March 04th, so his PR score takes a dive until he returns July 29th.</p>

            <p>Keep in mind that<strong> only players who have participated in at least 5 of the last 10 weekly events will be displayed on the PR.</strong></p>
        </div>
    )
}

export default DisplayData