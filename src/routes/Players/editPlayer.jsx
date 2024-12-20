import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditPlayer() {
	const [playerId, setPlayerId] = useState("");
	const [name, setName] = useState("");
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
				}),
			});

			if (response.ok) {
				setName("");
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

							<input type="submit" />
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
