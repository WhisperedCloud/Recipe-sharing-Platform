import Customimage from "./Customimage"
import { Link } from "react-router-dom"

export default function RecipeCard({recipe}){
    return(
        <div className="recipe-card">
            <Customimage imgSrc= {recipe.image} pt="65%"/>
            <div className="recipe-card-info">
                <img className="auther-img" src={recipe.authorImg} alt="recipe"/>
                <p className="recipe-title"> {recipe.title}</p>
                <p className="recipe-desc">{recipe.description || "Lorem text for just explaining the recipe"}</p>
                <Link className="view-btn" to={`/recipe/${recipe.id}`}>VIEW RECIPE</Link>
            </div>
        </div>
    )
}