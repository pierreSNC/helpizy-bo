import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const AddCategory = () => {
    const [titleFr, setTitleFr] = useState('');
    const [contentFr, setContentFr] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [contentEn, setContentEn] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Le fichier doit être une image.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB size limit
                setError('L\'image ne doit pas dépasser 2MB.');
                return;
            }
            setError(null);
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérification des champs obligatoires
        if (!titleFr || !contentFr || !titleEn || !contentEn) {
            setError('Tous les champs doivent être remplis.');
            return;
        }

        if (!image) {
            setError('Une image doit être téléchargée.');
            return;
        }

        setError(null);

        // Création du FormData pour envoyer l'image et les autres données
        const formData = new FormData();
        formData.append("active", "true");  // Ajouter active comme true
        formData.append("thumbnail", image);  // Ajouter l'image

        // On convertit les traductions en JSON pour qu'elles soient envoyées correctement
        const translations = [
            { id_lang: 1, title: titleFr, excerpt: contentFr.substring(0, 100), content: contentFr },
            { id_lang: 2, title: titleEn, excerpt: contentEn.substring(0, 100), content: contentEn }
        ];

        // Ajouter les traductions sous forme de chaîne JSON dans le FormData
        formData.append("translations", JSON.stringify(translations));

        // Création de la catégorie via API
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category`;

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Définir le bon type de contenu pour FormData
                },
            });

            console.log(response)
            // Réinitialiser les champs après la soumission réussie
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
            <h1>Ajouter une Catégorie</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>Français</h2>
                    <label htmlFor="titleFr">Titre</label>
                    <input
                        type="text"
                        id="titleFr"
                        value={titleFr}
                        onChange={(e) => setTitleFr(e.target.value)}
                    />
                    <label htmlFor="contentFr">Contenu</label>
                    <textarea
                        id="contentFr"
                        value={contentFr}
                        onChange={(e) => setContentFr(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <h2>Anglais</h2>
                    <label htmlFor="titleEn">Titre</label>
                    <input
                        type="text"
                        id="titleEn"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />
                    <label htmlFor="contentEn">Contenu</label>
                    <textarea
                        id="contentEn"
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Sauvegarder</button>
            </form>
        </div>
    );
};

export default AddCategory;
