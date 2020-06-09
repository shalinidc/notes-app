import React, {useState, useEffect} from 'react';
import './App.css';
import Notes from './components/notes';
import noteService from './services/notes';
import Notification from "./components/notification";
import Footer from "./components/footer";

function App() {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('add a new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(()=>{
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
            });
    }, []);

    console.log(notes);

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
        }

        noteService
            .create(noteObject)
            .then(newNote =>{
                setNotes(notes.concat(newNote));
                setNewNote('');
            });
    }

    const toggleImportance = function (id)  {
        const url = `http://localhost:3001/notes/${id}`
        const note = notes.find(note => note.id === id);
        const changeNote = {...note, important: !note.important};

        noteService.update(id, changeNote)
            .then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note: returnedNote));
            })
            .catch(error => {
                setErrorMessage(`the note ${note.content} was already deleted from the server`);
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(n => n.id !== id));
            })
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value);
    }

    const notesToShow = showAll ? notes : (notes.filter(note => note.important === true));

        return (
            <div>
                <h1>Notes</h1>
                <Notification message = {errorMessage} />
                <div>
                    <button onClick={()=>setShowAll(!showAll)}>
                        Show {showAll ? 'important': 'all'}
                    </button>
                </div>
                <ul>
                    {notesToShow.map((note, i) =>
                        <Notes
                            key={i}
                            note={note}
                            toggleImportance={() => toggleImportance(note.id)}/>
                    )}
                </ul>
                <form onSubmit={addNote}>
                    <input value={newNote}
                           onChange={handleNoteChange} />
                    <button type="submit"> Submit </button>
                </form>
                <Footer />
            </div>
        );
}

export default App;
