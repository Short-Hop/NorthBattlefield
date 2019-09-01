const express = require('express')
const app = express()
const axios = require("axios")
const cors = require('cors')
const fs = require("fs")
var { graphql, buildSchema } = require('graphql');

// let data = JSON.parse(fs.readFileSync("./data/players.json"))


app.use(cors())
app.use(express.json());
 
app.get('/api/challonge/:id', (req, res) => {

    console.log(req.params.id)

    let players = []

    axios.get(`https://pomegranatron:qRuqnEF3gOqILOkbPfdzDFrJ1Ct4P8HjdbWOSzCq@api.challonge.com/v1/tournaments/${req.params.id}/participants.json`).then(response => {
        response.data.forEach(item => {

            let newplayer = {
                tag: item.participant.name,
                id: item.participant.id,
                finalrank: item.participant.final_rank,
                score: 0,
                gameswon: 0,
                gameslost: 0,
            }

            players.push(newplayer);
        })

        axios.get(`https://pomegranatron:qRuqnEF3gOqILOkbPfdzDFrJ1Ct4P8HjdbWOSzCq@api.challonge.com/v1/tournaments/${req.params.id}/matches.json`).then(response => {


            let totalgames = 0;
            response.data.forEach(item => {

                let winner = item.match.winner_id;
                let loser = item.match.loser_id;
                
                let games1 = parseInt(item.match.scores_csv.charAt(0))
                let games2 = parseInt(item.match.scores_csv.charAt(2))
                totalgames = totalgames + games1 + games2;

                let winscore = 0
                let losescore = 0

                if (games1 >= games2) {
                    winscore = games1
                    losescore = games2
                } else {
                    winscore = games2
                    losescore = games1
                }
                
                players.forEach((player, index) => {
                    if (player.id === winner) {
                        players[index].gameswon = players[index].gameswon + winscore
                        players[index].gameslost = players[index].gameslost + losescore
                        
                    }
                    if (player.id === loser) {
                        players[index].gameswon = players[index].gameswon + losescore
                        players[index].gameslost = players[index].gameslost + winscore
                    }
                })
            })

            let totalplayers = players.length
            
            players.forEach((player, index) => {
                console.log(player.tag)
                let score = (totalplayers - (player.finalrank - 1)) /totalplayers 
                console.log(score)
                let ratio = player.gameswon / (player.gameswon + player.gameslost)
                console.log(ratio)
                players[index].score = score * ratio;
                console.log(players[index].score)
            })

            axios.get(`https://pomegranatron:qRuqnEF3gOqILOkbPfdzDFrJ1Ct4P8HjdbWOSzCq@api.challonge.com/v1/tournaments/${req.params.id}.json`).then(response => {

                console.log(response.data.tournament.started_at)   
                let date = new Date(response.data.tournament.started_at)
                let timestamp = date.getTime();
                
                let event = {
                    timestamp: timestamp,
                    players: players
                }

                res.send(event)
                // let newDate = new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)), parseInt(date.substr(8, 2)))
                // console.log(newDate);
            })

            
    
        }).catch(err => {
            console.log(err)
        })
    })  
})

app.get("/api/data", (req, res)  => {
    data = fs.readFileSync("./data/players.json")
    res.send(data);
})

app.post("/api/data", (req, res)  => {
    console.log(req.body);
    fs.renameSync("./data/players.json", "./data/playersPrevious.json")
    fs.writeFileSync("./data/players.json", JSON.stringify(req.body))
    res.sendStatus(200)
})

app.get('/api/smashgg/:id', (req, res) => {
    
})
 
console.log("listening on port 8080. . .")
app.listen(8080)