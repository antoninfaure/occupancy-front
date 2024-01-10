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
import React from "react"
import { cn } from "@/lib/utils"


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

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink
                ref={ref}
                className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    className
                )}
            >
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {children}
                </p>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const Header = () => {

    return (
        <div className="flex justify-between p-4 gap-4">
            <Link to="/" rel="noopener noreferrer" className="px-2">
                <h1 className="text-2xl font-bold">Occupancy FLEP</h1>
            </Link>
            <div className="flex gap-4">
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-2">
                        {MENU.map((component) => (
                            <NavigationMenuItem key={component.title}>
                                <Link to={component.href} rel="noopener noreferrer">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {component.title}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu className="flex lg:hidden">
                    <NavigationMenuList className="gap-2">
                        <NavigationMenuItem >
                            <NavigationMenuTrigger>
                                Menu
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="w-32">
                                <ul>
                                    {MENU.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
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