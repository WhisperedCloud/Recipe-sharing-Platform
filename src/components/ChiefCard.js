import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook,faTwitter,faInstagram } from "@fortawesome/free-brands-svg-icons"
export default function ChiefCard({chief}){
    return(
        <div className="chief-card">
                <img src ={chief.img} alt=""></img>

            <div className="chief-card-info">
                <h3 className="chief-name-card">{chief.name}</h3>
                <p className="chief-recipe-count">Recipes:<b>{chief.recipesCount}</b></p>
                <p className="chief-cuisine">Cuisine:<b>{chief.cuisine}</b></p>
                <p className="chief-icons">
                    <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
                </p>
            </div>

        </div>
    )   
}