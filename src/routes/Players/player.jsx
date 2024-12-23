import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PlayerCard from "../../components/PlayerCard";

function Player() {
	const [data, setData] = useState([]);
	const urlSlug = useParams();
	const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players/${urlSlug.slug}`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(baseURL);

				if (!response.ok) {
					throw new Error("Failed to fetch player data.");
				}

				const jsonData = await response.json();
				setData(jsonData);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [baseURL]);

	return (
		<div>
			<h2>Player</h2>
			<div>
				<Link to="/players">Back</Link>
			</div>
			<PlayerCard {...data} showDetails={false}></PlayerCard>
			<div>
				<Link to={`/edit-player/${data._id}`}>Edit</Link>
			</div>
		</div>
	);
}

export default Player;
