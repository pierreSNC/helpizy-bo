import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FAQ.scss';

const AddQuestion = () => {
    const [titleFr, setTitleFr] = useState('');
    const [contentFr, setContentFr] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [contentEn, setContentEn] = useState('');
    const [active, setActive] = useState(false);
    const [isSpotlight, setIsSpotlight] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titleFr || !contentFr || !titleEn || !contentEn) {
            setError('Tous les champs doivent être remplis.');
            return;
        }

        setError(null);

        const newQuestion = {
            active,
            isSpotlight,
            translations: [
                { id_lang: 1, title: titleFr, content: contentFr },
                { id_lang: 2, title: titleEn, content: contentEn },
            ]
        };

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/question`;

        try {
            await axios.post(apiUrl, newQuestion);

            alert('La question a été ajoutée avec succès !');
            navigate('/questions');
            setTitleFr('');
            setContentFr('');
            setTitleEn('');
            setContentEn('');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'ajout de la question.");
        }
    };

    return (
        <div className="add-question">
            <div className="title__wrapper">
                <h1>Ajouter une Question</h1>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'fr' ? 'active' : ''}
                    onClick={() => setActiveTab('fr')}
                >
                    Français
                </button>
                <button
                    className={activeTab === 'en' ? 'active' : ''}
                    onClick={() => setActiveTab('en')}
                >
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label htmlFor="titleFr">Titre</label>
                            <input
                                type="text"
                                id="titleFr"
                                value={titleFr}
                                onChange={(e) => setTitleFr(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contentFr">Contenu</label>
                            <textarea
                                id="contentFr"
                                value={contentFr}
                                onChange={(e) => setContentFr(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'en' && (
                    <>
                        <div className="input-group">
                            <label htmlFor="titleEn">Titre</label>
                            <input
                                type="text"
                                id="titleEn"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contentEn">Contenu</label>
                            <textarea
                                id="contentEn"
                                value={contentEn}
                                onChange={(e) => setContentEn(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <div className="status__wrapper">
                    <label htmlFor="isSpotlight">Spotlight</label>
                    <input
                        type="checkbox"
                        id="isSpotlight"
                        checked={isSpotlight}
                        onChange={(e) => setIsSpotlight(e.target.checked)}
                    />
                </div>

                {error && <p className="error">{error}</p>}


                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/questions")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AddQuestion;
