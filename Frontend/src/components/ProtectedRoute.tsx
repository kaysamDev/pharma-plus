import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../util/tokenService'

const ProtectedRoute: React.FC = () => {
    const token = getToken();

    if(!token) {
        return <Navigate to="/login" replace />;
    }

  return <Outlet/>
}

export default ProtectedRoute
