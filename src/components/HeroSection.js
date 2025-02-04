import Customimage from "./Customimage"
export default function HeroSection(){
    const images =[ 
        "/images/gallery/img_1 11.30.22 AM.jpg",
        "/images/gallery/img_2 11.30.22 AM.jpg",
        "/images/gallery/img_3 11.30.22 AM.jpg",
        "/images/gallery/img_4 11.30.22 AM.jpg",
        "/images/gallery/img_5 11.30.22 AM.jpg",
        "/images/gallery/img_6 11.30.22 AM.jpg",
        "/images/gallery/img_7 11.30.23 AM.jpg",
        "/images/gallery/img_8 11.30.23 AM.jpg",
        "/images/gallery/img_9 11.30.23 AM.jpg",
    ]

    return(
        <div className="section hero">
            <div className="col typography">
                <h1 className="title">What Are We About</h1>  
                <p className="info"> Discover a world of flavors crafted with fresh, locally sourced ingredients. From hearty meals to sweet indulgences, our menu is designed to delight every craving.</p>
                <button className="btn"> Explore Now</button>
            </div>
            <div className="col gallery">
                {images.map((src,index) => (
                    <Customimage key ={index} imgSrc={src} pt={"90%"}/>
                ))}
                

            </div>
        </div>
    )
}