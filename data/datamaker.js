const fs = require("fs")

let data = JSON.parse(fs.readFileSync("./players.json", "utf8"))
let newData = {
    dates: [1545092864498, 1546906127468, 1547510809926],
    players: data
}

fs.writeFileSync("./playersnew.json", JSON.stringify(newData))
    