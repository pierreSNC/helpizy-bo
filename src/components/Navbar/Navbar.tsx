import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
    const { language, switchLanguage } = useLanguage(); // Utiliser le contexte pour la langue

    const handleLanguageSwitch = (newLanguage: number) => {
        switchLanguage(newLanguage); // Changer la langue
    };

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
                <li>
                    <button onClick={() => handleLanguageSwitch(1)}>Français</button>
                    <button onClick={() => handleLanguageSwitch(2)}>Anglais</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
