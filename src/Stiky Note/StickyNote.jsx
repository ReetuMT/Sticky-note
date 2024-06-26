import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StickyNote() {
    const [notes, setNotes] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedColor, setSelectedColor] = useState();

    useEffect(() => {
        getNotes();
    }, []);

    const showToastMessage = () => {
        toast.success("Success Notification !");
    };

    function getNotes() {
        fetch("http://localhost:4000/sticky")
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => setNotes(data))
            .catch(err => alert("Unable to fetch sticky notes"));
    }

    function addNote() {
        let newNote = { title: newTitle, description: newDescription, color: selectedColor };

        fetch("http://localhost:4000/sticky", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote)
        })
            .then((res) => {
                showToastMessage();
                getNotes();
                setNewTitle("");
                setNewDescription("");
                setSelectedColor();
                console.log(res);
            })
            .catch(err =>{
                alert("Unable to add sticky note")
            })
    }

    const deleteNote = (id) => {
        fetch(`http://localhost:4000/sticky/${id}`, { method: "DELETE" })
            .then(() => getNotes())
            .catch(err => console.log(err));
    }

    const editItem = () => {
        const updatedItem = { title: newTitle, description: newDescription, color: selectedColor };

        fetch(`http://localhost:4000/sticky/${editingItem.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
        })
            .then(() => {
                getNotes();
                setEditingItem(null);
                setIsEditing(false);
                setNewTitle("");
                setNewDescription("");
                setSelectedColor();
            })
            .catch(err => console.log(err));
    }

    const handleEditClick = (item) => {
        setEditingItem(item);
        setNewTitle(item.title);
        setNewDescription(item.description);
        setSelectedColor(item.color);
        setIsEditing(true);

    };

    const handleAddClick = () => {
        setIsEditing(true);
        setEditingItem(null);
        setNewTitle('');
        setNewDescription('');
        setSelectedColor();
    }

    const handleColorChange = (event) => {
        const selectedColor = event.target.value;
        setSelectedColor(selectedColor);
    }

    return (
        <>
            <div className='main_div'>
                <h2 style={{ color: 'white' ,backgroundColor:'transparent'}}>Sticky Note</h2>
                <button onClick={handleAddClick} className='add'>Add Notes</button>
            </div>
            <div className='sticky_main' style={{ display: 'flex', justifyContent: 'space-evenly', margin: 100 }}>
                <table border="2px" cellSpacing="10px" style={{ borderColor: selectedColor }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((item) => (
                            <tr key={item.id} style={{ borderColor: item.color, borderWidth: '2px', borderStyle: 'solid' }}>
                                <td>{item.id}</td>
                                <td style={{ backgroundColor: item.color, color: "white",border:item.color }}>{item.title}</td>
                                <td style={{ backgroundColor: item.color, color: "white",border:item.color }}>{item.description}</td>
                                <td>
                                    <select onChange={handleColorChange}>
                                        <option selected>Choose Colour</option>
                                        <option value={selectedColor}>Aero</option>
                                        <option value={selectedColor}>Azure</option>
                                        <option value={selectedColor}>Beige</option>
                                        <option value={selectedColor}>Brown</option>
                                        <option value={selectedColor}>Black</option>
                                        <option value={selectedColor}>Blue</option>

                                    </select>
                                </td>
                                <td>

                                    <button type="button" className="btn btn-primary" onClick={() => handleEditClick(item)} style={{ backgroundColor: item.color, color: "white", marginRight: 5, padding: 8, border: "none", borderRadius: 10 }}>
                                        Edit
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteNote(item.id)} style={{ backgroundColor: item.color, color: "white", marginRight: 5, padding: 8, border: "none", borderRadius: 10 }}>
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ToastContainer />


                {isEditing && (
                    <div className="card" style={{ marginLeft: 10 }}>

                        <input
                            type="color"
                            value={selectedColor}
                            onChange={handleColorChange}
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <button type="button" className="buttons" onClick={() => {
                            if (editingItem) {
                                editItem();
                            } else {
                                addNote();


                            }
                        }}>
                            Save

                        </button>
                    
                        <button type="button" className="buttons" onClick={() => setIsEditing(false)}>
                            Close
                        </button>

                    </div>

                )}

            </div>
        </>
    );
}

export default StickyNote;
