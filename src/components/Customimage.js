export default  function Customimage({imgSrc,pt}){
    return(
        <div className="custom-image" style={{paddingTop :pt}}>
           <img src={imgSrc} />
        </div>
    )

}