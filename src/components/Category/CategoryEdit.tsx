import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState({
        titleFr: '',
        titleEn: '',
        contentFr: '',
        contentEn: '',
        active: true,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Modifier la catégorie</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre (Français) :</label>
                    <input
                        type="text"
                        value={category.titleFr}
                        onChange={(e) => setCategory({ ...category, titleFr: e.target.value })}
                    />
                </div>
                <div>
                    <label>Contenu (Français) :</label>
                    <textarea
                        value={category.contentFr}
                        onChange={(e) => setCategory({ ...category, contentFr: e.target.value })}
                    />
                </div>
                <div>
                    <label>Titre (Anglais) :</label>
                    <input
                        type="text"
                        value={category.titleEn}
                        onChange={(e) => setCategory({ ...category, titleEn: e.target.value })}
                    />
                </div>
                <div>
                    <label>Contenu (Anglais) :</label>
                    <textarea
                        value={category.contentEn}
                        onChange={(e) => setCategory({ ...category, contentEn: e.target.value })}
                    />
                </div>
                <div>
                    <label>Status :</label>
                    <input
                        type="checkbox"
                        checked={category.active}
                        onChange={(e) => setCategory({ ...category, active: e.target.checked })}
                    />
                    Actif
                </div>
                <button type="submit">Sauvegarder</button>
            </form>
        </div>
    );
};

export default CategoryEdit;
