import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filters, setFilters] = useState({ event: '', from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('https://techmantraadmin.onrender.com/api/registrations', { params: filters });
      const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setData(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert('Failed to apply filters');
    }
  };

  const downloadExcel = () => {
    if (!data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, 'TechMantra_Registrations.xlsx');
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://techmantraadmin.onrender.com/api/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setData(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id, reg) => {
    setEditRow(id);
    setEditedData({ ...reg });
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.put(`https://techmantraadmin.onrender.com/api/registrations/${id}`, editedData);
      const updated = data.map((item) => item._id === id ? { ...res.data } : item);
      setData(updated);
      setEditRow(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update data');
    }
  };

  const handleFieldChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://techmantraadmin.onrender.com/api/registrations/${id}/status`, { paymentStatus: newStatus });
      const updated = data.map(item =>
        item._id === id ? { ...item, paymentStatus: newStatus } : item
      );
      setData(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to update payment status');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="mb-4 text-center text-md-start">Recent Event Registrations</h3>

        {/* Filter Section */}
        <form className="row g-3 mb-4" onSubmit={handleFilter}>
          <div className="col-12 col-md-4">
            <input
              type="text"
              name="event"
              placeholder="Filter by Event"
              className="form-control"
              value={filters.event}
              onChange={handleChange}
            />
          </div>
          <div className="col-6 col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              Apply Filter
            </button>
          </div>
          <div className="col-6 col-md-2">
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={downloadExcel}
              disabled={!data.length}
            >
              Download Excel
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="table-responsive shadow p-3 bg-white rounded" style={{ fontSize: '14px' }}>
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>College Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Event</th>
                <th>Contact No.</th>
                <th>Type</th>
                <th>Participants</th>
                <th>Payment Status</th>
                <th>Payment ID</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((reg) => (
                  <tr key={reg._id}>
                    <td>{editRow === reg._id ? <input value={editedData.name} onChange={(e) => handleFieldChange(e, 'name')} className="form-control" /> : reg.name}</td>
                    <td>{editRow === reg._id ? <input value={editedData.clgname} onChange={(e) => handleFieldChange(e, 'clgname')} className="form-control" /> : reg.clgname}</td>
                    <td>{editRow === reg._id ? <input value={editedData.email} onChange={(e) => handleFieldChange(e, 'email')} className="form-control" /> : reg.email}</td>
                    <td>{editRow === reg._id ? <input value={editedData.cnumber} onChange={(e) => handleFieldChange(e, 'cnumber')} className="form-control" /> : reg.cnumber}</td>
                    <td>{editRow === reg._id ? <input value={editedData.class} onChange={(e) => handleFieldChange(e, 'class')} className="form-control" /> : reg.class}</td>
                    <td>{editRow === reg._id ? <input value={editedData.event} onChange={(e) => handleFieldChange(e, 'event')} className="form-control" /> : reg.event}</td>
                    <td>{reg.cnumber}</td>
                    <td>{editRow === reg._id ? <input value={editedData.type} onChange={(e) => handleFieldChange(e, 'type')} className="form-control" /> : reg.type}</td>
                    <td>{editRow === reg._id ? (
                      <input value={editedData.participants?.join(', ')} onChange={(e) => handleFieldChange(e, 'participants')} className="form-control" />
                    ) : reg.participants?.join(', ')}</td>
                    <td>
                      <select
                        className={`form-select ${reg.paymentStatus === 'Done' ? 'text-success' : 'text-warning'}`}
                        value={reg.paymentStatus}
                        onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td>{reg.pay_id}</td>
                    <td>{new Date(reg.createdAt).toLocaleString()}</td>
                    <td>
                      {editRow === reg._id ? (
                        <button className="btn btn-sm btn-success" onClick={() => handleSave(reg._id)}>Save</button>
                      ) : (
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(reg._id, reg)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="13" className="text-center">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination flex-wrap justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default Dashboard;
