import React, { useState, useEffect } from 'react';

function StickyNote() {
    const [notes, setNotes] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newColor, setNewColor] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedColor, setSelectedColor] = useState();

    useEffect(() => {
        getNotes();
    }, []);

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
            .then(() => {
                getNotes();
                setNewTitle("");
                setNewDescription("");
                setSelectedColor();
            })
            .catch(err => alert("Unable to add sticky note"));
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
                <h2 style={{ color: 'white' }}>Sticky Note</h2>
                <button onClick={handleAddClick} className='btn btn-primary'>Add Notes</button>
            </div>
            <div className='sticky_main' style={{ display: 'flex', justifyContent: 'space-between', margin: 10 }}>
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
                                <td style={{ backgroundColor: item.color, color: "white" }}>{item.title}</td>
                                <td style={{ backgroundColor: item.color, color: "white" }}>{item.description}</td>
                                <td>
                                <select className="form-select" aria-label="Default select example" onChange={handleColorChange}>
                                <option selected>Choose Colour</option>
                                <option defaultValue={selectedColor}>Aero</option>
                                <option defaultValue={selectedColor}>Azure</option>
                                <option defaultValue={selectedColor}>Beige</option>
                                <option defaultValue={selectedColor}>Brown</option>
                                <option defaultValue={selectedColor}>Black</option>
                                <option defaultValue={selectedColor}>Blue</option>
                                
                            </select>
                                </td>
                                <td>
                                    <p className="d-inline-flex gap-1">
                                        <button type="button" className="btn btn-primary" onClick={() => handleEditClick(item)} style={{ backgroundColor: item.color, color: "white" }}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteNote(item.id)} style={{ backgroundColor: item.color, color: "white" }}>
                                            Delete
                                        </button>
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isEditing && (
                    <div className="card" style={{ marginLeft: 10 }}>
                        <div className="card-body">
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
                            <button type="button" className="btn btn-success" onClick={() => {
                                if (editingItem) {
                                    editItem();
                                } else {
                                    addNote();
                                }
                            }}>
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default StickyNote;
