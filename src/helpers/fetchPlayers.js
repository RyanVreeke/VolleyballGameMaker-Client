function compareStrings(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();

	return a < b ? -1 : a > b ? 1 : 0;
}

export const fetchPlayers = async () => {
	const serverURL = import.meta.env.VITE_SERVER_URL;
	const baseURL = `${serverURL}/api/players`;

	try {
		const response = await fetch(baseURL);
		if (!response.ok) {
			throw new Error("Failed to fetch Volleyball Players data.");
		}

		const jsonData = await response.json();
		jsonData.sort(function (a, b) {
			return compareStrings(a.name, b.name);
		});

		return jsonData;
	} catch (error) {
		console.log(error);
		return error;
	}
};
