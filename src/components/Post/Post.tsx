import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ListItem/ListItem';
import ListItem from "../ListItem/ListItem";

const Post: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/posts`;
        const idLangFr = Number(import.meta.env.VITE_ID_LANG_FR);

        axios
            .get(apiUrl)
            .then((response) => {
                const filteredPosts = response.data.map((post: any) => {
                    const frenchTranslation = post.translations.find(
                        (translation: any) => translation.id_lang === idLangFr
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
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Posts en Français</h1>
            <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <ListItem
                            thumbnail={post.thumbnail}
                            title={post.translation.title}
                            excerpt={post.translation.excerpt}
                            postId={post.id_post}
                        />

                    </li>

                ))}
            </ul>
        </div>
    );
};

export default Post;
