import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

const PostDetails = () => {
    const { id_post } = useParams(); // Récupère l'ID depuis l'URL
    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post/${id_post}`;
        const idLangFr = Number(import.meta.env.VITE_ID_LANG_FR);

        axios
            .get(apiUrl)
            .then((response) => {
                const post = response.data;
                console.log(post)
                const frenchTranslation = post.translations.find(
                    (translation: any) => translation.id_lang === idLangFr
                );

                if (frenchTranslation) {
                    setPost({
                        ...post,
                        translation: frenchTranslation,
                    });
                } else {
                    setError("Aucune traduction française trouvée pour ce post.");
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Échec de la récupération du post.");
                setLoading(false);
            });
    }, [id_post]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{post.translation.title}</h1>
            <img src={post.thumbnail} alt={post.translation.title} />
            <p>{post.translation.content}</p>
        </div>
    );
};

export default PostDetails;
