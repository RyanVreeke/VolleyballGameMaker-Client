import React, { useState, useEffect } from "react";
import PlayerButton from "../../components/PlayerButton";
import { fetchPlayers } from "../../helpers/fetchPlayers";
import { delay } from "../../helpers/delay";

function Game() {
	const [teamOnePlayersRoster, setTeamOnePlayersRoster] = useState([]);
	const [teamTwoPlayersRoster, setTeamTwoPlayersRoster] = useState([]);
	const [teamOnePlayersSelected, setTeamOnePlayersSelected] = useState(
		new Map()
	);
	const [teamTwoPlayersSelected, setTeamTwoPlayersSelected] = useState(
		new Map()
	);
	const [teamOneScore, setTeamOneScore] = useState(0);
	const [teamTwoScore, setTeamTwoScore] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players`;

	const fetchData = async (hasDelay) => {
		try {
			setIsLoading(true);
			if (hasDelay) {
				await delay(1000);
				setSubmitted(false);
				setIsLoading(false);
			}
			const players = await fetchPlayers();
			setTeamOnePlayersRoster(players);
			setTeamTwoPlayersRoster(players);
			setIsLoading(false);
		} catch (error) {
			setError(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData(false);
	}, []);

	const updatePlayersGameScore = async (e) => {
		e.preventDefault();

		try {
			var response = null;

			if (teamOneScore > teamTwoScore) {
				console.log("Team one wins");
				response = await fetch(baseURL, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						winningTeamPlayers: Object.fromEntries(
							teamOnePlayersSelected
						),
						losingTeamPlayers: Object.fromEntries(
							teamTwoPlayersSelected
						),
						pointDifferential: teamOneScore - teamTwoScore,
					}),
				});
			} else if (teamOneScore < teamTwoScore) {
				console.log("Team two wins");
				response = await fetch(baseURL, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						winningTeamPlayers: Object.fromEntries(
							teamTwoPlayersSelected
						),
						losingTeamPlayers: Object.fromEntries(
							teamOnePlayersSelected
						),
						pointDifferential: teamTwoScore - teamOneScore,
					}),
				});
			}

			if (response.ok) {
				console.log("Updated players game score.");
				setTeamOnePlayersRoster([]);
				setTeamTwoPlayersRoster([]);
				setTeamOnePlayersSelected(new Map());
				setTeamTwoPlayersSelected(new Map());
				setTeamOneScore(0);
				setTeamTwoScore(0);
				setSubmitted(true);
				fetchData(true);
				console.log(teamOnePlayersSelected);
				console.log(teamTwoPlayersSelected);
			} else {
				console.log("Failed to update players game data.");
			}
		} catch (error) {
			console.log(error);
			setError(error);
		}
	};

	return (
		<div>
			<h1>Game</h1>
			{isLoading ? (
				<div>
					{!submitted ? (
						<div>
							<h2>Loading...</h2>
							<p>Sorry for the delay, should be ready shortly.</p>
						</div>
					) : (
						<div>
							<h2>Game submitted!</h2>
							<p>Reloading...</p>
						</div>
					)}
				</div>
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
												buttonSelected
											) => {
												if (buttonSelected) {
													const newMap =
														teamOnePlayersSelected.set(
															player._id,
															player
														);
													setTeamOnePlayersSelected(
														newMap
													);
												} else {
													const newMap =
														teamOnePlayersSelected.delete(
															player._id
														);
													setTeamOnePlayersSelected(
														newMap
															? teamOnePlayersSelected
															: new Map()
													);
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
						<div>VS</div>
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
												buttonSelected
											) => {
												if (buttonSelected) {
													const newMap =
														teamTwoPlayersSelected.set(
															player._id,
															player
														);
													setTeamTwoPlayersSelected(
														newMap
													);
												} else {
													const newMap =
														teamTwoPlayersSelected.delete(
															player._id
														);
													setTeamTwoPlayersSelected(
														newMap
															? teamTwoPlayersSelected
															: new Map()
													);
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
