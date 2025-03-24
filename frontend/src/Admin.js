import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Admin.css';

function Admin() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New internship form state
  const [newInternship, setNewInternship] = useState({
    internship_title: '',
    company_name: '',
    location: '',
    start_date: '',
    duration: '',
    stipend: ''
  });
  
  // Edited internship state
  const [editedInternship, setEditedInternship] = useState({
    internship_title: '',
    company_name: '',
    location: '',
    start_date: '',
    duration: '',
    stipend: ''
  });

  useEffect(() => {
    // Load and parse the CSV file
    fetch('/internship.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch internship data');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Add an id field to each internship for easier management
            const internshipsWithIds = results.data
              .filter(item => Object.keys(item).length > 1) // Filter out empty rows
              .map((item, index) => ({ ...item, id: index }));
            
            setInternships(internshipsWithIds);
            setLoading(false);
          },
          error: (error) => {
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError('Error fetching data: ' + err.message);
        setLoading(false);
      });
  }, []);

  // Handle input change for new internship form
  const handleNewInternshipChange = (e) => {
    const { name, value } = e.target;
    setNewInternship(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for editing form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedInternship(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Start editing an internship
  const startEditing = (internship) => {
    setEditingId(internship.id);
    setEditedInternship({
      internship_title: internship.internship_title,
      company_name: internship.company_name,
      location: internship.location,
      start_date: internship.start_date,
      duration: internship.duration,
      stipend: internship.stipend
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Save edited internship
  const saveInternship = () => {
    // Update the internship in the state
    const updatedInternships = internships.map(internship => 
      internship.id === editingId ? { ...internship, ...editedInternship } : internship
    );
    
    setInternships(updatedInternships);
    setEditingId(null);
    
    // In a real application, you would save this to the server/database
    alert('Internship updated! In a real application, this would be saved to the database.');
  };

  // Add new internship
  const addInternship = (e) => {
    e.preventDefault();
    
    // Create a new internship with a unique ID
    const newId = internships.length > 0 ? Math.max(...internships.map(i => i.id)) + 1 : 0;
    const internshipToAdd = {
      ...newInternship,
      id: newId
    };
    
    // Add to the internships array
    setInternships([...internships, internshipToAdd]);
    
    // Reset the form
    setNewInternship({
      internship_title: '',
      company_name: '',
      location: '',
      start_date: '',
      duration: '',
      stipend: ''
    });
    
    setShowAddForm(false);
    
    // In a real application, you would save this to the server/database
    alert('New internship added! In a real application, this would be saved to the database.');
  };

  // Delete an internship
  const deleteInternship = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      const updatedInternships = internships.filter(internship => internship.id !== id);
      setInternships(updatedInternships);
      
      // In a real application, you would delete this from the server/database
      alert('Internship deleted! In a real application, this would be removed from the database.');
    }
  };

  if (loading) return <div className="loading">Loading internship data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Internship Admin Dashboard</h1>
        <div className="admin-actions">
          <button 
            className="add-button" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Internship'}
          </button>
        </div>
      </header>
      
      {showAddForm && (
        <div className="add-internship-form">
          <h2>Add New Internship</h2>
          <form onSubmit={addInternship}>
            <div className="form-group">
              <label>Title:</label>
              <input 
                type="text" 
                name="internship_title" 
                value={newInternship.internship_title} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Company:</label>
              <input 
                type="text" 
                name="company_name" 
                value={newInternship.company_name} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Location:</label>
              <input 
                type="text" 
                name="location" 
                value={newInternship.location} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Start Date:</label>
              <input 
                type="text" 
                name="start_date" 
                value={newInternship.start_date} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Duration:</label>
              <input 
                type="text" 
                name="duration" 
                value={newInternship.duration} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Stipend:</label>
              <input 
                type="text" 
                name="stipend" 
                value={newInternship.stipend} 
                onChange={handleNewInternshipChange} 
                required 
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">Add Internship</button>
              <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="internship-table-container">
        <h2>Manage Internships</h2>
        <p>Total Internships: {internships.length}</p>
        <table className="internship-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>Duration</th>
              <th>Stipend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship) => (
              <tr key={internship.id}>
                {editingId === internship.id ? (
                  // Editing mode
                  <>
                    <td>
                      <input 
                        type="text" 
                        name="internship_title" 
                        value={editedInternship.internship_title} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="company_name" 
                        value={editedInternship.company_name} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="location" 
                        value={editedInternship.location} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="start_date" 
                        value={editedInternship.start_date} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="duration" 
                        value={editedInternship.duration} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="stipend" 
                        value={editedInternship.stipend} 
                        onChange={handleEditChange} 
                      />
                    </td>
                    <td className="action-buttons">
                      <button onClick={saveInternship} className="save-button">Save</button>
                      <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td>{internship.internship_title}</td>
                    <td>{internship.company_name}</td>
                    <td>{internship.location}</td>
                    <td>{internship.start_date}</td>
                    <td>{internship.duration}</td>
                    <td>{internship.stipend}</td>
                    <td className="action-buttons">
                      <button onClick={() => startEditing(internship)} className="edit-button">Edit</button>
                      <button onClick={() => deleteInternship(internship.id)} className="delete-button">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;