import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PreviousSearches from "../components/PreviousSearches"
import RecipeCard from "../components/RecipeCard"
import Pagination from "../components/Pagination"

export default function Recipes(){
    const [recipes, setRecipes] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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

    const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
    const paginatedRecipes = filteredRecipes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleGenerateAndSave = async () => {
        if (!searchQuery) return;
        setAiLoading(true);
        setAiError("");

        try {
            // Fetch chefs to get a valid email for autologin
            const usersRes = await fetch("http://localhost:5001/api/users");
            const users = await usersRes.json();
            if (users.length === 0) throw new Error("No users found to author the recipe.");
            const authorEmail = users[0].email;

            // Step 1: Login silently
            const loginRes = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authorEmail, password: "password123" }) 
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error("Authentication failed. Did you seed the DB?");
            const token = loginData.token;

            // Step 2: Generate Recipe via AI
            const generateRes = await fetch("http://localhost:5001/api/recipes/generate", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: searchQuery })
            });

            if (!generateRes.ok) throw new Error("Failed to generate recipe from Groq AI.");
            const aiData = await generateRes.json();

            // Step 3: Format and Save Recipe
            const formattedData = {
                title: aiData.title || searchQuery,
                description: aiData.description || "A delicious AI generated recipe.",
                ingredients: typeof aiData.ingredients === 'string' 
                                ? aiData.ingredients.split(',').map(i => i.trim()).filter(i => i)
                                : (aiData.ingredients || []),
                instructions: aiData.instructions || "Just cook it!",
                cookingTime: parseInt(aiData.cookingTime) || 30,
                // Ultra-fast placeholder image service
                image: `https://loremflickr.com/800/600/food,meal?random=${Math.random()}`
            };

            const saveRes = await fetch("http://localhost:5001/api/recipes", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formattedData)
            });

            if (!saveRes.ok) throw new Error("Failed to save recipe to database.");
            const newRecipe = await saveRes.json();

            // Step 4: Navigate to new Recipe Details
            navigate(`/recipe/${newRecipe.id}`);

        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    return(
        <div>
            <PreviousSearches searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> 
            <div className="recipes-container">
                {paginatedRecipes.length > 0 ? paginatedRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id || index} recipe={recipe} />   
                )) : (
                    <div style={{ textAlign: "center", width: "100%", padding: "40px 20px" }}>
                        <p style={{ fontSize: "1.2em", color: "#555", marginBottom: "15px" }}>
                            No recipes found for "<b>{searchQuery}</b>".
                        </p>
                        {aiError && <p style={{ color: "red", marginBottom: "15px" }}>{aiError}</p>}
                        <button 
                            onClick={handleGenerateAndSave}
                            disabled={aiLoading}
                            style={{
                                padding: "12px 24px",
                                background: "var(--primary-color, #ff0056)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                cursor: aiLoading ? "wait" : "pointer",
                                opacity: aiLoading ? 0.7 : 1,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                fontWeight: "bold"
                            }}
                        >
                            {aiLoading ? "✨ Generating and saving... (please wait)" : `✨ Generate recipe for '${searchQuery}' with Groq AI`}
                        </button>
                    </div>
                )}
            </div>
            
            {filteredRecipes.length > 0 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}
        </div>
    )
} 