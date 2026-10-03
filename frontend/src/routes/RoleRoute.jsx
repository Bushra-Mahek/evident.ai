import { Navigate, replace} from 'react-router-dom';
import { getUser } from "../utils/auth.js";
import { Dashboard } from '../pages/Dashboard.jsx';

export function RoleRoute(props){
    const user = getUser();

    const arr = props.allowed;
    if(arr.includes(user.role)){
        return props.children;
    }

    else{
        return <Navigate to="/dashboard" replace/>
    }

}
