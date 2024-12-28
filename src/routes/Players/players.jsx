import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlayerCard from "../../components/PlayerCard";
import { fetchPlayers } from "../../helpers/fetchPlayers";

function Players() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const players = await fetchPlayers();
				setData(players);
				setIsLoading(false);
			} catch (error) {
				setError(error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<span>
				<h1>Players</h1>
				<Link to="/create-player">+ Add Volleyball Player</Link>
			</span>

			{ isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<ul className="grid-list-large">
					{data.map((player) => (
						<li key={player._id}>
							<PlayerCard {...player} showDetails={true} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default Players;
