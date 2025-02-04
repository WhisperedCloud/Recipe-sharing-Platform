import Customimage from "./Customimage"

export default function RecipeCard({recipe}){
    return(
        <div className="recipe-card">
            <Customimage imgSrc= {recipe.image} pt="65%"/>
            <div className="recipe-card-info">
                <img className="auther-img" src={recipe.authorImg}/>
                <p className="recipe-title"> {recipe.title}</p>
                <p className="recipe-desc">Lorem text for just explaining the recipe</p>
                <a className="view-btn" href="#1">VIEW RECIPE</a>

            </div>
        </div>
    )
}