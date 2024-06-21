import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const [isVisible, setIsVisible] = useState(true);

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div>
            <button className="toggle-btn" onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
                <ul>
                    <li>
                        <Link to='/dashboard'>Dashboard</Link>
                    </li>
                    <li>
                        <Link to='/income'>Income</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
