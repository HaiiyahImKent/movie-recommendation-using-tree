/**
 * RecommendationStats Component
 * Displays algorithm metrics and performance statistics
 * Shows DFS vs BFS comparison and traversal details
 */

import { FC } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiClock, FiTarget } from "react-icons/fi";

interface RecommendationStatsProps {
	visitedNodes: number;
	traversalTimeMs: number;
	depth: number;
	bfsDepth: number;
	totalTreeNodes: number;
	treeHeight: number;
}

const RecommendationStats: FC<RecommendationStatsProps> = ({
	visitedNodes,
	traversalTimeMs,
	depth,
	bfsDepth,
	totalTreeNodes,
	treeHeight,
}) => {
	const timeComplexity = `O(${treeHeight})`;
	const spaceComplexity = `O(${depth})`;
	const efficiency = ((depth / treeHeight) * 100).toFixed(1);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* DFS Traversal Metrics */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-4"
			>
				<div className="flex items-center gap-2 mb-3">
					<FiTarget className="w-5 h-5 text-netflix-red" />
					<h4 className="text-white font-bold">DFS Traversal</h4>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Nodes Visited:</span>
						<span className="text-white font-semibold">{visitedNodes}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Tree Depth:</span>
						<span className="text-white font-semibold">{depth}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Time Taken:</span>
						<span className="text-netflix-red font-semibold">
							{traversalTimeMs.toFixed(2)}ms
						</span>
					</div>
				</div>
			</motion.div>

			{/* Complexity Analysis */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
				className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-4"
			>
				<div className="flex items-center gap-2 mb-3">
					<FiClock className="w-5 h-5 text-netflix-red" />
					<h4 className="text-white font-bold">Algorithm Analysis</h4>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Time Complexity:</span>
						<span className="text-white font-semibold">{timeComplexity}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Space Complexity:</span>
						<span className="text-white font-semibold">{spaceComplexity}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Efficiency:</span>
						<span className="text-netflix-red font-semibold">{efficiency}%</span>
					</div>
				</div>
			</motion.div>

			{/* Tree Structure Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
				className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-4"
			>
				<div className="flex items-center gap-2 mb-3">
					<FiTrendingUp className="w-5 h-5 text-netflix-red" />
					<h4 className="text-white font-bold">Tree Structure</h4>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Total Nodes:</span>
						<span className="text-white font-semibold">{totalTreeNodes}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Height:</span>
						<span className="text-white font-semibold">{treeHeight}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Max Branches:</span>
						<span className="text-white font-semibold">2 (Binary)</span>
					</div>
				</div>
			</motion.div>

			{/* DFS vs BFS Comparison */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.3 }}
				className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-4"
			>
				<div className="flex items-center gap-2 mb-3">
					<FiTrendingUp className="w-5 h-5 text-netflix-red" />
					<h4 className="text-white font-bold">DFS vs BFS</h4>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">DFS Depth:</span>
						<span className="text-white font-semibold">{depth}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">BFS Depth:</span>
						<span className="text-white font-semibold">{bfsDepth}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-netflix-gray text-sm">Better Algorithm:</span>
						<span
							className={`font-semibold ${
								depth <= bfsDepth ? "text-netflix-red" : "text-white"
							}`}
						>
							{depth <= bfsDepth ? "DFS ✓" : "BFS ✓"}
						</span>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default RecommendationStats;
