import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { ModeToggle } from "./theme/mode-toggle"
import { Badge } from "./ui/badge"


const MENU = [
    {
        title: "Rooms",
        href: "/rooms",
        description: "List of rooms",
    },
    {
        title: "Courses",
        href: "/courses",
        description: "List of courses",
    },
    {
        title: "Study Plans",
        href: "/studyplans",
        description: "List of study plans",
    },
]

const Header = () => {

    return (
        <div className="flex justify-between items-center p-4 gap-4">
            <Link to="/" rel="noopener noreferrer" className="px-2 flex items-start justify-start gap-1 mr-auto flex-wrap">
                <span className="flex text-2xl font-bold">Occupancy</span><div className="flex items-start gap-x-1"> <span className="flex text-2xl font-bold">FLEP</span> <Badge className="rounded-full bg-red-600 text-white text-xs hover:bg-red-600 py-[.12em] px-1.5">v2.0</Badge></div>
            </Link>
            <div className="flex gap-4">
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-2">
                        {MENU.map((component) => (
                            <NavigationMenuItem key={component.title}>
                                <Link to={component.href} rel="noopener noreferrer" className={navigationMenuTriggerStyle()}>
                                    {component.title}
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu className="flex lg:hidden">
                    <NavigationMenuList className="gap-2">
                        <NavigationMenuItem >
                            <NavigationMenuTrigger
                                onPointerMove={(event) => event.preventDefault()}
                                onPointerLeave={(event) => event.preventDefault()}
                            >
                                Menu
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="min-w-32">
                                <ul>
                                    {MENU.map((component, index) => (
                                        <li key={index}>
                                            <NavigationMenuLink
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                href={component.href}>

                                                <div className="text-sm font-medium leading-none">{component.title}</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    {component.description}
                                                </p>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <ModeToggle />
            </div>
        </div>
    )
}

export default Header