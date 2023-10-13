import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelServices';
import './charInfo.scss';

import setContent from '../../utils/setContent';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    
    const {getCharacter, clearError, process, setProcess} = useMarvelService();


    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed')) // We set the state of the process as confiemed due to the end of the process, so when charListloaded finished, we set the process as confirmed

    }

    const onCharListLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homapage, wiki, comics } = data;

    const isComics = comics.length === 0 ? "This here has never been seen in comics" : null;

    let imgStyle = {'objectFit': 'cover'};

    if (thumbnail.substring(44) === 'image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'};
    }

    return (
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homapage} className="button button__main">
                        <div className="inner">Homapage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
            {   
                comics.map((item, i) => {
                    if (i < 9 && i >= 0) {
                        const itemId = item.resourceURI.slice(43);
                        return (
                            <Link to={`/comics/${itemId}`} className="char__comics-item" key={i}>
                                {item.name}
                            </Link>
                        )
                    }
                })
            }
            {isComics}
        </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;