import { GitHubLogoIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="flex flex-col items-center justify-center gap-1 p-4">
            <span className="flex items-center gap-1 font-semibold">made with <HeartFilledIcon className="text-red-500" /> by <Link
                target="_blank" to='https://github.com/antoninfaure' rel="noopener noreferrer" className="text-primary underline hover:decoration-red-500 hover:text-red-500">
                Antonin Faure
            </Link>
            </span>
            <span className="flex items-center justify-center flex-col gap-2">
                <span className="flex text-primary text-xs gap-1 items-center">don't hesitate to
                    <Link target="_blank" to="https://github.com/antoninfaure/occupancy-epfl" rel="noopener noreferrer" className="underline hover:decoration-red-500 hover:text-red-500">
                        star and/or contribute
                    </Link>
                </span>
                <Link target="_blank" to="https://github.com/antoninfaure/occupancy-epfl" rel="noopener noreferrer">
                    <GitHubLogoIcon className="w-6 h-6 inline-block hover:text-accent-foreground/50" />
                </Link>

            </span>
        </footer>
    );
}

export default Footer;