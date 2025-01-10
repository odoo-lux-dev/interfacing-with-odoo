import type { FC } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

interface INavLinkButtonProps {
	endpoint: string;
	label: string;
}

const NavLinkButton: FC<INavLinkButtonProps> = ({ endpoint, label }) => {
	return (
		<NavLink to={endpoint}>
			{({ isActive }) => {
				return (
					<Button variant={isActive ? "default" : "outline"}>{label}</Button>
				);
			}}
		</NavLink>
	);
};

export default NavLinkButton;
