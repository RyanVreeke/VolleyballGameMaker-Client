import React from "react";
import { Link } from "react-router-dom";

function PlayerCard({
	_id,
	name,
	wins,
	losses,
	pointDifferential,
	showDetails,
}) {
	const gameAmount = wins + losses;
	const winRatioValue = wins / gameAmount;
	const pointDifferentialValue = pointDifferential / gameAmount;
	const ratingValue =
		winRatioValue * 1 + (pointDifferentialValue / 100) * 1.2;

	if (showDetails) {
		return (
			<div className="player-card">
				<h2 className="player-name">{name}</h2>
				<hr />
				<p className="player-stats">Wins: {wins}</p>
				<p className="player-stats">Losses: {losses}</p>
				<p className="player-stats">
					Win Ratio: {(winRatioValue * 100).toFixed(2)}%
				</p>
				<p className="player-stats">
					Point Differential: {pointDifferentialValue.toFixed(2)}
				</p>
				<p className="player-stats">Rating: {ratingValue.toFixed(2)}</p>
				<Link to={`/players/${_id}`}>Details</Link>
			</div>
		);
	} else {
		return (
			<div className="player-card">
				<h2 className="player-name">{name}</h2>
				<hr />
				<p className="player-stats">Wins: {wins}</p>
				<p className="player-stats">Losses: {losses}</p>
				<p className="player-stats">
					Win Ratio: {(winRatioValue * 100).toFixed(2)}%
				</p>
				<p className="player-stats">
					Point Differential: {pointDifferentialValue.toFixed(2)}
				</p>
				<p className="player-stats">Rating: {ratingValue.toFixed(2)}</p>
			</div>
		);
	}
}

export default PlayerCard;
