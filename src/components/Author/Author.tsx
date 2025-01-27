import { useEffect, useState } from 'react';
import axios from 'axios';
import ListItem from "../ListItem/ListItem";
import { useLanguage } from '../../context/LanguageContext'; // Importer le contexte
import { Link } from 'react-router-dom'; // Pour le lien vers la page d'ajout

const Author = () => {
    const [authors, setAuthors] = useState<any[]>([]);  // Changer "categories" en "authors"
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/authors`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Filtrer et ajouter les données pertinentes
                const authorsData = response.data.map((author: any) => {
                    return {
                        id: author.id_author,
                        firstname: author.firstname,
                        lastname: author.lastname,
                        thumbnail: author.profile_picture, // Utiliser profile_picture pour thumbnail
                        posts: author.posts, // Vous pouvez l'utiliser si vous avez besoin des posts
                    };
                });

                setAuthors(authorsData);
                console.log(authorsData)
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch authors");
                setLoading(false);
            });
    }, [language]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Authors</h1>
            <ul>
                {authors.map((author, index) => (
                    <li key={index}>
                        <ListItem
                            id={author.id}
                            page={'author'}
                            thumbnail={author.thumbnail}  // Passer le thumbnail de l'auteur
                            title={`${author.firstname} ${author.lastname}`} // Passer le nom complet de l'auteur
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Author;
