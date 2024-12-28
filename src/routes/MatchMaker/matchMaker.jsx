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

	// Step 2: Pair Players into Teams (Advanced Balancing with Deeper Lookahead)
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

		/**
		 * Helper function to simulate assigning players to teams.
		 * Evaluates the impact on team ratings with recursive lookahead.
		 */
		const simulateTeamAssignment = (
			team,
			currentRating,
			size,
			opponentTeam,
			opponentRating,
			remainingPlayers,
			depth = 2
		) => {
			if (depth === 0 || remainingPlayers.length === 0) {
				// Base case: Return the absolute difference in team ratings
				return Math.abs(currentRating - opponentRating);
			}

			let bestScore = Infinity;

			// Simulate assigning each remaining player to the current team
			for (let i = 0; i < remainingPlayers.length; i++) {
				const player = remainingPlayers[i];
				const newTeamRating = currentRating + player[1].rating;
				const newOpponentTeam = [...opponentTeam];
				const newOpponentRating = opponentRating;

				// Remaining players excluding the current one
				const nextRemainingPlayers = remainingPlayers
					.slice(0, i)
					.concat(remainingPlayers.slice(i + 1));

				// Recursively simulate the next assignments
				const score = simulateTeamAssignment(
					team.concat(player),
					newTeamRating,
					size,
					newOpponentTeam,
					newOpponentRating,
					nextRemainingPlayers,
					depth - 1
				);

				// Track the best score (minimum difference)
				bestScore = Math.min(bestScore, score);
			}

			return bestScore;
		};

		/**
		 * Distribute players into teams while balancing ratings dynamically.
		 */
		const assignPlayerToTeam = (player, team, teamRating, maxSize) => {
			if (team.length >= maxSize) return Infinity; // Penalize full teams
			return teamRating + player[1].rating;
		};

		// Distribute players while considering team sizes and ratings
		for (let i = 0; i < sortedPlayers.length; i++) {
			const player = sortedPlayers[i];

			// Simulate assigning the player to each team and evaluate the impact
			const scoreTeamOne = simulateTeamAssignment(
				teamOne.concat(player),
				teamOneRating + player[1].rating,
				teamOneSize,
				teamTwo,
				teamTwoRating,
				sortedPlayers.slice(i + 1),
				2 // Lookahead depth
			);

			const scoreTeamTwo = simulateTeamAssignment(
				teamTwo.concat(player),
				teamTwoRating + player[1].rating,
				teamTwoSize,
				teamOne,
				teamOneRating,
				sortedPlayers.slice(i + 1),
				2 // Lookahead depth
			);

			// Assign the player to the team with the lower projected score
			if (scoreTeamOne <= scoreTeamTwo) {
				teamOne.push(player);
				teamOneRating += player[1].rating;
			} else {
				teamTwo.push(player);
				teamTwoRating += player[1].rating;
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
							<ul className="grid-list-large">
								{calculatedTeamOnePlayers.map((player) => (
									<li key={player[1]._id}>
										<PlayerCard
											{...player[1]}
											showDetails={false}
										/>
									</li>
								))}
								<li className="bold-text">
									Team One Rating: {calculatedTeamOneRating}
								</li>
							</ul>
						</div>
						<div>VS</div>
						<div className="row-child">
							<ul className="grid-list-large">
								{calculatedTeamTwoPlayers.map((player) => (
									<li key={player[1]._id}>
										<PlayerCard
											{...player[1]}
											showDetails={false}
										/>
									</li>
								))}
								<li className="bold-text">
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
								<h2>Participating Players</h2>
								<p>
									Select all players that are participating in
									the game.
								</p>
								<ul className="grid-list-small">
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
								if (playersParticipatingSelected.size != 0) {
									pairTeams(e);
								} else {
									toggleTeamSizeError(e);
								}
							}}
						>
							<div>
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
