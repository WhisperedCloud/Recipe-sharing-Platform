import { useState, useEffect } from "react"
import PreviousSearches from "../components/PreviousSearches"
import RecipeCard from "../components/RecipeCard"

export default function Recipes(){
    const [recipes, setRecipes] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetch("http://localhost:5001/api/recipes")
            .then(res => res.json())
            .then(data => {
                const formattedRecipes = data.map(r => ({
                    ...r,
                    authorImg: r.User?.authorImg || "/images/gallery/top-chiefs/photo.jpeg"
                }));
                // We shuffle it to mimic the old static behavior if you like, or just display directly
                setRecipes(formattedRecipes.sort(() => Math.random() - 0.5));
            })
            .catch(err => console.error(err));
    }, []);

    // Filter by title, ingredients, description, or author name
    const filteredRecipes = recipes.filter(r => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title?.toLowerCase().includes(query);
        const matchesDescription = r.description?.toLowerCase().includes(query);
        const matchesAuthor = r.User?.name?.toLowerCase().includes(query);
        const matchesIngredient = r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(query));
        
        return matchesTitle || matchesIngredient || matchesDescription || matchesAuthor;
    });

    return(
        <div>
            <PreviousSearches searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> 
            <div className="recipes-container">
                {filteredRecipes.length > 0 ? filteredRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id || index} recipe={recipe} />   
                )) : <p style={{textAlign: "center", width: "100%", padding: "20px"}}>No recipes match your search.</p>}
            </div>
        </div>
    )
} 