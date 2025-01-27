import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
                setError("Failed to fetch user data.");
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

            alert("User updated successfully!");
            navigate("/users"); // Rediriger vers la liste des utilisateurs après modification
        } catch (err) {
            console.error(err);
            setError("Failed to update user.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled // Email est désactivé pour éviter la modification
                    />
                </div>

                <div>
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate("/users")}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditUser;
