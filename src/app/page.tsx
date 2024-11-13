'use client';

import React, { useEffect, useState } from 'react';
import Table from './Table';
import { Bank } from './bank';

export default function Home() {
  const [data, setData] = useState<Bank[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://dev.obtenmas.com/catom/api/challenge/banks');
      const fetchedData: Bank[] = await res.json();
      console.log('hi1', localStorage.getItem('banksData'))

      // Check if the data is already in localStorage
      if (typeof window !== 'undefined' && !localStorage.getItem('banksData')) {
        localStorage.setItem('banksData', JSON.stringify(data));
      }
      
      console.log(localStorage)
      // Set data as initial data in state
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return data.length > 0 ? <Table initialData={data} /> : <div>Loading...</div>;
}
