import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlayerCard from "../../components/PlayerCard";

function Players() {
	const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players`;
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	function compareStrings(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();

		return a < b ? -1 : a > b ? 1 : 0;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(baseURL);
				if (!response.ok) {
					throw new Error("Failed to fetch Volleyball Players data.");
				}

				const jsonData = await response.json();
				jsonData.sort(function (a, b) {
					return compareStrings(a.name, b.name);
				});

				setData(jsonData);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				setError("Error fetching data. Please try again later.");
				setIsLoading(false);
			}
		};

		fetchData();
	}, [baseURL]);

	return (
		<div>
			<span>
				<h1>Players</h1>

				<Link to="/create-player">+ Add Volleyball Player</Link>
			</span>

			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<ul>
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
