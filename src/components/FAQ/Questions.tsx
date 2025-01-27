import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import ListItem from "../ListItem/ListItem";
import {Link} from "react-router-dom";

const Questions = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { language } = useLanguage(); // Récupère la langue actuelle depuis le contexte

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/questions`;

                const response = await axios.get(apiUrl);

                const filteredQuestions = response.data
                    .map((question: any) => {
                        const translatedQuestion = question.translations.find(
                            (translation: any) => translation.id_lang === language
                        );

                        return {
                            ...question,
                            translation: translatedQuestion,
                        };
                    })
                    .filter((question: any) => question.translation);

                setQuestions(filteredQuestions);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch questions.");
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [language]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="title__wrapper">
                <h1>FAQ</h1>
                <Link to="/question/add-question">
                    <button className={'add-button'}>Ajouter</button>
                </Link>
            </div>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        <ListItem
                            id={question.id_question}
                            page={"question"}
                            title={question.translation.title}
                            active={question.active}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Questions;
