import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditPlayer() {
	const [playerId, setPlayerId] = useState("");
	const [name, setName] = useState("");
	const [wins, setWins] = useState(0);
	const [losses, setLosses] = useState(0);
	const [submitted, setSubmitted] = useState(false);
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
				setPlayerId(jsonData._id);
				setName(jsonData.name);
				setWins(jsonData.wins);
				setLosses(jsonData.losses);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [baseURL]);

	const navigate = useNavigate();

	const updatePlayer = async (e) => {
		e.preventDefault();
		console.log(playerId);
		console.log(name);

		try {
			const response = await fetch(baseURL, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name,
					wins: wins,
					losses: losses,
				}),
			});

			if (response.ok) {
				setName("");
				setWins(0);
				setLosses(0);
				setSubmitted(true);
			} else {
				console.log("Failed to submit player data.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const deletePlayer = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(baseURL, {
				method: "DELETE",
			});

			if (response.ok) {
				navigate("/players");
				console.log("Player removed.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<h1>Edit Player</h1>
			<Link to={`/players/${playerId}`}>Back</Link>
			<div>
				<br />
			</div>

			{submitted ? (
				<p>Player updated successfully!</p>
			) : (
				<div>
					<form onSubmit={updatePlayer}>
						<div>
							<label>Player Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<div>
								<h3>
									Edit the wins and losses values only if a
									mistake was made when logging games.
								</h3>
							</div>
							<div>
								<label>Player Wins</label>
								<input
									type="number"
									value={wins}
									onChange={(e) => setWins(e.target.value)}
								/>
							</div>
							<div>
								<label>Player Losses</label>
								<input
									type="number"
									value={losses}
									onChange={(e) => setLosses(e.target.value)}
								/>
							</div>
							<div>
								<input type="submit" />
							</div>
						</div>
					</form>
					<br />
					<button onClick={deletePlayer} className="delete">
						Delete Player
					</button>
				</div>
			)}
		</div>
	);
}

export default EditPlayer;
