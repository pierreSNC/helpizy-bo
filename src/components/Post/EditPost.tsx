import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        titleFr: '',
        titleEn: '',
        contentFr: '',
        contentEn: '',
        additionalContentFr: '',
        additionalContentEn: '',
        id_category: [] as string[],
        id_author: '',
        thumbnail: '',  // Assure-toi que le champ thumbnail est là
    });
    const [newImage, setNewImage] = useState<File | null>(null);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [showCategories, setShowCategories] = useState(true);
    const [showAuthors, setShowAuthors] = useState(true);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((err) => console.error(err));

        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/authors`)
            .then((response) => setAuthors(response.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post/${id}`;
        axios.get(apiUrl)
            .then((response) => {
                const data = response.data;
                const frenchTranslation = data.translations.find((t: any) => t.id_lang === 1);
                const englishTranslation = data.translations.find((t: any) => t.id_lang === 2);

                setPost({
                    titleFr: frenchTranslation ? frenchTranslation.title : '',
                    contentFr: frenchTranslation ? frenchTranslation.content : '',
                    additionalContentFr: frenchTranslation ? frenchTranslation.additionnal_content : '',
                    titleEn: englishTranslation ? englishTranslation.title : '',
                    contentEn: englishTranslation ? englishTranslation.content : '',
                    additionalContentEn: englishTranslation ? englishTranslation.additionnal_content : '',
                    id_category: Array.isArray(data.id_category) ? data.id_category : data.id_category.split(','),
                    id_author: data.id_author,
                    thumbnail: data.thumbnail || '', // Assure-toi de conserver l'image actuelle
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post/${id}`;
        const formData = new FormData();

        // Ajoute les données textuelles
        formData.append('id_category', post.id_category.join(','));
        formData.append('id_author', post.id_author);
        formData.append('translations', JSON.stringify([{
            id_lang: 1,
            title: post.titleFr,
            content: post.contentFr,
            additionnal_content: post.additionalContentFr,
        }, {
            id_lang: 2,
            title: post.titleEn,
            content: post.contentEn,
            additionnal_content: post.additionalContentEn,
        }]));

        if (newImage) {
            formData.append('thumbnail', newImage);
        }

        try {
            await axios.patch(apiUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/posts');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour du post.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
    };

    const handleCategoryChange = (id: any) => {
        const updatedCategories = post.id_category.includes(String(id))
            ? post.id_category.filter((catId: string) => catId !== String(id))
            : [...post.id_category, String(id)];

        setPost({ ...post, id_category: updatedCategories });
    };

    const handleAuthorChange = (id: number) => {
        setPost({ ...post, id_author: String(id) });
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="post__wrapper">
            <h1>Modifier le post</h1>

            {/* Gestion des catégories */}
            <div className="selection__buttons">
                <button onClick={() => setShowCategories(!showCategories)} className="toggle-button">
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
                                    checked={post.id_category.includes(String(category.id_category))}
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
                <button onClick={() => setShowAuthors(!showAuthors)} className="toggle-button">
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
                            <label>Contenu principal (Français) :</label>
                            <ReactQuill
                                id="post-content"
                                value={post.contentFr}
                                onChange={(value) => setPost({ ...post, contentFr: value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu additionnel (Français) :</label>
                            <textarea
                                id={'post-additional-content'}
                                value={post.additionalContentFr}
                                onChange={(e) => setPost({ ...post, additionalContentFr: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'en' && (
                    <>
                        <div className="input-group">
                            <label>Title (English) :</label>
                            <input
                                type="text"
                                value={post.titleEn}
                                onChange={(e) => setPost({ ...post, titleEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Main Content (English) :</label>
                            <ReactQuill
                                id="post-content"
                                value={post.contentEn}
                                onChange={(value) => setPost({ ...post, contentEn: value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Additional Content (English) :</label>
                            <textarea
                                id={'post-additional-content'}
                                value={post.additionalContentEn}
                                onChange={(e) => setPost({ ...post, additionalContentEn: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="image-preview">
                    <label>Image actuelle :</label>
                    {post.thumbnail ? (
                        <img src={post.thumbnail} alt="Aperçu" style={{ maxWidth: '200px', marginBottom: '10px' }} />
                    ) : (
                        <p>Aucune image disponible</p>
                    )}
                </div>

                <div className="input-group">
                    <label>Nouvelle image :</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/posts')}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostEdit;
