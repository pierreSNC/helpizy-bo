import './ListItem.scss';
import { useNavigate } from "react-router";


const ListItem = ({postId, thumbnail, title, excerpt}) => {
    const navigate = useNavigate();

    const handleModify = () => {
        navigate(`/post/${postId}`);
    };

    return (
        <article id='listItem'>
            <img src={thumbnail} alt=""/>
            <div>
                <h3>{title}</h3>
                <p>{excerpt}</p>
            </div>
            <div className={'button-nav'}>
                <button onClick={() => handleModify()}>Modifier</button>
                <button>Supprimer</button>
            </div>
        </article>
    );
};

export default ListItem;