const fs = require("fs")


let newData = {
    events: [{
        name: "",
        date: 0,
        id: 0
    }],
    players: [{
        tag: "",
        displayName: "",
        events: [{
            id: "",
            score: ""
        }]
    }],
}

fs.writeFileSync("./playersnew.json", JSON.stringify(newData))
    