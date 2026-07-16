import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        // Fetch the full recipe by its ID
        fetch(`http://localhost:5001/api/recipes/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setRecipe(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <h2 style={{textAlign: "center", padding: "50px"}}>Loading Recipe details...</h2>;
    if (!recipe) return <h2 style={{textAlign: "center", padding: "50px"}}>Recipe Not Found</h2>;

    return (
        <div className="recipe-details-container">
            <Link to="/recipes" className="view-btn" style={{ marginBottom: "20px", display: "inline-block", textDecoration: "none" }}>&larr; Back to Recipes</Link>
            
            <div className="recipe-image-container">
                {!imageLoaded && (
                    <div className="skeleton-loader">
                        <span>✨ Generating stunning AI image...</span>
                    </div>
                )}
                <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    onLoad={() => setImageLoaded(true)}
                    style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.5s ease-in-out" }} 
                />
            </div>
            
            <h1>{recipe.title}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "15px 0" }}>
                <img 
                    src={recipe.User?.authorImg || "/images/gallery/top-chiefs/photo.jpeg"} 
                    alt="chef" 
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
                />
                <p><b>{recipe.User?.name || "Unknown Chef"}</b> &nbsp;&nbsp;•&nbsp;&nbsp; ⏱️ <b>{recipe.cookingTime} mins</b></p>
            </div>
            
            <p style={{ fontSize: "1.1em", lineHeight: "1.6", color: "var(--text-light, #777)" }}>{recipe.description}</p>
            
            <div style={{ marginTop: "30px" }}>
                <h2>Ingredients</h2>
                <ul style={{ paddingLeft: "20px", marginTop: "10px", lineHeight: "1.8", fontSize: "1.05em" }}>
                    {recipe.ingredients && recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                    ))}
                </ul>
            </div>
            
            <div style={{ marginTop: "30px", marginBottom: "50px" }}>
                <h2>Instructions</h2>
                <p style={{ marginTop: "10px", fontSize: "1.05em", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                    {recipe.instructions}
                </p>
            </div>
        </div>
    );
}
