import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function AddRecipe() {
    const [chefs, setChefs] = useState([]);
    const [selectedChefEmail, setSelectedChefEmail] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Fetch chefs on load
    useEffect(() => {
        fetch(`${API_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                setChefs(data);
                if (data.length > 0) setSelectedChefEmail(data[0].email);
            })
            .catch(err => console.error("Error fetching chefs:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleGenerate = async () => {
        if (!aiPrompt) {
            setError("Please enter a prompt for Groq AI.");
            return;
        }
        
        setAiLoading(true);
        setError("");

        try {
            // Step 1: Login silently as the selected chef to get their JWT token
            const loginRes = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: selectedChefEmail, password: "password123" }) 
            });

            const loginData = await loginRes.json();
            
            if (!loginRes.ok) {
                throw new Error("Unable to authenticate chef. Did you run the seed script?");
            }

            const token = loginData.token;

            // Call generate endpoint
            const generateRes = await fetch(`${API_URL}/api/recipes/generate`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: aiPrompt })
            });

            if (!generateRes.ok) {
                const errData = await generateRes.json();
                throw new Error(errData.message || "Failed to generate recipe");
            }

            const data = await generateRes.json();
            
            // Populate form
            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                description: data.description || prev.description,
                ingredients: data.ingredients || prev.ingredients,
                instructions: data.instructions || prev.instructions,
                cookingTime: data.cookingTime ? data.cookingTime.toString() : prev.cookingTime,
            }));

            // Clear prompt
            setAiPrompt("");

        } catch (err) {
            setError(err.message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Step 1: Login silently as the selected chef to get their JWT token
            const loginRes = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: selectedChefEmail, password: "password123" }) 
            });

            const loginData = await loginRes.json();
            
            if (!loginRes.ok) {
                throw new Error("Unable to authenticate chef. Did you run the seed script?");
            }

            const token = loginData.token;

            // Step 2: Format data and create Recipe
            const formattedData = {
                ...formData,
                cookingTime: parseInt(formData.cookingTime),
                ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
                // Ultra-fast placeholder image service
                image: formData.image || `https://loremflickr.com/800/600/food,meal?random=${Math.random()}`
            };

            const recipeRes = await fetch(`${API_URL}/api/recipes`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formattedData)
            });

            if (!recipeRes.ok) {
                const errData = await recipeRes.json();
                throw new Error(errData.message || "Failed to create recipe");
            }

            // Success! Redirect to recipes page
            navigate("/recipes");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section" style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
            <div className="add-recipe-container">
                <h2 style={{ marginBottom: "1em", color: "var(--primary-color, #ff0056)" }}>Create a New Recipe</h2>
                
                {error && <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}

                <form onSubmit={handleSubmit} className="add-recipe-form">
                    
                    {/* AI Generation Section */}
                    <div className="ai-generation-box">
                        <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>✨ Generate with Groq AI</label>
                        <div className="ai-input-group">
                            <input 
                                type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                                style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none", width: "100%" }} 
                                placeholder="E.g., 'Vegan gluten-free brownies' or 'Spicy Mexican chicken'" 
                            />
                            <button 
                                type="button" 
                                onClick={handleGenerate}
                                disabled={aiLoading || !selectedChefEmail}
                                style={{
                                    padding: "10px 15px", background: "#333", color: "white", 
                                    border: "none", borderRadius: "5px", fontSize: "16px", cursor: (aiLoading || !selectedChefEmail) ? "not-allowed" : "pointer",
                                    opacity: (aiLoading || !selectedChefEmail) ? 0.7 : 1
                                }}
                            >
                                {aiLoading ? "Generating..." : "Generate"}
                            </button>
                        </div>
                        <small style={{ color: "#666", marginTop: "5px", display: "inline-block" }}>
                            Describe a recipe and AI will auto-fill the form fields below.
                        </small>
                    </div>
                    
                    <div className="form-group">
                        <label>Choose the Author (Chef)</label>
                        <select 
                            value={selectedChefEmail} 
                            onChange={(e) => setSelectedChefEmail(e.target.value)}
                        >
                            {chefs.map(chef => (
                                <option key={chef.id} value={chef.email}>{chef.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Recipe Title</label>
                        <input 
                            name="title" value={formData.title} onChange={handleChange} required
                            placeholder="E.g., Spicy Garlic Pasta" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Brief Description</label>
                        <textarea 
                            name="description" value={formData.description} onChange={handleChange} required
                            style={{ minHeight: "80px" }} 
                            placeholder="Briefly describe the recipe..." 
                        />
                    </div>

                    <div className="form-group">
                        <label>Ingredients</label>
                        <input 
                            name="ingredients" value={formData.ingredients} onChange={handleChange} required
                            placeholder="Comma separated (e.g. Pasta, Garlic, Olive Oil)" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Cooking Instructions</label>
                        <textarea 
                            name="instructions" value={formData.instructions} onChange={handleChange} required
                            style={{ minHeight: "120px" }} 
                            placeholder="Step 1... Step 2..." 
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Cooking Time (mins)</label>
                            <input 
                                type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required min="1"
                                placeholder="30" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL (optional)</label>
                            <input 
                                type="text" name="image" value={formData.image} onChange={handleChange}
                                placeholder="/images/..." 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            marginTop: "10px", padding: "12px", background: "var(--primary-color, #ff0056)", 
                            color: "white", border: "none", borderRadius: "5px", fontSize: "16px", 
                            fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1, transition: "0.2s"
                        }}
                    >
                        {loading ? "Creating..." : "Add Recipe"}
                    </button>

                </form>
            </div>
        </div>
    )
}
