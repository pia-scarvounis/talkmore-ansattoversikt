import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//Dette er for å beskytte rutere i frontend

export default function ProtectedRoute({ children, allowedRoles }){
    
    //henter token og user (bruker som er logget inn) fra loginSlicen med navn auth
    const { token, user } = useSelector(state => state.auth);

    if(!token || !user){
        return <Navigate to="/"/>
    }
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized"></Navigate>
    }
    return children;


}