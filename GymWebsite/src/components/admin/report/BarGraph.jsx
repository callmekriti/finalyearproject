import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import GlobalContext from "../../context/GlobalContext";

const BarGraph = (props) => {
  const { total_expenses
    , 
    total_income } = props.data;

  const data = [
    {
      name: 'Comparison',
      Expense: total_expenses,
      Income: 
      total_income,
    },
  ];

  return (
    
   
    
        <BarChart width={300} height={329} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Expense" fill="#8884d8" />
          <Bar dataKey="Income" fill="#82ca9d" />
        </BarChart>
     
   
  );
};

export default BarGraph;
