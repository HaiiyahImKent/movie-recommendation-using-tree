/**
 * Home Page
 * Landing page with project introduction and call-to-action
 */

import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";

const Home: FC = () => {
	const navigate = useNavigate();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: "easeOut" },
		},
	};

	return (
		<div className="min-h-screen bg-netflix-black overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-netflix-red rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
			</div>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center px-4">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="max-w-4xl text-center"
				>
					{/* Logo/Branding */}
					<motion.div variants={itemVariants} className="mb-8">
						<div className="inline-block">
							<h1 className="text-hero font-black text-white mb-2 tracking-tight">
								CinePath
							</h1>
							<div className="h-1 w-32 bg-gradient-to-r from-netflix-red to-red-600 mx-auto rounded-full" />
						</div>
					</motion.div>

					{/* Tagline */}
					<motion.p
						variants={itemVariants}
						className="text-3xl md:text-4xl text-white font-light mb-4 leading-relaxed"
					>
						Your Path to the Perfect Movie
					</motion.p>

					{/* Description */}
					<motion.p
						variants={itemVariants}
						className="text-lg md:text-xl text-netflix-gray mb-12 max-w-2xl mx-auto leading-relaxed"
					>
						Discover Your Paborite Movie with Just{" "}
						<span className="text-netflix-red font-semibold">
							{" "}
							7+ personalized questions
						</span>{" "}
						and get recommendations suited to your taste.
					</motion.p>

					{/* Features */}
					<motion.div
						variants={itemVariants}
						className="grid md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
					>
						<div className="bg-netflix-card-bg p-6 rounded-lg border border-netflix-dark-bg">
							<h3 className="text-white font-bold mb-2">Smart Algorithm</h3>
							<p className="text-netflix-gray text-sm">
								We use a Binary decision tree with DFS traversal
							</p>
						</div>
						<div className="bg-netflix-card-bg p-6 rounded-lg border border-netflix-dark-bg">
							<h3 className="text-white font-bold mb-2">50+ Movies</h3>
							<p className="text-netflix-gray text-sm">
								Use Real-time recommendations via TMDB API
							</p>
						</div>
						<div className="bg-netflix-card-bg p-6 rounded-lg border border-netflix-dark-bg">
							<h3 className="text-white font-bold mb-2">Netflix Links</h3>
							<p className="text-netflix-gray text-sm">
								Direct search on Netflix for each recommendation (Need Account)
							</p>
						</div>
					</motion.div>

					{/* Technical Highlights */}
					<motion.div
						variants={itemVariants}
						className="mb-12 bg-netflix-card-bg p-8 rounded-lg border border-netflix-dark-bg"
					>
						<h3 className="text-white font-bold mb-4 text-lg">
							Built with Modern Tech
						</h3>
						<div className="flex flex-wrap justify-center gap-3">
							{[
								"React 18",
								"TypeScript",
								"Vite",
								"Tailwind CSS",
								"Framer Motion",
								"Data Structures",
								"Algorithm Analysis",
								"TMDB API",
								"Decision Trees",
							].map((tech) => (
								<span
									key={tech}
									className="bg-netflix-dark-bg px-4 py-2 rounded-full text-netflix-gray text-sm border border-netflix-dark-bg hover:border-netflix-red transition-colors"
								>
									{tech}
								</span>
							))}
						</div>
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col md:flex-row gap-4 justify-center"
					>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate("/recommend")}
							className="group relative px-8 md:px-10 py-4 bg-netflix-red hover:bg-red-700 rounded-lg font-bold text-white text-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
						>
							<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
							<span className="relative">Start Recommendation</span>
							<FiArrowRight className="relative w-5 h-5" />
						</motion.button>

						<motion.a
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							href="#documentation"
							className="px-8 md:px-10 py-4 bg-netflix-dark-bg border-2 border-netflix-gray rounded-lg font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:border-netflix-red"
						>
							<FiExternalLink className="w-5 h-5" />
							<span>View Documentation</span>
						</motion.a>
					</motion.div>
				</motion.div>
			</div>

			{/* Documentation Section */}
			<div
				id="documentation"
				className="relative z-10 bg-netflix-dark-bg py-20 px-4 md:px-8 border-t border-netflix-card-bg"
			>
				<div className="max-w-4xl mx-auto">
					<motion.h2
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-title text-white font-bold mb-8"
					>
						📚 How It Works
					</motion.h2>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
						className="grid md:grid-cols-2 gap-8"
					>
						{/* Section 1 */}
						<div className="space-y-4">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center">
									<span className="text-white font-bold">1</span>
								</div>
								<div>
									<h3 className="text-white font-bold text-lg mb-2">
										Answer Questions
									</h3>
									<p className="text-netflix-gray">
										Navigate through up to 10 personalized questions about your
										movie preferences. Each answer branches the decision tree in
										a new direction.
									</p>
								</div>
							</div>
						</div>

						{/* Section 2 */}
						<div className="space-y-4">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center">
									<span className="text-white font-bold">2</span>
								</div>
								<div>
									<h3 className="text-white font-bold text-lg mb-2">
										Get Recommendations
									</h3>
									<p className="text-netflix-gray">
										Our algorithm analyzes your preferences and generates
										personalized movie recommendations based on genre matching
										and popularity.
									</p>
								</div>
							</div>
						</div>

						{/* Section 3 */}
						<div className="space-y-4">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center">
									<span className="text-white font-bold">3</span>
								</div>
								<div>
									<h3 className="text-white font-bold text-lg mb-2">
										View Analytics
									</h3>
									<p className="text-netflix-gray">
										See algorithm performance metrics, tree traversal analysis,
										and DFS vs BFS complexity comparisons in real-time.
									</p>
								</div>
							</div>
						</div>

						{/* Section 4 */}
						<div className="space-y-4">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center">
									<span className="text-white font-bold">4</span>
								</div>
								<div>
									<h3 className="text-white font-bold text-lg mb-2">
										Watch on Netflix
									</h3>
									<p className="text-netflix-gray">
										Click "Watch on Netflix" to search for each recommendation
										on Netflix and add them to your watchlist.
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Technical Details */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="mt-12 bg-netflix-card-bg p-8 rounded-lg border border-netflix-dark-bg"
					>
						<h3 className="text-white font-bold text-xl mb-6">🔧 Technical Stack</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="text-netflix-red font-bold mb-3">Frontend</h4>
								<ul className="space-y-2 text-netflix-gray">
									<li>• React 18 with Hooks</li>
									<li>• TypeScript (strict mode)</li>
									<li>• Vite build tool</li>
									<li>• Tailwind CSS</li>
									<li>• Framer Motion animations</li>
								</ul>
							</div>
							<div>
								<h4 className="text-netflix-red font-bold mb-3">Data & APIs</h4>
								<ul className="space-y-2 text-netflix-gray">
									<li>• Binary Decision Tree (DSA)</li>
									<li>• Stack (undo functionality)</li>
									<li>• Queue (session history)</li>
									<li>• DFS Traversal Algorithm</li>
									<li>• TMDB API integration</li>
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Algorithm Explanation */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						viewport={{ once: true }}
						className="mt-8 bg-netflix-card-bg p-8 rounded-lg border border-netflix-dark-bg"
					>
						<h3 className="text-white font-bold text-xl mb-4">📊 Algorithm Details</h3>
						<p className="text-netflix-gray mb-4">
							<strong className="text-white">
								Depth-First Search (DFS) Traversal:
							</strong>{" "}
							The system uses a binary decision tree where each node represents a
							question. By answering yes/no questions, you traverse the tree in a
							depth-first manner, reaching leaf nodes that contain recommended movie
							genres.
						</p>
						<p className="text-netflix-gray mb-4">
							<strong className="text-white">Time Complexity:</strong> O(h) where h is
							the tree height (typically ≤10 levels). This is more efficient than
							breadth-first search for this use case.
						</p>
						<p className="text-netflix-gray">
							<strong className="text-white">Undo Feature (Stack):</strong> Uses a
							stack data structure to store visited nodes, allowing you to go back to
							previous questions without restarting the entire recommendation process.
						</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Home;
