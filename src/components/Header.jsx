import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/volleyball.png";

function Header() {
	return (
		<header>
			<div>
				<Link to="/" className="logo">
					<img src={logo} alt="Volleyball Game Maker" />
					<p>Volleyball Game Maker</p>
				</Link>
			</div>

			<nav>
				<NavLink to="/">Game</NavLink>
				<NavLink to="/players">Players</NavLink>
				<NavLink to="/match-maker">Match Maker</NavLink>
			</nav>
		</header>
	);
}

export default Header;
