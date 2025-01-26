import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext"

const CategoryDetail = () => {
    const { id } = useParams(); // Utilisation de `id` comme id de catégorie
    const navigate = useNavigate();

    const { language } = useLanguage(); // Utilisation du contexte pour obtenir la langue sélectionnée
    const [category, setCategory] = useState({
        active: false,
        translations: [
            {
                id_lang: language, // Langue active
                title: "",
                content: "",
            },
        ],
        thumbnail: "", // Pas modifiable pour l'instant
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Récupérer les détails de la catégorie
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;

        axios
            .get(apiUrl)
            .then((response) => {
                const categoryData = response.data;
                setCategory({
                    active: categoryData.active,
                    translations: categoryData.translations,
                    thumbnail: categoryData.thumbnail,
                });
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch category");
                setLoading(false);
            });
    }, [id, language]); // Recharger les données lorsque la langue change

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            translations: prevCategory.translations.map((translation) =>
                translation.id_lang === language
                    ? { ...translation, [name]: value }
                    : translation
            ),
        }));
    };

    const handleSwitchChange = () => {
        setCategory((prevCategory) => ({
            ...prevCategory,
            active: !prevCategory.active,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construire l'objet de mise à jour
        const updatedCategory = {
            active: category.active,
            translations: category.translations,
        };

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/category/${id}`;

        axios
            .patch(apiUrl, updatedCategory)
            .then((response) => {
                // Gérer la réponse
                navigate(`/categories`);
            })
            .catch((err) => {
                setError("Failed to update category");
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Modifier la catégorie</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={category.translations.find(translation => translation.id_lang === language)?.title || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={category.translations.find(translation => translation.id_lang === language)?.content || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Active</label>
                    <input
                        type="checkbox"
                        checked={category.active}
                        onChange={handleSwitchChange}
                    />
                </div>
                <div>
                    <button type="submit">Sauvegarder</button>
                </div>
            </form>
        </div>
    );
};

export default CategoryDetail;
