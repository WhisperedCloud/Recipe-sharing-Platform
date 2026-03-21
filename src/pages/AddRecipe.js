import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    // Fetch chefs on load
    useEffect(() => {
        fetch("http://localhost:5001/api/users")
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Step 1: Login silently as the selected chef to get their JWT token
            const loginRes = await fetch("http://localhost:5001/api/auth/login", {
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
                // use a placeholder image if none provided
                image: formData.image || "/images/gallery/img_4 11.30.22 AM.jpg" 
            };

            const recipeRes = await fetch("http://localhost:5001/api/recipes", {
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
            <div style={{
                background: "#fff", padding: "2em", borderRadius: "10px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)", width: "100%", maxWidth: "600px"
            }}>
                <h2 style={{ marginBottom: "1em", color: "var(--primary-color, #ff0056)" }}>Create a New Recipe</h2>
                
                {error && <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Choose the Author (Chef)</label>
                        <select 
                            value={selectedChefEmail} 
                            onChange={(e) => setSelectedChefEmail(e.target.value)}
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
                        >
                            {chefs.map(chef => (
                                <option key={chef.id} value={chef.email}>{chef.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Recipe Title</label>
                        <input 
                            name="title" value={formData.title} onChange={handleChange} required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }} 
                            placeholder="E.g., Spicy Garlic Pasta" 
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Brief Description</label>
                        <textarea 
                            name="description" value={formData.description} onChange={handleChange} required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none", minHeight: "80px" }} 
                            placeholder="Briefly describe the recipe..." 
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Ingredients</label>
                        <input 
                            name="ingredients" value={formData.ingredients} onChange={handleChange} required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }} 
                            placeholder="Comma separated (e.g. Pasta, Garlic, Olive Oil)" 
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Cooking Instructions</label>
                        <textarea 
                            name="instructions" value={formData.instructions} onChange={handleChange} required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none", minHeight: "120px" }} 
                            placeholder="Step 1... Step 2..." 
                        />
                    </div>

                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Cooking Time (mins)</label>
                            <input 
                                type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required min="1"
                                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }} 
                                placeholder="30" 
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Image URL (optional)</label>
                            <input 
                                type="text" name="image" value={formData.image} onChange={handleChange}
                                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }} 
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
