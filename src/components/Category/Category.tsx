import { useEffect, useState } from 'react';
import axios from 'axios';
import ListItem from "../ListItem/ListItem";
import { useLanguage } from '../../context/LanguageContext'; // Importer le contexte
import { Link } from 'react-router-dom'; // Pour le lien vers la page d'ajout

const Category = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/categories`;

        axios
            .get(apiUrl)
            .then((response) => {
                const filteredCategories = response.data.map((category: any) => {
                    const translatedCategory = category.translations.find(
                        (translation: any) => translation.id_lang === language
                    );
                    return {
                        ...category,
                        translation: translatedCategory,
                    };
                }).filter((category: any) => category.translation);

                setCategories(filteredCategories);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch categories");
                setLoading(false);
            });
    }, [language]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="title__wrapper">
                <h1>Catégories</h1>
                <Link to="/category/add-category">
                    <button className={'add-button'}>Ajouter</button>
                </Link>
            </div>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <ListItem
                            id={category.id_category}
                            page={'category'}
                            thumbnail={category.thumbnail}
                            title={category.translation.title}
                            active={category.active}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
