import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './User.scss'; // Importer le fichier SCSS

const EditUser = () => {
    const { id } = useParams<{ id: string }>(); // Récupérer l'ID depuis l'URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastname: "",
        firstname: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les informations de l'utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/user/${id}`;
                const response = await axios.get(apiUrl);
                const { lastname, firstname, email } = response.data;
                setFormData({ lastname, firstname, email, password: "" }); // Charger les données sans mot de passe
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Échec du chargement des données de l'utilisateur.");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/user/${id}`;
            const payload = {
                lastname: formData.lastname,
                firstname: formData.firstname,
                password: formData.password || undefined, // Inclure le mot de passe uniquement s'il est renseigné
            };

            await axios.patch(apiUrl, payload);

            alert("Utilisateur mis à jour avec succès !");
            navigate("/users"); // Rediriger vers la liste des utilisateurs après modification
        } catch (err) {
            console.error(err);
            setError("Échec de la mise à jour de l'utilisateur.");
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="edit-user">
            <div className="title__wrapper">
                <h1>Modifier l'Utilisateur</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="lastname">Nom de famille :</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="firstname">Prénom :</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Nouveau mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <div className="button-group">
                    <button type="submit" className="btn btn-primary">Sauvegarder</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
