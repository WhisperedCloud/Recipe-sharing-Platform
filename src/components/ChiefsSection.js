import ChiefCard from "./ChiefCard"
const chiefs =[
    {
        name:"Banvar Lal Sikendhar",
        img: "/images/gallery/top-chiefs/img_1 (1).jpg",
        recipesCount:"12",
        cuisine:"North Indian",
    },
    {
        name:"Benjamin",
        img: "/images/gallery/top-chiefs/img_2 (1).jpg",
        recipesCount:"18",
        cuisine:"Italian",
    },
    {
        name:"Manmoden",
        img: "/images/gallery/top-chiefs/img_3 (1).jpg",
        recipesCount:"16",
        cuisine:"Mexican",
    },
    {
        name:"Sundher Bhai",
        img: "/images/gallery/top-chiefs/img_4 (1).jpg",
        recipesCount:"8",
        cuisine:"South Indian",
    },
    {
        name:"Adhira",
        img: "/images/gallery/top-chiefs/img_5 (1).jpg",
        recipesCount:"12",
        cuisine:"Organic Foods",
    },
    {
        name:"Eswar",
        img: "/images/gallery/top-chiefs/photo.jpeg",
        recipesCount:"40",
        cuisine:"All cuisines",
    }
]
export default function ChiefsSection(){
    return(
        <div className="section chiefs">
             <h1 className="title">Our Top Chiefs</h1>
             <div className="top-chiefs-container">
                {chiefs.map (chiefs => < ChiefCard key={chiefs.name} chief={chiefs} />)}
             </div>
        </div>
    )
}