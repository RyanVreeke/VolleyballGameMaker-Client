import React, { useState } from "react";
import { Link } from "react-router-dom";

function CreatePlayer() {
  const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players`;
	const [name, setName] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const createPlayer = async (e) => {
		e.preventDefault();
		console.log(name);

		try {
			const response = await fetch(baseURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name,
					wins: 0,
					losses: 0,
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

	return (
		<div>
			<h1>Create Player</h1>
			<Link to="/players">Back</Link>
			<div>
				<br></br>
			</div>
			{submitted ? (
				<p>Player submitted successfully!</p>
			) : (
				<form onSubmit={createPlayer}>
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
			)}
		</div>
	);
}

export default CreatePlayer;
