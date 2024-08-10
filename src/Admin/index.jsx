import DashboardLayout from "./component/DashboardLayout"
import { Routes, Route } from 'react-router-dom';
import EventManager from './component/EventManager'
import UserManager from "./component/UserManager";
import Analytics from "./component/Analytics";
import Settings from "./component/Settings";


const Admin = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<EventManager/>}/>
                <Route path="/users" element={<UserManager/>}/>
                <Route path="/analytics" element={<Analytics/>}/>
                <Route path="/settings" element={<Settings/>}/>
            </Routes>
        </DashboardLayout>
    )
}

export default Admin