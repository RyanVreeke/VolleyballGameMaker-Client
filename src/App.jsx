import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./routes/Game/game";
import Players from "./routes/Players/players";
import Player from "./routes/Players/player";
import CreatePlayer from "./routes/Players/createPlayer";
import EditPlayer from "./routes/Players/editPlayer";
import MatchMaker from "./routes/MatchMaker/matchMaker";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<Game />} />
					<Route path="/players" element={<Players />} />
					<Route path="/players/:slug" element={<Player />} />
					<Route path="/create-player" element={<CreatePlayer />} />
					<Route path="/edit-player/:slug" element={<EditPlayer />} />
					<Route path="/match-maker" element={<MatchMaker />} />
				</Routes>
				<Footer />
			</Router>
		</>
	);
}

export default App;
