import React, { useState, useEffect } from "react";
import PlayerButton from "../../components/PlayerButton";
import { fetchPlayers } from "../../helpers/fetchPlayers";

function Game() {
	const [teamOnePlayersRoster, setTeamOnePlayersRoster] = useState([]);
	const [teamTwoPlayersRoster, setTeamTwoPlayersRoster] = useState([]);
	const [teamOnePlayersSelected, setTeamOnePlayersSelected] = useState({});
	const [teamTwoPlayersSelected, setTeamTwoPlayersSelected] = useState({});
	const [teamOneScore, setTeamOneScore] = useState(0);
	const [teamTwoScore, setTeamTwoScore] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const players = await fetchPlayers();
				setTeamOnePlayersRoster(players);
				setTeamTwoPlayersRoster(players);
				setIsLoading(false);
			} catch (error) {
				setError(error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const updatePlayersGameScore = async (e) => {
		e.preventDefault();

		console.log(teamOnePlayersSelected);
		console.log(teamTwoPlayersSelected);

		try {
			var response

			if(teamOneScore > teamTwoScore) {
				response = await fetch(baseURL, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						winningTeamPlayers: teamOnePlayersSelected,
						losingTeamPlayers: teamTwoPlayersSelected
					}),
				});

				console.log(response);
			} else {
				response = await fetch(baseURL, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						winningTeamPlayers: teamTwoPlayersSelected,
						losingTeamPlayers: teamOnePlayersSelected
					}),
				});
				console.log(response);
			}

			if (response.ok) {
				setTeamOnePlayersSelected({});
				setTeamTwoPlayersSelected({});
				setTeamOneScore(0);
				setTeamTwoScore(0);
			} else {
				console.log("Failed to update players game data.");
			}
		} catch (error) {
			console.log(error);
			setError(error);
		}
	}

	return (
		<div>
			<h1>Game</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p>{error}</p>
			) : (
				<div>
					<div className="row">
						<div className="row-child">
							<ul>
								<li>
									<h2>Team One</h2>
								</li>
								{teamOnePlayersRoster.map((player) => (
									<li key={player._id}>
										<PlayerButton
											player={player}
											onPlayerButtonClick={(
												player,
												buttonSelected
											) => {
												if (buttonSelected) {
													teamOnePlayersSelected[
														player._id
													] = player;
												} else {
													delete teamOnePlayersSelected[
														player._id
													];
												}
												console.log(
													teamOnePlayersSelected
												);
											}}
										/>
									</li>
								))}
							</ul>
						</div>
						<div className="row-child">VS</div>
						<div className="row-child">
							<ul>
								<li>
									<h2>Team Two</h2>
								</li>
								{teamTwoPlayersRoster.map((player) => (
									<li key={player._id}>
										<PlayerButton
											player={player}
											onPlayerButtonClick={(
												player,
												buttonSelected
											) => {
												if (buttonSelected) {
													teamTwoPlayersSelected[
														player._id
													] = player;
												} else {
													delete teamTwoPlayersSelected[
														player._id
													];
												}
												console.log(
													teamTwoPlayersSelected
												);
											}}
										/>
									</li>
								))}
							</ul>
						</div>
					</div>
					<form onSubmit={updatePlayersGameScore}>
						<div>
							<div className="row">
								<label>Team One Score</label>
								<input
									className="row-child"
									type="number"
									value={teamOneScore}
									onChange={(e) =>
										setTeamOneScore(e.target.value)
									}
								/>
								<label>Team Two Score</label>
								<input
									className="row-child"
									type="number"
									value={teamTwoScore}
									onChange={(e) =>
										setTeamTwoScore(e.target.value)
									}
								/>
							</div>
							<div className="row">
								<input
									className="row-child"
									type="submit"
									value={"Submit Game Score"}
								/>
							</div>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default Game;
