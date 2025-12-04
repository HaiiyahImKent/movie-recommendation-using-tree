/**
 * Main App Component
 * Routes and global configuration for CinePath
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recommend from "./pages/Recommend";
import Results from "./pages/Results";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/recommend" element={<Recommend />} />
				<Route path="/results" element={<Results />} />
			</Routes>
		</Router>
	);
}

export default App;
