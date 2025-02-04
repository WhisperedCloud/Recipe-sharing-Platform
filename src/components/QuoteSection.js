import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons"
export default function QuoteSection(){
    return(
        <div className="section quote">
            <p className="quote-text"><FontAwesomeIcon icon={faQuoteLeft}/>Cooking is like love; it should be entered into with complete abandon or not at all. It’s not about perfection but passion, experimentation, and enjoying the process.</p>
            <p className="quote-author"> - Harriet Van Horne</p>
        </div>
    )
}