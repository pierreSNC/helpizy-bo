import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Post.scss';

const AddPost = () => {
    const navigate = useNavigate();

    const [post, setPost] = useState({
        titleFr: "",
        titleEn: "",
        excerptFr: "",
        excerptEn: "",
        contentFr: "",
        contentEn: "",
        additionalContentFr: "",
        additionalContentEn: "",
        active: true,
        thumbnail: "",
        videoUrl: "",
        id_category: "",
        id_author: "",
    });

    const [newImage, setNewImage] = useState<File | null>(null);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [showCategories, setShowCategories] = useState(true);
    const [showAuthors, setShowAuthors] = useState(true);
    const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL_PREFIX}/api/authors`)
            .then((response) => setAuthors(response.data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/post`;
        const formData = new FormData();

        formData.append("active", String(post.active));
        formData.append("video_url", post.videoUrl);
        formData.append("id_category", post.id_category);
        formData.append("id_author", post.id_author);

        const translations = [
            { id_lang: 1, title: post.titleFr, excerpt: post.excerptFr, content: post.contentFr, additionnal_content: post.additionalContentFr },
            { id_lang: 2, title: post.titleEn, excerpt: post.excerptEn, content: post.contentEn, additionnal_content: post.additionalContentEn }
        ];

        formData.append("translations", JSON.stringify(translations));

        if (newImage) {
            formData.append("thumbnail", newImage);
        }

        try {
            await axios.post(apiUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/posts");
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'ajout du post.");
        }
    };

    const handleCategoryChange = (id: number) => {
        const selectedIds = post.id_category.split(",").map((id) => id.trim()).filter((id) => id !== "");
        if (selectedIds.includes(String(id))) {
            const updatedIds = selectedIds.filter((catId) => catId !== String(id));
            setPost({ ...post, id_category: updatedIds.join(",") });
        } else {
            const updatedIds = [...selectedIds, String(id)];
            setPost({ ...post, id_category: updatedIds.join(",") });
        }
    };

    const handleAuthorChange = (id: number) => {
        setPost({ ...post, id_author: String(id) });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="post__wrapper">
            <h1>Ajouter un post</h1>

            {/* Gestion des boutons pour catégories et auteurs */}
            <div className="selection__buttons">
                <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="toggle-button"
                >
                    Catégories {showCategories ? "🔽" : "🔼"}
                </button>
            </div>

            {/* Section Catégories */}
            {showCategories && (
                <div className="categories__section">
                    <h2>Catégories</h2>
                    {categories.map((category: any) => {
                        const categoryTranslation = category.translations.find((t: any) => t.id_lang === 1);
                        return (
                            <div key={category.id_category}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={post.id_category.split(",").map((id) => id.trim()).includes(String(category.id_category))}
                                        onChange={() => handleCategoryChange(category.id_category)}
                                    />
                                    {categoryTranslation ? categoryTranslation.title : "Sans titre"}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="selection__buttons">
                <button
                    onClick={() => setShowAuthors(!showAuthors)}
                    className="toggle-button"
                >
                    Auteurs {showAuthors ? "🔽" : "🔼"}
                </button>
            </div>
            {/* Section Auteurs */}
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

            {/* Système de Tabulation pour les traductions */}
            <div className="tabs">
                <button
                    className={activeTab === 'fr' ? 'active' : ''}
                    onClick={() => setActiveTab('fr')}
                >
                    Français
                </button>
                <button
                    className={activeTab === 'en' ? 'active' : ''}
                    onClick={() => setActiveTab('en')}
                >
                    Anglais
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'fr' && (
                    <>
                        <div className="input-group">
                            <label>Titre (Français)</label>
                            <input
                                type="text"
                                value={post.titleFr}
                                onChange={(e) => setPost({ ...post, titleFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Résumé (Français)</label>
                            <textarea
                                value={post.excerptFr}
                                onChange={(e) => setPost({ ...post, excerptFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu principal (Français)</label>
                            <textarea
                                value={post.contentFr}
                                onChange={(e) => setPost({ ...post, contentFr: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu additionnel (Français)</label>
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
                            <label>Titre (Anglais)</label>
                            <input
                                type="text"
                                value={post.titleEn}
                                onChange={(e) => setPost({ ...post, titleEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Résumé (Anglais)</label>
                            <textarea
                                value={post.excerptEn}
                                onChange={(e) => setPost({ ...post, excerptEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu principal (Anglais)</label>
                            <textarea
                                value={post.contentEn}
                                onChange={(e) => setPost({ ...post, contentEn: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Contenu additionnel (Anglais)</label>
                            <textarea
                                value={post.additionalContentEn}
                                onChange={(e) => setPost({ ...post, additionalContentEn: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="input-group">
                    <label>Lien vidéo YouTube :</label>
                    <input
                        type="text"
                        value={post.videoUrl}
                        onChange={(e) => setPost({ ...post, videoUrl: e.target.value })}
                        placeholder="Ex: https://www.youtube.com/watch?v=example"
                    />
                </div>

                <div className="input-group">
                    <label>Image (Thumbnail)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <div className="button-group">
                    <button type="submit">Sauvegarder</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/posts")}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPost;
