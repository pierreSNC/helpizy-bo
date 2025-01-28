import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FAQ.scss'

const EditQuestion = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [question, setQuestion] = useState({
        titleFr: '',
        contentFr: '',
        titleEn: '',
        contentEn: '',
        active: false,
        isSpotlight: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('fr'); // Tab actif (Français ou Anglais)

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/question/${id}`;

        axios
            .get(apiUrl)
            .then((response) => {
                const data = response.data;

                const frenchTranslation = data.translations.find((t: any) => t.id_lang === 1);
                const englishTranslation = data.translations.find((t: any) => t.id_lang === 2);

                setQuestion({
                    titleFr: frenchTranslation ? frenchTranslation.title : '',
                    contentFr: frenchTranslation ? frenchTranslation.content : '',
                    titleEn: englishTranslation ? englishTranslation.title : '',
                    contentEn: englishTranslation ? englishTranslation.content : '',
                    active: data.active,
                    isSpotlight: data.isSpotlight,
                });

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/question/${id}`;
        const updatedQuestion = {
            active: question.active,
            isSpotlight: question.isSpotlight,
            translations: [
                {
                    id_lang: 1,
                    title: question.titleFr,
                    content: question.contentFr,
                },
                {
                    id_lang: 2,
                    title: question.titleEn,
                    content: question.contentEn,
                },
            ],
        };

        axios
            .patch(apiUrl, updatedQuestion)
            .then(() => {
                alert('La question a été mise à jour avec succès !');
                navigate(`/questions`);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la mise à jour');
            });
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="faq-edit">
            <h1>Modifier la Question</h1>
            <form onSubmit={handleSubmit}>
                <div className={'status__wrapper'}>
                    <label>
                        <input
                            type="checkbox"
                            checked={question.active}
                            onChange={(e) => setQuestion({ ...question, active: e.target.checked })}
                        />
                        Actif
                    </label>
                </div>
                <div className={'status__wrapper'}>
                    <label>
                        <input
                            type="checkbox"
                            checked={question.isSpotlight}
                            onChange={(e) => setQuestion({ ...question, isSpotlight: e.target.checked })}
                        />
                        À la une
                    </label>
                </div>

                <div className="tabs">
                    <button
                        type="button"
                        className={activeTab === 'fr' ? 'active' : ''}
                        onClick={() => setActiveTab('fr')}
                    >
                        Français
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'en' ? 'active' : ''}
                        onClick={() => setActiveTab('en')}
                    >
                        Anglais
                    </button>
                </div>

                <div className={`tab-content ${activeTab === 'fr' ? 'active' : ''}`}>
                    <h2>Français</h2>
                    <div className="input-group">
                        <label>Titre :</label>
                        <input
                            type="text"
                            value={question.titleFr}
                            onChange={(e) => setQuestion({ ...question, titleFr: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Contenu :</label>
                        <textarea
                            value={question.contentFr}
                            onChange={(e) => setQuestion({ ...question, contentFr: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className={`tab-content ${activeTab === 'en' ? 'active' : ''}`}>
                    <h2>Anglais</h2>
                    <div className="input-group">
                        <label>Titre :</label>
                        <input
                            type="text"
                            value={question.titleEn}
                            onChange={(e) => setQuestion({ ...question, titleEn: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Contenu :</label>
                        <textarea
                            value={question.contentEn}
                            onChange={(e) => setQuestion({ ...question, contentEn: e.target.value })}
                        ></textarea>
                    </div>
                </div>
                <div>
                    <div className="button-group">
                        <button type="submit">Sauvegarder</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/questions")}>Annuler</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditQuestion;
