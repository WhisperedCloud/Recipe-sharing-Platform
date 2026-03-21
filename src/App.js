import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import { useEffect } from "react";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import Settings from "./pages/Settings";

function App() {
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if(savedSettings) {
      const settings = JSON.parse(savedSettings);
      const root = document.documentElement;
      for(let key in settings){
        root.style.setProperty(key, settings[key]);
      }
    }
  }, []);

  return (
    <Router>
       <Navbar />
     <div className="container main">
          <Routes>
            <Route path = "/" element ={ <Home />} />
            <Route path = "/recipes" element ={ <Recipes />} />
            <Route path = "/recipe/:id" element ={ <RecipeDetails />} />
            <Route path = "/add-recipe" element ={ <AddRecipe />} />
            <Route path = "/settings" element ={ <Settings />} />
          </Routes>
     </div>
     <Footer/> 
    </Router>
  )
}

export default App;
