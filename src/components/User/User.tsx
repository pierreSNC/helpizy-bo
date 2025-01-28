import { useEffect, useState } from 'react';
import axios from 'axios';
import ListItem from "../ListItem/ListItem";

const User = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/users`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Réponse contenant les utilisateurs
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch users");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="title__wrapper">
                <h1>Utilisateurs</h1>
            </div>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <ListItem
                            id={user.id_user}
                            page={'user'}
                            title={`${user.firstname} ${user.lastname}`}
                            thumbnail={user.profile_picture || 'https://placehold.co/80'} // Placeholder si pas d'image
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
