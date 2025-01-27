import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
    const { switchLanguage } = useLanguage();

    // Récupérer la langue sélectionnée depuis localStorage au démarrage
    const [selectedLanguage, setSelectedLanguage] = useState<number>(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage ? Number(savedLanguage) : 1; // Langue par défaut : Français (id=1)
    });

    // Fonction pour gérer le changement de langue
    const handleLanguageSwitch = (newLanguage: number) => {
        setSelectedLanguage(newLanguage);
        // Enregistrer la langue sélectionnée dans localStorage
        localStorage.setItem('language', newLanguage.toString());
        // Mettre à jour la langue dans le contexte global
        switchLanguage(newLanguage);
    };

    useEffect(() => {
        // Lors du premier rendu, on s'assure que la langue est bien définie dans le contexte
        switchLanguage(selectedLanguage);
    }, [selectedLanguage, switchLanguage]);

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/posts">Articles</Link>
                </li>
                <li>
                    <Link to="/categories">Catégories</Link>
                </li>
                <li>
                    <Link to="/users">Utilisateurs</Link>
                </li>
                <li>
                    <Link to="/authors">Auteurs</Link>
                </li>
                <li>
                    <Link to="/questions">F.A.Q</Link>
                </li>
                <div className={'switch-lang'}>
                    <select value={selectedLanguage} onChange={(e) => handleLanguageSwitch(Number(e.target.value))}>
                        <option value="1">Français</option>
                        <option value="2">Anglais</option>
                    </select>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
