import React from 'react';
import { Link } from 'react-router-dom';
function AdminPage() {
    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, Admin! Manage the site here.</p>
            <Link to={'/studentadmin'}><a>student</a></Link>
                    <Link to={'/itemadmin'}><a>item</a></Link>
                    <Link to={'/doctoradmin'}><a>doctor</a></Link>
                    <Link to={'/adreport'}><a>AdminReport</a></Link>
        </div>
    );
}

export default AdminPage;
