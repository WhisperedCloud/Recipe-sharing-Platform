import {FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link , useLocation} from "react-router-dom"

export default function Sidebar({links,close}){
    const location = useLocation()
    return(
        <div className="sidebar">
            { links.map(links => (
                <Link to={links.path}  className= {location.pathname === links.path ? " sidebar-link active" : "sidebar-link" }  key={links.name}>
                    <FontAwesomeIcon icon={links.icon} />
                    {links.name}
                    </Link>
            ))}
        </div>
    )
}