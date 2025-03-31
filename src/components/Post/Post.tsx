import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ListItem/ListItem';
import ListItem from "../ListItem/ListItem";
import {useLanguage} from "../../context/LanguageContext";
import {Link} from "react-router-dom";

const Post: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage();

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/posts`;

        axios
            .get(apiUrl)
            .then((response) => {
                const filteredPosts = response.data.map((post: any) => {
                    const frenchTranslation = post.translations.find(
                        (translation: any) => translation.id_lang === language
                    );
                    return {
                        ...post,
                        translation: frenchTranslation,
                    };
                }).filter((post: any) => post.translation);
                console.log(filteredPosts)
                setPosts(filteredPosts);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch posts');
                setLoading(false);
            });
    }, [language]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="title__wrapper">

                <h1>Articles</h1>
                <Link to="/post/add-post">
                    <button className={'add-button'}>Ajouter</button>
                </Link>
            </div>
            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <ListItem
                            thumbnail={post.thumbnail}
                            title={post.translation.title}
                            excerpt={post.translation.excerpt}
                            id={post.id_post}
                            active={post.active}
                            page={'post'}
                        />

                    </li>

                ))}
            </ul>
        </div>
    );
};

export default Post;
