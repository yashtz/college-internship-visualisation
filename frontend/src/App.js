import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, RadialLinearScale, PointElement } from 'chart.js';
import { Pie, Bar, PolarArea } from 'react-chartjs-2';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, RadialLinearScale, PointElement);

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [locationFilter, setLocationFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');

  const fetchInternships = async () => {
    try {
      console.log('Attempting to fetch internships...');
      const response = await axios.get('http://localhost:8080/api/internships', {
        timeout: 5000,
        withCredentials: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log('Response received:', response.data);
      setInternships(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Please check if the backend server is running');
      } else {
        setError('Failed to fetch internship data: ' + (err.response?.data?.message || err.message));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };
  
  // Get unique locations and durations for filters
  const locations = ['All', ...new Set(internships.map(item => item.location))];
  const durations = ['All', ...new Set(internships.map(item => item.duration))];
  
  // Filter the internships based on selected filters
  const filteredInternships = internships.filter(internship => {
    return (locationFilter === 'All' || internship.location === locationFilter) &&
           (durationFilter === 'All' || internship.duration === durationFilter);
  });
  
  // Prepare data for location distribution chart
  const locationData = {
    labels: [...new Set(filteredInternships.map(item => item.location))],
    datasets: [
      {
        label: 'Internships by Location',
        data: [...new Set(filteredInternships.map(item => item.location))].map(
          location => filteredInternships.filter(item => item.location === location).length
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for stipend distribution chart
  const stipendCategories = {
    'Unpaid': 0,
    '₹1-5,000': 0,
    '₹5,001-10,000': 0,
    '₹10,001-20,000': 0,
    '₹20,001+': 0
  };
  
  filteredInternships.forEach(internship => {
    const stipend = internship.stipend;
    if (stipend === 'Unpaid') {
      stipendCategories['Unpaid']++;
    } else {
      const match = stipend.match(/₹\s*([\d,]+)(?:\s*-\s*([\d,]+))?\s*\/month/);
      if (match) {
        const minValue = parseInt(match[1].replace(/,/g, ''));
        if (minValue <= 5000) {
          stipendCategories['₹1-5,000']++;
        } else if (minValue <= 10000) {
          stipendCategories['₹5,001-10,000']++;
        } else if (minValue <= 20000) {
          stipendCategories['₹10,001-20,000']++;
        } else {
          stipendCategories['₹20,001+']++;
        }
      }
    }
  });
  
  const stipendData = {
    labels: Object.keys(stipendCategories),
    datasets: [
      {
        label: 'Stipend Distribution',
        data: Object.values(stipendCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for duration distribution chart
  const durationData = {
    labels: [...new Set(filteredInternships.map(item => item.duration))],
    datasets: [
      {
        label: 'Internships by Duration',
        data: [...new Set(filteredInternships.map(item => item.duration))].map(
          duration => filteredInternships.filter(item => item.duration === duration).length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare data for profile distribution chart
  const profileCategories = {};
  
  filteredInternships.forEach(internship => {
    const profile = internship.internship_title;
    if (profile) {
      let category = profile;
      if (profile.includes('Marketing') || profile.includes('Social Media')) {
        category = 'Marketing';
      } else if (profile.includes('Development') || profile.includes('Programming') || profile.includes('Software')) {
        category = 'Software Development';
      } else if (profile.includes('Design') || profile.includes('UI') || profile.includes('UX')) {
        category = 'Design';
      } else if (profile.includes('Content') || profile.includes('Writing')) {
        category = 'Content Writing';
      } else if (profile.includes('HR') || profile.includes('Human Resources')) {
        category = 'Human Resources';
      } else if (profile.includes('Business') || profile.includes('Sales')) {
        category = 'Business & Sales';
      } else if (profile.includes('Data')) {
        category = 'Data Analytics';
      }
      
      profileCategories[category] = (profileCategories[category] || 0) + 1;
    }
  });
  
  const sortedProfiles = Object.entries(profileCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  
  const profileData = {
    labels: sortedProfiles.map(item => item[0]),
    datasets: [
      {
        label: 'Profile Distribution',
        data: sortedProfiles.map(item => item[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Internships by Duration',
      },
    },
  };

  if (loading) return <div className="loading">Loading internship data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <nav>
        <button onClick={() => setShowLoginForm(true)}>Admin Login</button>
        {isAdmin && <button onClick={handleLogout}>Logout</button>}
      </nav>

      {showLoginForm && !isAdmin && (
        <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={() => setShowLoginForm(false)} />
      )}

      {isAdmin ? (
        <AdminDashboard internships={internships} onInternshipUpdate={fetchInternships} />
      ) : (
        <>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="location-filter">Location:</label>
              <select 
                id="location-filter" 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="duration-filter">Duration:</label>
              <select 
                id="duration-filter" 
                value={durationFilter} 
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="dashboard-summary">
            <div className="summary-card">
              <h3>Total Internships</h3>
              <p className="summary-value">{filteredInternships.length}</p>
            </div>
            <div className="summary-card">
              <h3>Work From Home</h3>
              <p className="summary-value">
                {filteredInternships.filter(item => item.location === 'Work From Home').length}
              </p>
            </div>
            <div className="summary-card">
              <h3>Paid Internships</h3>
              <p className="summary-value">
                {filteredInternships.filter(item => item.stipend !== 'Unpaid').length}
              </p>
            </div>
          </div>
          
          <div className="charts-container">
            <div className="chart-card">
              <h3>Location Distribution</h3>
              <div className="chart-wrapper">
                <Pie data={locationData} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Stipend Distribution</h3>
              <div className="chart-wrapper">
                <Pie data={stipendData} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Profile Distribution</h3>
              <div className="chart-wrapper">
                <PolarArea data={profileData} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Duration Distribution</h3>
              <div className="chart-wrapper">
                <Bar data={durationData} options={barOptions} />
              </div>
            </div>
          </div>
          
          <div className="internship-table-container">
            <h3>Internship Listings</h3>
            <table className="internship-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Stipend</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.slice(0, 10).map((internship, index) => (
                  <tr key={internship._id}>
                    <td>{internship.title}</td>
                    <td>{internship.company}</td>
                    <td>{internship.location}</td>
                    <td>{internship.duration}</td>
                    <td>{internship.stipend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInternships.length > 10 && (
              <p className="table-note">Showing 10 of {filteredInternships.length} internships</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
