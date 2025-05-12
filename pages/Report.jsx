// src/pages/Report.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function Report() {
  const [report, setReport] = useState([]);

  useEffect(() => {
    API.get('/report').then((res) => setReport(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Stock Report</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Furniture</th>
            <th>Owner</th>
            <th>Imported</th>
            <th>Exported</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {report.map((item) => (
            <tr key={item.furnitureId}>
              <td>{item.furnitureId}</td>
              <td>{item.furnitureName}</td>
              <td>{item.furnitureOwnerName}</td>
              <td>{item.TotalImported}</td>
              <td>{item.TotalExported}</td>
              <td>{item.stockAvailable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Report;
