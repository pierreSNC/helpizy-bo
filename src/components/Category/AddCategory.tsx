import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Category.scss';

const AddCategory = () => {
    const [titleFr, setTitleFr] = useState('');
    const [contentFr, setContentFr] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [contentEn, setContentEn] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Le fichier doit être une image.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError('L\'image ne doit pas dépasser 2MB.');
                return;
            }
            setError(null);
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titleFr || !contentFr || !titleEn || !contentEn) {
            setError('Tous les champs doivent être remplis.');
            return;
        }

        if (!image) {
            setError('Une image doit être téléchargée.');
            return;
        }

        setError(null);

        const formData = new FormData();
        formData.append("active", "true");
        formData.append("thumbnail", image);

        const translations = [
            { id_lang: 1, title: titleFr, excerpt: contentFr.substring(0, 100), content: contentFr },
            { id_lang: 2, title: titleEn, excerpt: contentEn.substring(0, 100), content: contentEn }
        ];

        formData.append("translations", JSON.stringify(translations));

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category`;

        try {
            await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Catégorie créée avec succès !');
            navigate('/categories');
            setTitleFr('');
            setContentFr('');
            setTitleEn('');
            setContentEn('');
            setImage(null);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la création de la catégorie.");
        }
    };

    return (
        <div className="add-category">
            <div className="title__wrapper">
                <h1>Ajouter une Catégorie</h1>
            </div>

            <div className="tabs">
                <button className={activeTab === 'fr' ? 'active' : ''} onClick={() => setActiveTab('fr')}>
                    Français
                </button>
                <button className={activeTab === 'en' ? 'active' : ''} onClick={() => setActiveTab('en')}>
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label htmlFor="titleFr">Titre</label>
                            <input type="text" id="titleFr" value={titleFr} onChange={(e) => setTitleFr(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contentFr">Contenu</label>
                            <textarea id="contentFr" value={contentFr} onChange={(e) => setContentFr(e.target.value)}></textarea>
                        </div>
                    </>
                )}
                {activeTab === 'en' && (
                    <>
                        <div className="input-group">
                            <label htmlFor="titleEn">Titre</label>
                            <input type="text" id="titleEn" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contentEn">Contenu</label>
                            <textarea id="contentEn" value={contentEn} onChange={(e) => setContentEn(e.target.value)}></textarea>
                        </div>
                    </>
                )}

                <div className="input-group">
                    <label htmlFor="image">Image</label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>

                {error && <p className="error">{error}</p>}

                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/categories")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
