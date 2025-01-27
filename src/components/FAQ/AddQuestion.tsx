import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddQuestion = () => {
    const navigate = useNavigate();

    const [question, setQuestion] = useState({
        titleFr: '',
        contentFr: '',
        titleEn: '',
        contentEn: '',
        active: false,
        isSpotlight: false,
    });

    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/question`;
        const newQuestion = {
            active: question.active,
            isSpotlight: question.isSpotlight,
            translations: [
                {
                    id_lang: 1,
                    title: question.titleFr,
                    content: question.contentFr,
                },
                {
                    id_lang: 2,
                    title: question.titleEn,
                    content: question.contentEn,
                },
            ],
        };

        axios
            .post(apiUrl, newQuestion)
            .then(() => {
                alert('La question a été ajoutée avec succès !');
                navigate(`/questions`);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de l\'ajout de la question');
            });
    };

    return (
        <div>
            <h1>Ajouter une Question</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={question.active}
                            onChange={(e) => setQuestion({ ...question, active: e.target.checked })}
                        />
                        Actif
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={question.isSpotlight}
                            onChange={(e) => setQuestion({ ...question, isSpotlight: e.target.checked })}
                        />
                        Spotlight
                    </label>
                </div>

                <h2>Français</h2>
                <div>
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={question.titleFr}
                        onChange={(e) => setQuestion({ ...question, titleFr: e.target.value })}
                    />
                </div>
                <div>
                    <label>Contenu :</label>
                    <textarea
                        value={question.contentFr}
                        onChange={(e) => setQuestion({ ...question, contentFr: e.target.value })}
                    ></textarea>
                </div>

                <h2>Anglais</h2>
                <div>
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={question.titleEn}
                        onChange={(e) => setQuestion({ ...question, titleEn: e.target.value })}
                    />
                </div>
                <div>
                    <label>Contenu :</label>
                    <textarea
                        value={question.contentEn}
                        onChange={(e) => setQuestion({ ...question, contentEn: e.target.value })}
                    ></textarea>
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AddQuestion;
