/**
 * 5. Components: Tree Visualizer Component
 *    - It displays the decision tree structure and current traversal path
 *    - It also highlights visited nodes and the current position in the tree when you are picking answers
 */

import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import { FiCircle, FiCheckCircle } from "react-icons/fi";

interface TreeNodeVisualizerProps {
	path: string[];
	currentQuestionIndex: number;
	totalPossibleQuestions: number;
}

const TreeVisualizer: FC<TreeNodeVisualizerProps> = ({
	path,
	currentQuestionIndex,
	totalPossibleQuestions,
}) => {
	const visiblePath = useMemo(() => {
		return path.slice(0, currentQuestionIndex + 1);
	}, [path, currentQuestionIndex]);

	return (
		<div className="bg-netflix-card-bg rounded-lg p-6 border border-netflix-dark-bg">
			{/* Header */}
			<div className="mb-6">
				<h3 className="text-white font-bold text-lg mb-2">Decision Path</h3>
				<p className="text-netflix-gray text-sm">
					{currentQuestionIndex} of {totalPossibleQuestions} nodes visited
				</p>
			</div>

			{/* Tree Visualization */}
			<div className="space-y-3 max-h-64 overflow-y-auto">
				{visiblePath.map((question, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="flex items-start gap-3"
					>
						{/* Node Indicator */}
						<div className="pt-1 flex-shrink-0">
							{index === visiblePath.length - 1 ? (
								<motion.div
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 1.5, repeat: Infinity }}
								>
									<FiCheckCircle className="w-5 h-5 text-netflix-red" />
								</motion.div>
							) : (
								<FiCircle className="w-5 h-5 text-netflix-gray" />
							)}
						</div>

						{/* Question Text */}
						<div className="flex-1 min-w-0">
							<p
								className={`text-sm leading-snug ${
									index === visiblePath.length - 1
										? "text-white font-semibold"
										: "text-netflix-gray"
								}`}
							>
								{question}
							</p>
							{index < visiblePath.length - 1 && (
								<p className="text-netflix-red text-xs mt-1">↓</p>
							)}
						</div>
					</motion.div>
				))}
			</div>

			{/* Analytics Footer */}
			<div className="mt-6 pt-4 border-t border-netflix-dark-bg">
				<div className="grid grid-cols-2 gap-4 text-xs">
					<div>
						<p className="text-netflix-gray">Nodes Visited</p>
						<p className="text-white font-bold text-lg">{currentQuestionIndex}</p>
					</div>
					<div>
						<p className="text-netflix-gray">Progress</p>
						<p className="text-netflix-red font-bold text-lg">
							{Math.round((currentQuestionIndex / totalPossibleQuestions) * 100)}%
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TreeVisualizer;
