import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState([]);
  const [formData, setFormData] = useState({ furnitureName: '', furnitureOwnerName: '' });
  const [editingId, setEditingId] = useState(null);

  const [importData, setImportData] = useState({ furnitureId: '', importDate: '', quantity: '' });
  const [exportData, setExportData] = useState({ furnitureId: '', exportDate: '', quantity: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    fetchFurniture();
  }, []);

  const fetchFurniture = async () => {
    const res = await API.get('/furniture');
    setFurniture(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/furniture/${editingId}`, formData);
    } else {
      await API.post('/furniture', formData);
    }
    setFormData({ furnitureName: '', furnitureOwnerName: '' });
    setEditingId(null);
    fetchFurniture();
  };

  const handleEdit = (item) => {
    setFormData({ furnitureName: item.furnitureName, furnitureOwnerName: item.furnitureOwnerName });
    setEditingId(item.furnitureId);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await API.delete(`/furniture/${id}`);
      fetchFurniture();
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await API.post('/import', importData);
      alert('Import recorded');
    } catch (err) {
      alert('Failed to import');
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();
    try {
      await API.post('/export', exportData);
      alert('Export recorded');
    } catch (err) {
      alert('Failed to export');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Furniture Dashboard</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input className="form-control mb-2" placeholder="Furniture Name" value={formData.furnitureName}
          onChange={(e) => setFormData({ ...formData, furnitureName: e.target.value })} />
        <input className="form-control mb-2" placeholder="Owner Name" value={formData.furnitureOwnerName}
          onChange={(e) => setFormData({ ...formData, furnitureOwnerName: e.target.value })} />
        <button className="btn btn-primary">{editingId ? 'Update' : 'Add'} Furniture</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Furniture</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {furniture.map((item) => (
            <tr key={item.furnitureId}>
              <td>{item.furnitureId}</td>
              <td>{item.furnitureName}</td>
              <td>{item.furnitureOwnerName}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.furnitureId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h4>Import Furniture</h4>
      <form onSubmit={handleImport} className="mb-4">
        <select className="form-control mb-2" value={importData.furnitureId}
          onChange={(e) => setImportData({ ...importData, furnitureId: e.target.value })}>
          <option value="">Select Furniture</option>
          {furniture.map((item) => (
            <option key={item.furnitureId} value={item.furnitureId}>{item.furnitureName}</option>
          ))}
        </select>
        <input className="form-control mb-2" type="date" value={importData.importDate}
          onChange={(e) => setImportData({ ...importData, importDate: e.target.value })} />
        <input className="form-control mb-2" type="number" placeholder="Quantity" value={importData.quantity}
          onChange={(e) => setImportData({ ...importData, quantity: e.target.value })} />
        <button className="btn btn-success">Import</button>
      </form>

      <h4>Export Furniture</h4>
      <form onSubmit={handleExport}>
        <select className="form-control mb-2" value={exportData.furnitureId}
          onChange={(e) => setExportData({ ...exportData, furnitureId: e.target.value })}>
          <option value="">Select Furniture</option>
          {furniture.map((item) => (
            <option key={item.furnitureId} value={item.furnitureId}>{item.furnitureName}</option>
          ))}
        </select>
        <input className="form-control mb-2" type="date" value={exportData.exportDate}
          onChange={(e) => setExportData({ ...exportData, exportDate: e.target.value })} />
        <input className="form-control mb-2" type="number" placeholder="Quantity" value={exportData.quantity}
          onChange={(e) => setExportData({ ...exportData, quantity: e.target.value })} />
        <button className="btn btn-danger">Export</button><br />
        <button className="btn btn-dark mt-3" onClick={() => navigate('/report')}>
  View Stock Report
</button>

      </form>
    </div>
  );
}

export default Dashboard;
