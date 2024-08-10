// src/components/DashboardLayout.jsx

import Sidebar from './Sidebar';
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
