import React from 'react'
import './Table.css'

function Table({countries}) {
  return <div className="table">
    {/* For every country: split it apart, get the 
        country and cases, and render row in table */}
    {countries.map(({country, cases}) => (
      <tr>
        <td>{country}</td>
        <td><strong>{cases}</strong></td>
      </tr>
    ))} 
  </div>;
}

export default Table
