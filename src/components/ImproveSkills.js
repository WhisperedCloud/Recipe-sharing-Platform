export default function ImproveSkills(){
    const list=[
       "Learn new recipes",
       "Create own recipes",
       "Create a nutritional facts",
       "Calculate your calories",
       "Get a diet plan",
       "Get cooking tips",
       "Review your recipes"


    ]
    return(
        <div className="section improve-skills">
            <div className="col img">
               <img src="/images/gallery/img_10 11.30.23 AM.jpg"></img>
            </div>
            <div className="col typography">
                <h1 className="title">Improve your cooking skills</h1>  
                { list.map((item,index) => (
                    <p className="skill-item" key={index}> {item} </p>
                )) }
                <button className="btn"> SignUp Now</button>
            </div>
        </div>
    )
}