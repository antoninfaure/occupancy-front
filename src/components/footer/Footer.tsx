import githublogo from "../../github-mark-white.png";
import "./footer.scss";

const Footer = () => {
    return (
        <div className="footer">
            <span>made by Antonin Faure</span>
            <span>
                <a target="_blank" href="https://github.com/antoninfaure/occupancy-epfl" rel="noopener noreferrer">
                    <img src={githublogo} alt="github" width="30"
                        height="30" />
                </a>
            </span>
        </div>
    );
}

export default Footer;