import Header from "../header/Header";
import Wall from '../wall/Wall.jsx';
import './Layout.css';

export default function Layout({name}) {
    console.log(name, "Nmae is heere")
    return (
        <div className="layout">
            <Header userName={name} />
            <Wall/>
        </div>
    )
}