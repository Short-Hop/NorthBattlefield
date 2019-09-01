import React, { useState, useEffect } from 'react';

function Merge(props) {
    const [names, setnames] = useState(props.names)
    

    function updateNames(event) {
        event.preventDefault();
        // console.log(event.target.name.value);
        // console.log(event.target.id)
        let nameindex;

        // console.log(props.newData.players)

        props.newData.players.forEach((player, index) => {

            if (event.target.id === player.tag)
            nameindex = index;
        })

        let data = props.newData

        data.players[nameindex].tag = event.target.name.value

        props.updateData(data);

        let newnames = names.filter(name => {
            return name != event.target.id
        })
        console.log(newnames)

        setnames(newnames)
    }

    useEffect(()=> {
        if (names.length <= 0) {
            props.merge()
        }
    })

    

    return(
        <div>
            {names.map((newName, index) => {
                return (
                    <form onSubmit={updateNames} id={newName}>
                        <div>
                            Who is {newName}?
                            <select name="name">
                                {props.oldData.players.map(oldName => {
                                    return(
                                        <option value={oldName.tag}>{oldName.tag}</option>
                                    )
                                })}
                                <option value={newName}>Add New</option>
                            </select>
                        </div>
                        <button>Submit</button>
                    </form>
                )
            })} 
        </div>
    )
}
export default Merge