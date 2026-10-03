import { React } from 'react';
import { Navigate, replace } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';


export function ProtectedRoutes(props){

        if(!isAuthenticated())
        return <Navigate to="/login" replace/>
    

    return props.children;
}