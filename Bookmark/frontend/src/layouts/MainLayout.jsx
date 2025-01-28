import React from 'react';
import { Outlet } from 'react-router-dom';



const MainLayout = ({ role }) => {
  return (
    
      
        <Outlet /> 
      
    
  );
};

export default MainLayout;