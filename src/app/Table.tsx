'use client';
import React, { useState, useEffect } from 'react';
import { Bank } from './bank';

interface TableProps {
initialData: Bank[];
}

const Table: React.FC<TableProps> = ({ initialData }) => {
    const [data, setData] = useState<Bank[]>(initialData);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showReload, setShowReload] = useState<boolean>(false);
    const [timestamp, setTimestamp] = useState<string>('');

// Store data in localStorage and set the initial timestamp
useEffect(() => {
    const originalData = localStorage.getItem('originalBanksData');
    if (!originalData) {
    console.log('Saving initial data to localStorage');
    localStorage.setItem('originalBanksData', JSON.stringify(initialData));
    }
    const storedData = localStorage.getItem('banksData');
    if (storedData) {
    console.log('Loading data from localStorage:', JSON.parse(storedData));
    setData(JSON.parse(storedData) as Bank[]);
    } else {
    setData(initialData);
    }

    const currentDate = new Date();
    setTimestamp(`${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`);
}, [initialData]);

const filteredData = data.filter((item) =>
    item.bankName.toLowerCase().includes(searchQuery.toLowerCase())
);

const sortData = () => {
    const sorted = [...data].sort((a, b) => a.bankName.localeCompare(b.bankName));
    setData(sorted);
};

const deleteItem = (id: string) => {
    const updatedData = data.filter((item) => item.url !== id); // Using `url` as unique identifier
    setData(updatedData);
    setShowReload(true);
    localStorage.setItem('banksData', JSON.stringify(updatedData));
};

const reloadData = () => {
    const originalData = localStorage.getItem('originalBanksData');
    if (originalData) {
    const parsedOriginalData = JSON.parse(originalData) as Bank[];
    setData(parsedOriginalData);
    setShowReload(false);
    localStorage.setItem('banksData', originalData);
    }
};

return (
    <div>
    <input
        type="text"
        id='search'
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button onClick={sortData}>Sort by Bank Name</button>

    {showReload && <button onClick={reloadData}>Reload Data</button>}

    <table>
        <thead>
        <tr>
            <th>Bank Name</th>
            <th>URL</th>
            <th>Age</th>
            <th>Description</th>
            <th>Timestamp</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {filteredData.length > 0 ? (
            filteredData.map((item) => (
            <tr key={item.url}>
                <td>{item.bankName}</td>
                <td>{item.url}</td>
                <td>{item.age}</td>
                <td>{item.description}</td>
                <td>{timestamp}</td>
                <td>
                <button onClick={() => deleteItem(item.url)}>Delete</button>
                </td>
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan={6}>No results found</td>
            </tr>
        )}
        </tbody>
    </table>
    </div>
);
};

export default Table;
