/**
 * Recommend Page
 * Interactive decision tree questionnaire with visualization
 */

import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuestionCard from "../components/QuestionCard";
import TreeVisualizer from "../components/TreeVisualizer";
import { DecisionTree, DecisionNode, TraversalResult } from "../data-structures/DecisionTree";
import { Stack } from "../data-structures/Stack";

interface RecommendState {
	currentQuestion: DecisionNode | null;
	answers: boolean[];
	questionPath: string[];
	history: DecisionNode[];
	traversalResult: TraversalResult | null;
	isFinished: boolean;
}

const Recommend: FC = () => {
	const navigate = useNavigate();
	const [state, setState] = useState<RecommendState>(() => {
		const tree = new DecisionTree();
		return {
			currentQuestion: tree.getRoot(),
			answers: [],
			questionPath: [],
			history: [tree.getRoot()],
			traversalResult: null,
			isFinished: false,
		};
	});

	const [tree] = useState(() => new DecisionTree());
	const [undoStack] = useState(() => new Stack<DecisionNode>());

	// Initialize the undo stack with root
	useEffect(() => {
		undoStack.push(state.currentQuestion!);
	}, []);

	const handleAnswer = (answer: boolean) => {
		if (!state.currentQuestion) return;

		const nextQuestion = answer ? state.currentQuestion.yes : state.currentQuestion.no;

		if (!nextQuestion) return;

		const newAnswers = [...state.answers, answer];
		const newHistory = [...state.history, nextQuestion];

		// Add current to undo stack
		if (state.currentQuestion) {
			undoStack.push(state.currentQuestion);
		}

		// If we've reached a leaf node with genres
		if (nextQuestion.recommendedGenres && !nextQuestion.question) {
			const result = tree.traverseDFS(newAnswers);
			setState((prev) => ({
				...prev,
				answers: newAnswers,
				history: newHistory,
				traversalResult: result,
				isFinished: true,
			}));
		} else {
			setState((prev) => ({
				...prev,
				currentQuestion: nextQuestion,
				answers: newAnswers,
				questionPath: [...prev.questionPath, nextQuestion.question || ""],
				history: newHistory,
			}));
		}
	};

	const handleUndo = () => {
		if (state.answers.length === 0) return;

		const newAnswers = state.answers.slice(0, -1);
		const newHistory = state.history.slice(0, -1);

		// Traverse tree again with updated answers
		if (newAnswers.length === 0) {
			setState({
				currentQuestion: tree.getRoot(),
				answers: [],
				questionPath: [],
				history: [tree.getRoot()],
				traversalResult: null,
				isFinished: false,
			});
		} else {
			let current = tree.getRoot();
			for (const answer of newAnswers) {
				current = answer ? current.yes! : current.no!;
			}

			setState({
				currentQuestion: current,
				answers: newAnswers,
				questionPath: state.questionPath.slice(0, -1),
				history: newHistory,
				traversalResult: null,
				isFinished: false,
			});
		}

		undoStack.pop();
	};

	const handleStartOver = () => {
		navigate("/recommend");
		window.location.reload();
	};

	const handleViewResults = () => {
		if (state.traversalResult) {
			navigate("/results", {
				state: {
					genres: state.traversalResult.recommendedGenres,
					stats: {
						visitedNodes: state.traversalResult.visitedNodes,
						traversalTimeMs: state.traversalResult.traversalTimeMs,
						depth: state.traversalResult.depth,
						bfsDepth: tree.getTheoreticalBFSDepth(),
						totalTreeNodes: tree.getTotalNodes(),
						treeHeight: tree.getHeight(),
					},
				},
			});
		}
	};

	return (
		<div className="min-h-screen bg-netflix-black py-12 px-4">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-6xl mx-auto mb-12"
			>
				<button
					onClick={() => navigate("/")}
					className="text-netflix-gray hover:text-netflix-red transition-colors mb-6 flex items-center gap-2"
				>
					← Back to Home
				</button>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
					Find Your Perfect Movie
				</h1>
				<p className="text-netflix-gray text-lg">
					Answer questions about your preferences and get personalized recommendations
				</p>
			</motion.div>

			{!state.isFinished ? (
				// Question View
				<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="md:col-span-2">
						{state.currentQuestion?.question && (
							<QuestionCard
								question={state.currentQuestion.question}
								onYes={() => handleAnswer(true)}
								onNo={() => handleAnswer(false)}
								onUndo={handleUndo}
								canUndo={state.answers.length > 0}
								questionNumber={state.answers.length + 1}
								totalQuestions={tree.getHeight()}
							/>
						)}
					</div>

					{/* Sidebar: Tree Visualization */}
					<div className="md:col-span-1">
						<TreeVisualizer
							path={[
								state.currentQuestion?.question || "Starting...",
								...state.questionPath,
							]}
							currentQuestionIndex={state.answers.length}
							totalPossibleQuestions={tree.getHeight()}
						/>
					</div>
				</div>
			) : (
				// Results Summary
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-4xl mx-auto"
				>
					<div className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-8 md:p-12">
						{/* Success Message */}
						<div className="text-center mb-8">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="inline-block mb-6"
							>
								<div className="w-20 h-20 bg-netflix-red rounded-full flex items-center justify-center">
									<span className="text-4xl">✓</span>
								</div>
							</motion.div>
							<h2 className="text-4xl font-bold text-white mb-4">
								Recommendations Ready!
							</h2>
							<p className="text-netflix-gray text-lg">
								Based on your {state.answers.length} answers, we've found movies
								perfectly tailored to your taste.
							</p>
						</div>

						{/* Stats Grid */}
						{state.traversalResult && (
							<div className="grid md:grid-cols-3 gap-4 mb-8">
								<div className="bg-netflix-dark-bg p-6 rounded-lg border border-netflix-dark-bg">
									<div className="text-netflix-red font-bold text-2xl mb-2">
										{state.traversalResult.visitedNodes}
									</div>
									<p className="text-netflix-gray text-sm">Nodes Visited</p>
								</div>
								<div className="bg-netflix-dark-bg p-6 rounded-lg border border-netflix-dark-bg">
									<div className="text-netflix-red font-bold text-2xl mb-2">
										{state.traversalResult.depth}
									</div>
									<p className="text-netflix-gray text-sm">Tree Depth</p>
								</div>
								<div className="bg-netflix-dark-bg p-6 rounded-lg border border-netflix-dark-bg">
									<div className="text-netflix-red font-bold text-2xl mb-2">
										{state.traversalResult.traversalTimeMs.toFixed(1)}ms
									</div>
									<p className="text-netflix-gray text-sm">Traversal Time</p>
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-col md:flex-row gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleViewResults}
								className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300"
							>
								View 10+ Movies
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleStartOver}
								className="flex-1 bg-netflix-dark-bg border-2 border-netflix-gray hover:border-netflix-red text-white font-bold py-4 px-6 rounded-lg transition-all duration-300"
							>
								Start Over
							</motion.button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default Recommend;
