import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListItem.scss';

interface ListItemProps {
    id: number;
    page: string;
    thumbnail: string;
    title: string;
}

const ListItem = ({ id, page, thumbnail, title }: ListItemProps) => {

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette item ?')) {
            const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/${page}/${id}`;

            axios
                .delete(apiUrl)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    return (
        <article className="listItem" id={'listItem'}>
            <img src={thumbnail} alt={title} />
            <div>
                <h3>{title}</h3>
                <button>
                    <Link to={`/${page}/edit/${id}`}>Modifier</Link>
                </button>

                <button onClick={handleDelete}>
                    Supprimer
                </button>
            </div>
        </article>
    );
};

export default ListItem;
