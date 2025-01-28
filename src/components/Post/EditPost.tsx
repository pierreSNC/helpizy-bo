import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './Post.scss';

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        titleFr: '',
        titleEn: '',
        excerptFr: '',
        excerptEn: '',
        contentFr: '',
        contentEn: '',
        additionalContentFr: '',
        additionalContentEn: '',
        active: true,
        thumbnail: '', // URL de l'image actuelle
        videoUrl: '', // Lien YouTube
        id_category: [], // Liste des catégories sélectionnées
        id_author: '', // Auteur sélectionné
    });
    const [newImage, setNewImage] = useState<File | null>(null); // Nouvelle image à uploader
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [showCategories, setShowCategories] = useState(true);
    const [showAuthors, setShowAuthors] = useState(true);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Récupère les catégories et auteurs
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((err) => console.error(err));

        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/authors`)
            .then((response) => setAuthors(response.data))
            .catch((err) => console.error(err));
    }, []);

    // Récupère le post à modifier
    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post/${id}`;
        axios.get(apiUrl)
            .then((response) => {
                const data = response.data;
                const frenchTranslation = data.translations.find((t: any) => t.id_lang === 1);
                const englishTranslation = data.translations.find((t: any) => t.id_lang === 2);

                setPost({
                    titleFr: frenchTranslation ? frenchTranslation.title : '',
                    excerptFr: frenchTranslation ? frenchTranslation.excerpt : '',
                    contentFr: frenchTranslation ? frenchTranslation.content : '',
                    additionalContentFr: frenchTranslation ? frenchTranslation.additionnal_content : '',
                    titleEn: englishTranslation ? englishTranslation.title : '',
                    excerptEn: englishTranslation ? englishTranslation.excerpt : '',
                    contentEn: englishTranslation ? englishTranslation.content : '',
                    additionalContentEn: englishTranslation ? englishTranslation.additionnal_content : '',
                    active: data.active,
                    thumbnail: data.thumbnail,
                    videoUrl: data.video_url || '', // Assure un lien YouTube par défaut
                    id_category: data.id_category ? data.id_category.split(',').map((id: string) => parseInt(id)).filter(id => !isNaN(id)) : [], // Filtrer NaN
                    id_author: data.id_author || '',
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            });
    }, [id]);

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post/${id}`;
        const formData = new FormData();

        // Ajoute les données textuelles
        formData.append('active', String(post.active));
        formData.append('video_url', post.videoUrl); // Lien YouTube

        // Formate les catégories sélectionnées en une chaîne séparée par des virgules (en éliminant NaN)
        formData.append('id_category', post.id_category.filter(id => !isNaN(id)).join(',')); // Catégories sous forme de chaîne "31,32"

        formData.append('id_author', post.id_author); // Auteur sélectionné
        formData.append('translations', JSON.stringify([
            {
                id_lang: 1,
                title: post.titleFr,
                excerpt: post.excerptFr,
                content: post.contentFr,
                additionnal_content: post.additionalContentFr,
            },
            {
                id_lang: 2,
                title: post.titleEn,
                excerpt: post.excerptEn,
                content: post.contentEn,
                additionnal_content: post.additionalContentEn,
            },
        ]));

        // Ajoute la nouvelle image si présente
        if (newImage) {
            formData.append('thumbnail', newImage);
        }

        try {
            await axios.patch(apiUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/posts'); // Redirige vers la liste des posts
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour du post.");
        }
    };

    // Gère la sélection de l'image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
    };

    // Gère la sélection de catégorie
    const handleCategoryChange = (id: number) => {
        setPost(prevState => {
            const newCategories = prevState.id_category.includes(id)
                ? prevState.id_category.filter(categoryId => categoryId !== id)
                : [...prevState.id_category, id];
            return { ...prevState, id_category: newCategories.filter(id => !isNaN(id)) }; // Filtrer NaN
        });
    };

    // Gère la sélection d'auteur
    const handleAuthorChange = (id: number) => {
        setPost({ ...post, id_author: String(id) });
    };

    // Affichage en cas de chargement ou d'erreur
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="post__wrapper">
            <h1>Modifier le post</h1>

            {/* Gestion des catégories */}
            <div className="selection__buttons">
                <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="toggle-button"
                >
                    Catégories {showCategories ? "🔽" : "🔼"}
                </button>
            </div>

            {showCategories && (
                <div className="categories__section">
                    <h2>Catégories</h2>
                    {categories.map((category: any) => (
                        <div key={category.id_category}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="category"
                                    value={category.id_category}
                                    checked={post.id_category.includes(category.id_category)} // Vérifie si la catégorie est sélectionnée
                                    onChange={() => handleCategoryChange(category.id_category)}
                                />
                                {category.translations.find((t: any) => t.id_lang === 1)?.title || "Sans titre"}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* Gestion des auteurs */}
            <div className="selection__buttons">
                <button
                    onClick={() => setShowAuthors(!showAuthors)}
                    className="toggle-button"
                >
                    Auteurs {showAuthors ? "🔽" : "🔼"}
                </button>
            </div>

            {showAuthors && (
                <div className="authors__section">
                    <h2>Auteurs</h2>
                    {authors.map((author: any) => (
                        <div key={author.id_author}>
                            <label>
                                <input
                                    type="radio"
                                    name="author"
                                    value={author.id_author}
                                    checked={post.id_author === String(author.id_author)}
                                    onChange={() => handleAuthorChange(author.id_author)}
                                />
                                {author.firstname} {author.lastname}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            <div className="status__wrapper">
                <label>Status :</label>
                <input
                    type="checkbox"
                    checked={post.active}
                    onChange={(e) => setPost({ ...post, active: e.target.checked })}
                />
            </div>

            <div className="nav nav-tabs">
                <button className={`nav-link ${activeTab === 'fr' ? 'active' : ''}`} onClick={() => setActiveTab('fr')}>
                    Français
                </button>
                <button className={`nav-link ${activeTab === 'en' ? 'active' : ''}`} onClick={() => setActiveTab('en')}>
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label>Titre (Français) :</label>
                            <input
                                type="text"
                                value={post.titleFr}
                                onChange={(e) => setPost({ ...post, titleFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Résumé (Français) :</label>
                            <textarea
                                value={post.excerptFr}
                                onChange={(e) => setPost({ ...post, excerptFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu principal (Français) :</label>
                            <textarea
                                value={post.contentFr}
                                onChange={(e) => setPost({ ...post, contentFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu additionnel (Français) :</label>
                            <textarea
                                value={post.additionalContentFr}
                                onChange={(e) => setPost({ ...post, additionalContentFr: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'en' && (
                    <>
                        <div className="input-group">
                            <label>Titre (Anglais) :</label>
                            <input
                                type="text"
                                value={post.titleEn}
                                onChange={(e) => setPost({ ...post, titleEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Résumé (Anglais) :</label>
                            <textarea
                                value={post.excerptEn}
                                onChange={(e) => setPost({ ...post, excerptEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu principal (Anglais) :</label>
                            <textarea
                                value={post.contentEn}
                                onChange={(e) => setPost({ ...post, contentEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu additionnel (Anglais) :</label>
                            <textarea
                                value={post.additionalContentEn}
                                onChange={(e) => setPost({ ...post, additionalContentEn: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label>Image :</label>
                    <input type="file" onChange={handleImageChange} />
                    {post.thumbnail && !newImage && (
                        <div className="image-preview">
                            <img src={post.thumbnail} alt="thumbnail" width="150" />
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn">Enregistrer les modifications</button>
            </form>
        </div>
    );
};

export default PostEdit;
