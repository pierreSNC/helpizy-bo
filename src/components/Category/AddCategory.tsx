import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AddCategory: React.FC = () => {
    const [titleFr, setTitleFr] = useState<string>('');
    const [contentFr, setContentFr] = useState<string>('');
    const [titleEn, setTitleEn] = useState<string>('');
    const [contentEn, setContentEn] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    // const { language } = useLanguage();
    const navigate = useNavigate();

    const handleTitleFrChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitleFr(e.target.value);
    const handleContentFrChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContentFr(e.target.value);
    const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitleEn(e.target.value);
    const handleContentEnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContentEn(e.target.value);

    const handleActiveChange = () => setActive((prevActive) => !prevActive);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCategory = {
            active: active,
            translations: [
                {
                    id_lang: 1,
                    title: titleFr,
                    content: contentFr,
                },
                {
                    id_lang: 2,
                    title: titleEn,
                    content: contentEn,
                },
            ],
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL_PREFIX}/api/category`,
                newCategory
            );
            console.log('Category added successfully', response.data);
            // Rediriger vers la liste des catégories après l'ajout
            navigate('/categories');
        } catch (error) {
            console.error('Error adding category', error);
        }
    };

    return (
        <div>
            <h1>Ajouter une catégorie</h1>
            <form onSubmit={handleSubmit}>
                {/* Formulaire pour le Français */}
                <div>
                    <h3>Français</h3>
                    <div>
                        <label htmlFor="titleFr">Titre :</label>
                        <input
                            type="text"
                            id="titleFr"
                            value={titleFr}
                            onChange={handleTitleFrChange}
                            placeholder="Entrez le titre en français"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contentFr">Contenu :</label>
                        <textarea
                            id="contentFr"
                            value={contentFr}
                            onChange={handleContentFrChange}
                            placeholder="Entrez le contenu en français"
                            required
                        />
                    </div>
                </div>

                {/* Formulaire pour l'Anglais */}
                <div>
                    <h3>English</h3>
                    <div>
                        <label htmlFor="titleEn">Title :</label>
                        <input
                            type="text"
                            id="titleEn"
                            value={titleEn}
                            onChange={handleTitleEnChange}
                            placeholder="Enter title in English"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contentEn">Content :</label>
                        <textarea
                            id="contentEn"
                            value={contentEn}
                            onChange={handleContentEnChange}
                            placeholder="Enter content in English"
                            required
                        />
                    </div>
                </div>

                {/* Statut actif */}
                <div>
                    <label htmlFor="active">
                        Actif :
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={handleActiveChange}
                        />
                    </label>
                </div>

                <div>
                    <button type="submit">Ajouter la catégorie</button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
