import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { ComingSoon } from '../pages/ComingSoon.jsx';


import { RoleRoute } from './RoleRoute.jsx';

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={ <ProtectedRoutes> <AppLayout><Dashboard/></AppLayout></ProtectedRoutes>} />
                <Route path="/disclosures" element={<ProtectedRoutes> <RoleRoute allowed={["COMPANY_USER","REGULATOR"]}><AppLayout><ComingSoon/></AppLayout></RoleRoute></ProtectedRoutes>} />
                <Route
    path="/review-disclosures"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["AUDITOR"]}>
                <AppLayout>
                    <ComingSoon />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
    
/>

        <Route
    path="/users"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["ADMIN"]}>
                <AppLayout>
                    <ComingSoon />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
        />

        <Route
    path="/companies"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["ADMIN"]}>
                <AppLayout>
                    <ComingSoon />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
        />

        <Route
    path="/audit-logs"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["ADMIN"]}>
                <AppLayout>
                    <ComingSoon />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
        />

        <Route
    path="/audit-History"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["AUDITOR"]}>
                <AppLayout>
                    <ComingSoon />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
        />


            </Routes>


        </BrowserRouter>
    )
}

export default AppRoutes;

