import React from 'react';

function Notes({note,  toggleImportance}){

    const label = note.important ? 'Make not important' : 'Make it important'

    return(
        <div>
        <li>{note.content}</li>
        <button onClick={toggleImportance}>{label}</button>
        </div>
    )
}

export default Notes