import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(savedContacts);
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  const createContact = () => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert("Name and Phone Number cannot be empty!");
      return;
    }
    
    if (contacts.some(contact => contact.name === name && contact.phoneNumber === phoneNumber)) {
      alert("Contact already exists!");
      return;
    }

    const newContact = { id: Date.now(), name, phoneNumber };
    setContacts([newContact, ...contacts]);
    setName("");
    setPhoneNumber("");
  };

  const updateContact = (id) => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert("Name and Phone Number cannot be empty!");
      return;
    }

    setContacts(contacts.map(contact => contact.id === id ? { ...contact, name, phoneNumber } : contact));
    setEditingId(null);
    setName("");
    setPhoneNumber("");
  };

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);

    if (updatedContacts.length === 0) {
      localStorage.removeItem("contacts");
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="container">
      <h1>Contact Management</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="create-button" onClick={editingId ? () => updateContact(editingId) : createContact}>
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Phone Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="post-list">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.phoneNumber}</td>
                <td>
                  <button className="icon-button edit" onClick={() => {
                    setEditingId(contact.id);
                    setName(contact.name);
                    setPhoneNumber(contact.phoneNumber);
                  }}>
                    ✏️
                  </button>
                </td>
                <td>
                  <button className="icon-button delete" onClick={() => deleteContact(contact.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;