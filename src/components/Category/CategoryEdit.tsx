import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Category.scss';

const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // État pour gérer les données de la catégorie et le contenu des traductions
    const [category, setCategory] = useState({
        titleFr: '',
        titleEn: '',
        contentFr: '',
        contentEn: '',
        active: true,
    });

    // État pour le chargement et les erreurs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // État pour gérer l'onglet actif
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr'); // 'fr' pour Français, 'en' pour Anglais

    // Récupération des données de la catégorie
    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;

        axios
            .get(apiUrl)
            .then((response) => {
                const data = response.data;

                const frenchTranslation = data.translations.find((t: any) => t.id_lang === 1);
                const englishTranslation = data.translations.find((t: any) => t.id_lang === 2);

                setCategory({
                    titleFr: frenchTranslation ? frenchTranslation.title : '',
                    contentFr: frenchTranslation ? frenchTranslation.content : '',
                    titleEn: englishTranslation ? englishTranslation.title : '',
                    contentEn: englishTranslation ? englishTranslation.content : '',
                    active: data.active,
                });

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            });
    }, [id]);

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;
        const updatedCategory = {
            active: category.active,
            translations: [
                {
                    id_lang: 1,
                    title: category.titleFr,
                    content: category.contentFr,
                },
                {
                    id_lang: 2,
                    title: category.titleEn,
                    content: category.contentEn,
                },
            ],
        };

        axios
            .patch(apiUrl, updatedCategory)
            .then(() => {
                navigate(`/categories`);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la mise à jour');
            });
    };

    // Affichage lors du chargement ou en cas d'erreur
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="category__wrapper">
            <div className="title__wrapper">
                <h1>Modifier la catégorie</h1>
            </div>
            <div className="status__wrapper">
                <label>Status :</label>
                <input
                    type="checkbox"
                    checked={category.active}
                    onChange={(e) => setCategory({ ...category, active: e.target.checked })}
                />
            </div>

            {/* Onglets pour passer entre les langues */}
            <div className="nav nav-tabs">
                <button
                    className={`nav-link ${activeTab === 'fr' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fr')}
                >
                    Français
                </button>
                <button
                    className={`nav-link ${activeTab === 'en' ? 'active' : ''}`}
                    onClick={() => setActiveTab('en')}
                >
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label>Titre :</label>
                            <input
                                type="text"
                                value={category.titleFr}
                                onChange={(e) => setCategory({ ...category, titleFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu :</label>
                            <textarea
                                value={category.contentFr}
                                onChange={(e) => setCategory({ ...category, contentFr: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'en' && (
                    <>
                        <div className="input-group">
                            <label>Titre :</label>
                            <input
                                type="text"
                                value={category.titleEn}
                                onChange={(e) => setCategory({ ...category, titleEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu :</label>
                            <textarea
                                value={category.contentEn}
                                onChange={(e) => setCategory({ ...category, contentEn: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/categories")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default CategoryEdit;
