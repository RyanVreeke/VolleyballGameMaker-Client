import React from "react";
import { Link } from "react-router-dom";

function PlayerCard({ _id, name, wins, losses, showDetails }) {
	if (showDetails) {
		return (
			<div className="player-card">
				<h2 className="player-name">{name}</h2>
				<hr />
				<p className="player-stats">Wins: {wins}</p>
				<p className="player-stats">Losses: {losses}</p>
				<p className="player-stats">
					Win Ratio: {((wins / (wins + losses)) * 100).toFixed(2)}%
				</p>
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
					Win Ratio: {((wins / (wins + losses)) * 100).toFixed(2)}%
				</p>
			</div>
		);
	}
}

export default PlayerCard;
