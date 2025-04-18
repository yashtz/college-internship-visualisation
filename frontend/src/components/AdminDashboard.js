import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard({ internships, onInternshipUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // Add this state
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    location: '',
    duration: '',
    stipend: '',
    internship_title: ''
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const handleEdit = (internship) => {
    setEditingId(internship.id.timestamp);  // Changed from _id to id.timestamp
    setEditForm(internship);
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/internships/${id}`, 
        editForm,
        getAuthHeader()
      );
      if (response.data) {
        setEditingId(null);
        onInternshipUpdate();
      }
    } catch (error) {
      console.error('Error updating internship:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        window.location.reload();
      } else {
        alert('Failed to update internship: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const internshipData = {
        title: newInternship.title.trim(),
        company: newInternship.company.trim(),
        location: newInternship.location.trim(),
        startDate: 'Immediately',  // Changed from start_date to match backend
        duration: newInternship.duration.trim(),
        stipend: newInternship.stipend.trim()
      };

      const response = await axios({
        method: 'post',
        url: 'http://localhost:8080/api/internships',
        data: internshipData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {  // Accept both status codes
        setNewInternship({
          title: '',
          company: '',
          location: '',
          duration: '',
          stipend: '',
          internship_title: ''
        });
        setShowAddForm(false);
        onInternshipUpdate();
        alert('Internship added successfully!');
      }
    } catch (error) {
      console.error('Add error:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to add internship';
      alert(errorMessage);
    }
  };

  const handleDelete = async (internship) => {
      if (window.confirm('Are you sure you want to delete this internship?')) {
        try {
          console.log('Full internship object:', internship);
          
          // Use the stringId from the internship object
          const mongoId = internship.stringId;
          console.log('Using MongoDB ID:', mongoId);
          
          const response = await axios({
            method: 'delete',
            url: `http://localhost:8080/api/internships/${mongoId}`,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.status === 200) {
            onInternshipUpdate();
            alert('Internship deleted successfully!');
          }
        } catch (error) {
          console.error('Delete error:', error);
          const errorMessage = error.response?.data?.message || 'Failed to delete internship';
          alert(errorMessage);
        }
      }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewInternship({
      title: '',
      company: '',
      location: '',
      duration: '',
      stipend: '',
      internship_title: ''
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Manage Internships</h2>
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            Add New Internship
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-overlay">
          <div className="add-form-container">
            <h3>Add New Internship</h3>
            <form onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Title"
                value={newInternship.title}
                onChange={(e) => setNewInternship({...newInternship, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={newInternship.company}
                onChange={(e) => setNewInternship({...newInternship, company: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newInternship.location}
                onChange={(e) => setNewInternship({...newInternship, location: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g., 3 months)"
                value={newInternship.duration}
                onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Stipend (e.g., 5000)"
                value={newInternship.stipend}
                onChange={(e) => setNewInternship({...newInternship, stipend: e.target.value})}
                required
              />
              <div className="form-buttons">
                <button type="submit">Add Internship</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="internship-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Stipend</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {internships.filter(internship => 
            internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.company?.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((internship) => (
            <tr key={internship.id.timestamp}>
              <td>
                {editingId === internship.id.timestamp ? (
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  />
                ) : (
                  internship.title
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <input
                    type="text"
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                  />
                ) : (
                  internship.company
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                ) : (
                  internship.location
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <input
                    type="text"
                    value={editForm.start_date || ''}
                    onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                  />
                ) : (
                  internship.start_date || 'Immediately'
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <input
                    type="text"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                  />
                ) : (
                  internship.duration || '6 Months'
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <input
                    type="text"
                    value={editForm.stipend || ''}
                    onChange={(e) => setEditForm({...editForm, stipend: e.target.value})}
                  />
                ) : (
                  internship.stipend || '₹0/month'
                )}
              </td>
              <td>
                {editingId === internship._id ? (
                  <button onClick={() => handleSave(internship._id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(internship)}>Edit</button>
                    <button onClick={() => handleDelete(internship)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;