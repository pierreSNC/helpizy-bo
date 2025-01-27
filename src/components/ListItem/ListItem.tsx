import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListItem.scss';

interface ListItemProps {
    id: number;
    page: string;
    thumbnail: string;
    title: string;
}

const ListItem = ({ id, page, thumbnail, title, active }: ListItemProps) => {
    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet item ?')) {
            const apiUrl = `${import.meta.env.VITE_API_URL_PREFIX}/api/${page}/${id}`;

            axios
                .delete(apiUrl)
                .then(() => {
                    window.location.reload(); // Rafraîchit la page (non optimal)
                })
                .catch((err) => {
                    console.error('Erreur lors de la suppression :', err);
                });
        }
    };

    return (
        <article className="listItem" id="listItem">
            <div className={'listItem__wrapper'}>
                {page !== 'question' && (
                    <div>
                        <img
                            src={thumbnail || 'https://via.placeholder.com/80'}
                            alt={title}
                            width={'80'}
                            height={'80'}
                        />
                    </div>
                )}
                <div>

                    <h3>{title}</h3>
                </div>
            </div>
            <div className={'navigation__wrapper'}>
                {page !== 'author' && (
                    <div className={'button-navigation'}>
                        <button className={'modify-button'}>
                            <Link to={`/${page}/edit/${id}`}>Modifier</Link>
                        </button>
                        <button className={'delete-button'} onClick={handleDelete}>Supprimer</button>
                    </div>
                )}
                {(page === 'question' || page === 'category') && (
                    <div>
                        {active ? (
                            <div  className={'item-active'}>active</div>
                        ) : (
                            <div className={'item-disable'}>désactivé</div>
                        )}
                    </div>
                )}
            </div>


        </article>
    );
};

export default ListItem;
