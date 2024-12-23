import React, { useState } from "react";

function PlayerButton({ player, onPlayerButtonClick }) {
	const [buttonSelected, setButtonSelected] = useState(false);

	return (
		<button
			className={buttonSelected ? "button-selected" : "button-unselected"}
			type="button"
			onClick={() => {
				setButtonSelected(!buttonSelected);
				onPlayerButtonClick(!buttonSelected);
			}}
		>
			{player.name}
		</button>
	);
}

export default PlayerButton;
