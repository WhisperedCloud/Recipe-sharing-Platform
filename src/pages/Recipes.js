import PreviousSearches from "../components/PreviousSearches"
import RecipeCard from "../components/RecipeCard"
export default function Recipes(){
    const recipes = [
        {
            title:"Chicken Pizza",
            image:"/images/gallery/img_1 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_1 (1).jpg",
        },
        {
            title:"Chicken Pizza",
            image:"/images/gallery/img_1 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_1 (1).jpg",
        },
        {
            title:"Korean Rice Bowl",
            image:"/images/gallery/img_2 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_2 (1).jpg",
        },
        {
            title:"Chinese Platter",
            image:"/images/gallery/img_3 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_3 (1).jpg",
        },
        {
            title:"Noodles",
            image:"/images/gallery/img_4 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_4 (1).jpg",
        },
        {
            title:"Burger",
            image:"/images/gallery/img_5 11.30.22 AM.jpg",
            authorImg:"images/gallery/top-chiefs/img_5 (1).jpg",
        },
        {
            title:"Mutton Biryani",
            image:"/images/gallery/img_6 11.30.22 AM.jpg",
            authorImg:"/images/gallery/top-chiefs/photo.jpeg",
        },
        {
            title:"Tandoori Chicken",
            image:"/images/gallery/img_7 11.30.23 AM.jpg",
            authorImg:"/images/gallery/top-chiefs/img_6 (1).jpg",
        }
    ].sort(() => Math.random() - 0.5)

    return(
        <div>
            <PreviousSearches/> 
            <div className="recipes-container">
                {/* <RecipeCard/> */}
                {recipes.map((recipe,index) => (
                    <RecipeCard key={index} recipe = {recipe} />   
                ))}
               
            </div>
        </div>
    )
} 