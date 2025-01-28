import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Category.scss';

const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState({
        titleFr: '',
        titleEn: '',
        contentFr: '',
        contentEn: '',
        active: true,
        thumbnail: '', // URL de l'image actuelle
    });
    const [newImage, setNewImage] = useState<File | null>(null); // Nouvelle image à uploader
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

    // Récupère la catégorie à modifier
    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;
        axios.get(apiUrl)
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
                    thumbnail: data.thumbnail, // URL de l'image actuelle
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            });
    }, [id]);

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;
        const formData = new FormData();

        // Ajoute les données textuelles
        formData.append('active', String(category.active));
        formData.append('translations', JSON.stringify([
            { id_lang: 1, title: category.titleFr, content: category.contentFr },
            { id_lang: 2, title: category.titleEn, content: category.contentEn },
        ]));

        // Ajoute la nouvelle image si présente
        if (newImage) {
            formData.append('thumbnail', newImage);
        }

        try {
            await axios.patch(apiUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/categories');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour de la catégorie.");
        }
    };

    // Gère la sélection de l'image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
    };

    // Affichage en cas de chargement ou d'erreur
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="category__wrapper">
            <h1>Modifier la catégorie</h1>

            <div className="status__wrapper">
                <label>Status :</label>
                <input
                    type="checkbox"
                    checked={category.active}
                    onChange={(e) => setCategory({ ...category, active: e.target.checked })}
                />
            </div>

            <div className="nav nav-tabs">
                <button className={`nav-link ${activeTab === 'fr' ? 'active' : ''}`} onClick={() => setActiveTab('fr')}>
                    Français
                </button>
                <button className={`nav-link ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label>Titre (Français) :</label>
                            <input
                                type="text"
                                value={category.titleFr}
                                onChange={(e) => setCategory({ ...category, titleFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu (Français) :</label>
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
                            <label>Titre (Anglais) :</label>
                            <input
                                type="text"
                                value={category.titleEn}
                                onChange={(e) => setCategory({ ...category, titleEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu (Anglais) :</label>
                            <textarea
                                value={category.contentEn}
                                onChange={(e) => setCategory({ ...category, contentEn: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="image-preview">
                    {category.thumbnail ? (
                        <img src={category.thumbnail} alt="Aperçu" style={{ maxWidth: '200px', marginBottom: '10px' }} />
                    ) : (
                        <p>Aucune image disponible</p>
                    )}
                </div>

                <div className="input-group">
                    <label>Nouvelle image :</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/categories')}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryEdit;
