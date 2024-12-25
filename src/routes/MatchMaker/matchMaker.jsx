import React, { useState, useEffect } from "react";
import PlayerCard from "../../components/PlayerCard";
import PlayerButton from "../../components/PlayerButton";
import { fetchPlayers } from "../../helpers/fetchPlayers";
import { delay } from "../../helpers/delay";

function MatchMaker() {
	const [playersParticipating, setPlayersParticipating] = useState([]);
	const [playersParticipatingSelected, setPlayersParticipatingSelected] =
		useState(new Map());
	const [teamOnePlayerSize, setTeamOnePlayerSize] = useState(0);
	const [teamTwoPlayerSize, setTeamTwoPlayerSize] = useState(0);
	const [calculatedTeamOnePlayers, setCalculatedTeamOnePlayers] = useState(
		[]
	);
	const [calculatedTeamTwoPlayers, setCalculatedTeamTwoPlayers] = useState(
		[]
	);
	const [calculatedTeamOneRating, setCalculatedTeamOneRating] = useState(0.0);
	const [calculatedTeamTwoRating, setCalculatedTeamTwoRating] = useState(0.0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [teamSizeError, setTeamSizeError] = useState(false);
	const [calculated, setCalculated] = useState(false);

	// Step 1: Calculate Player Rating
	function calculateRating(wins, losses, pointDifferential) {
		if (wins + losses === 0) return 0; // Avoid division by zero
		const winRate = wins / (wins + losses);
		const avgPointDifferential = pointDifferential / (wins + losses);
		return winRate * 1 + (avgPointDifferential / 100) * 1.2;
	}

	// Step 2: Pair Players into Teams (Balancing Ratings and Handling Uneven Sizes and Team Ratings)
	const pairTeams = (e) => {
		e.preventDefault();

		setTeamSizeError(false);

		const players = playersParticipatingSelected;
		const teamOneSize = Number(teamOnePlayerSize);
		const teamTwoSize = Number(teamTwoPlayerSize);

		// Calculate ratings for all players
		players.forEach((player) => {
			player["rating"] = calculateRating(
				player.wins,
				player.losses,
				player.pointDifferential
			);
		});

		// Sort players by rating in descending order
		const sortedPlayers = Array.from(players).sort(
			([, a], [, b]) => b.rating - a.rating
		);

		// Initialize teams and their total ratings
		const teamOne = [];
		const teamTwo = [];
		let teamOneRating = 0.0;
		let teamTwoRating = 0.0;

		// Weighted priority for smaller team
		const smallerTeamPriority = Math.min(teamOneSize, teamTwoSize);

		/**
		 * Helper function to calculate the weighted score of a team.
		 * A smaller team gets a higher priority for stronger players.
		 */
		const calculateTeamScore = (
			team,
			currentRating,
			size,
			playerRating
		) => {
			const adjustedSize = team.length + 1; // Adding the player
			const newRating = currentRating + playerRating;
			const averageRating = newRating / adjustedSize;

			// Prioritize smaller teams by boosting their average rating
			const weight = size === smallerTeamPriority ? 1.2 : 1.0;
			return averageRating * weight;
		};

		/**
		 * Helper function to evaluate the impact of assigning a player to a team.
		 */
		const evaluateTeamAssignment = (
			team,
			currentRating,
			size,
			playerIndex
		) => {
			if (team.length >= size) return -Infinity; // Team is full, very low score

			const playerRating = sortedPlayers[playerIndex]?.[1]?.rating || 0;
			return calculateTeamScore(team, currentRating, size, playerRating);
		};

		// Distribute players while considering team sizes and ratings
		for (let i = 0; i < sortedPlayers.length; i++) {
			const player = sortedPlayers[i];
			const playerRating = player[1].rating;

			const scoreTeamOne = evaluateTeamAssignment(
				teamOne,
				teamOneRating,
				teamOneSize,
				i
			);
			const scoreTeamTwo = evaluateTeamAssignment(
				teamTwo,
				teamTwoRating,
				teamTwoSize,
				i
			);

			// Assign the player to the team with the higher score
			if (scoreTeamOne >= scoreTeamTwo) {
				teamOne.push(player);
				teamOneRating += playerRating;
			} else {
				teamTwo.push(player);
				teamTwoRating += playerRating;
			}
		}

		// Update the state with the new teams and ratings
		setCalculatedTeamOnePlayers(teamOne);
		setCalculatedTeamTwoPlayers(teamTwo);
		setCalculatedTeamOneRating(teamOneRating);
		setCalculatedTeamTwoRating(teamTwoRating);
		setCalculated(true);
	};

	const toggleTeamSizeError = (e) => {
		e.preventDefault();

		setTeamSizeError(true);
	};

	const fetchData = async () => {
		try {
			setIsLoading(true);
			setCalculated(false);
			setPlayersParticipatingSelected(new Map());
			setTeamOnePlayerSize(0);
			setTeamTwoPlayerSize(0);
			setCalculatedTeamOnePlayers([]);
			setCalculatedTeamTwoPlayers([]);
			setCalculatedTeamOneRating(0.0);
			setCalculatedTeamTwoRating(0.0);

			const players = await fetchPlayers();
			setPlayersParticipating(players);
			setIsLoading(false);
		} catch (error) {
			setError(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<h1>Match Maker</h1>
			{isLoading ? (
				<div>
					<h2>Loading...</h2>
				</div>
			) : error ? (
				<p>{error}</p>
			) : calculated ? (
				<div>
					<button className="button-reset" onClick={fetchData}>
						Reset calculated teams.
					</button>
					<div className="row">
						<div className="row-child">
							<ul>
								{calculatedTeamOnePlayers.map((player) => (
									<li key={player[1]._id}>
										<PlayerCard
											{...player[1]}
											showDetails={false}
										/>
									</li>
								))}
								<li>
									Team One Rating: {calculatedTeamOneRating}
								</li>
							</ul>
						</div>
						<div>VS</div>
						<div className="row-child">
							<ul>
								{calculatedTeamTwoPlayers.map((player) => (
									<li key={player[1]._id}>
										<PlayerCard
											{...player[1]}
											showDetails={false}
										/>
									</li>
								))}
								<li>
									Team Two Rating: {calculatedTeamTwoRating}
								</li>
							</ul>
						</div>
					</div>
				</div>
			) : (
				<div>
					<div>
						<div className="row">
							<div className="row-child">
								<ul>
									<li>
										<h2>Participating Players</h2>
										<p>
											Select all players that are
											participating in the game.
										</p>
									</li>
									{playersParticipating.map((player) => (
										<li key={player._id}>
											<PlayerButton
												player={player}
												onPlayerButtonClick={(
													buttonSelected
												) => {
													if (buttonSelected) {
														const newMap =
															playersParticipatingSelected.set(
																player._id,
																player
															);
														setPlayersParticipatingSelected(
															newMap
														);
													} else {
														const newMap =
															playersParticipatingSelected.delete(
																player._id
															);
														setPlayersParticipatingSelected(
															newMap
																? playersParticipatingSelected
																: new Map()
														);
													}
													console.log(
														playersParticipatingSelected
													);
												}}
											/>
										</li>
									))}
								</ul>
							</div>
						</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const teamSizes =
									Number(teamOnePlayerSize) +
									Number(teamTwoPlayerSize);
								if (
									teamSizes ==
										playersParticipatingSelected.size &&
									teamSizes != 0 &&
									playersParticipatingSelected.size != 0
								) {
									pairTeams(e);
								} else {
									toggleTeamSizeError(e);
								}
							}}
						>
							<div>
								<div className="row">
									<label className="row-child">
										Select Team One Player Size
									</label>
									<input
										className="row-child"
										type="number"
										value={teamOnePlayerSize}
										onChange={(e) =>
											setTeamOnePlayerSize(e.target.value)
										}
									/>
									<label className="row-child">
										Select Team Two Player Size
									</label>
									<input
										className="row-child"
										type="number"
										value={teamTwoPlayerSize}
										onChange={(e) =>
											setTeamTwoPlayerSize(e.target.value)
										}
									/>
								</div>
								{teamSizeError && (
									<div>
										<h3>
											Allotted player amount is not
											correct.
										</h3>
									</div>
								)}
								<div className="row">
									<input
										className="row-child"
										type="submit"
										value={"Calculate teams"}
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default MatchMaker;
