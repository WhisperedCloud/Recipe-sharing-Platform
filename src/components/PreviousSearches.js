import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export default function PreviousSearches({ searchQuery, setSearchQuery }){
    const searches = ['pizza','burger','lasaniya','milkshake','pasta','brownie','fish','biryani','malai tikka']
    
    return(
        <div className="previous-searches section">
            <h2>Search Recipes</h2>
            <div className="previous-searches-container">
                {searches.map((search, index) => (
                    <div 
                        key={index}  
                        style={{
                            animationDelay: index * .1 + "s", 
                            cursor: "pointer", 
                            // Add a subtle opacity effect if selected
                            opacity: searchQuery.toLowerCase() === search ? 1 : 0.8 
                        }}  
                        className="search-item"
                        onClick={() => setSearchQuery(search)}
                    >
                        {search}
                    </div>
                ))}
            </div>
            <div className="search-box">
                <input 
                    type="text" 
                    placeholder="Search by title or ingredient..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn"> 
                    <FontAwesomeIcon icon={faSearch}/>
                </button>
            </div>
        </div>
    )
}