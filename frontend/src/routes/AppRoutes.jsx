import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { Disclosures } from '../pages/Disclosures.jsx';
import { ComingSoon } from '../pages/comingSoon.jsx';
import { Disclosure } from '../pages/Disclosure.jsx';
import { DisclosureReview } from "../pages/DisclosureReview.jsx";
import { RoleRoute } from './RoleRoute.jsx';
import { ReviewDisclosures } from "../pages/ReviewDisclosures.jsx";
import { AuditHistory } from "../pages/AuditHistory.jsx";
import { AuditHistoryDetail } from "../pages/AuditHistoryDetail.jsx";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={ <ProtectedRoutes> <AppLayout><Dashboard/></AppLayout></ProtectedRoutes>} />
                <Route path="/disclosures" element={<ProtectedRoutes> <RoleRoute allowed={["COMPANY_USER"]}><AppLayout><Disclosures/></AppLayout></RoleRoute></ProtectedRoutes>} />
                <Route
    path="/disclosures/:disclosureId"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["COMPANY_USER"]}>
                <AppLayout>
                    <Disclosure/>
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }  
/>
                <Route
    path="/review-disclosures/:disclosureId"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["AUDITOR"]}>
                <AppLayout>
                    <DisclosureReview />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
    
/>
        <Route
    path="/review-disclosures"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["AUDITOR"]}>
                <AppLayout>
                    <ReviewDisclosures />
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
                    <AuditHistory />
                </AppLayout>
            </RoleRoute>
        </ProtectedRoutes>
    }
        />

        <Route
    path="/audit-history/:disclosureId"
    element={
        <ProtectedRoutes>
            <RoleRoute allowed={["AUDITOR"]}>
                <AuditHistoryDetail />
            </RoleRoute>
        </ProtectedRoutes>
    }
/>


            </Routes>


        </BrowserRouter>
    )
}

export default AppRoutes;

