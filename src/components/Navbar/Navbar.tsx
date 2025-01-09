import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/posts">Posts</Link>
                </li>
                <li>
                    <Link to="/categories">Categories</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
                <li>
                    <Link to="/authors">Authors</Link>
                </li>
                <li>
                    <Link to="/faq">F.A.Q</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
