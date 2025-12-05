/**
 * 3. Components: Question Card Component
 *    - It displays a single decision tree question with YES/NO buttons
 *    - It also includes animations and accessibility features
 */

import { FC } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

interface QuestionCardProps {
	question: string;
	onYes: () => void;
	onNo: () => void;
	onUndo?: () => void;
	canUndo?: boolean;
	questionNumber?: number;
	totalQuestions?: number;
	isLoading?: boolean;
}

const QuestionCard: FC<QuestionCardProps> = ({
	question,
	onYes,
	onNo,
	onUndo,
	canUndo = false,
	questionNumber = 1,
	totalQuestions = 10,
	isLoading = false,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}
			className="w-full max-w-2xl mx-auto px-4"
		>
			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-2">
					<span className="text-netflix-gray text-sm">
						Question {questionNumber} of {totalQuestions}
					</span>
					<span className="text-netflix-gray text-sm">
						{Math.round((questionNumber / totalQuestions) * 100)}%
					</span>
				</div>
				<div className="w-full bg-netflix-card-bg rounded-full h-2 overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="h-full bg-gradient-to-r from-netflix-red to-red-600"
					/>
				</div>
			</div>

			{/* Card Container */}
			<div className="bg-netflix-card-bg border border-netflix-dark-bg rounded-lg p-8 md:p-12 shadow-lg">
				{/* Question Text */}
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-tight text-center">
					{question}
				</h2>

				{/* Button Container */}
				<div className="flex gap-4 md:gap-6 mb-6">
					{/* YES Button */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onYes}
						disabled={isLoading}
						className="flex-1 group relative px-8 py-4 bg-netflix-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white text-lg transition-all duration-300 overflow-hidden"
					>
						<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
						<div className="flex items-center justify-center gap-3">
							<FiCheck className="w-6 h-6" />
							<span>Yes</span>
						</div>
					</motion.button>

					{/* NO Button */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onNo}
						disabled={isLoading}
						className="flex-1 group relative px-8 py-4 bg-netflix-dark-bg hover:bg-netflix-card-bg border-2 border-netflix-gray disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white text-lg transition-all duration-300"
					>
						<div className="flex items-center justify-center gap-3">
							<FiX className="w-6 h-6" />
							<span>No</span>
						</div>
					</motion.button>
				</div>

				{/* Undo Button */}
				{canUndo && (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						onClick={onUndo}
						className="w-full py-2 text-netflix-gray hover:text-netflix-red text-sm font-medium transition-colors"
					>
						← Go Back
					</motion.button>
				)}
			</div>
		</motion.div>
	);
};

export default QuestionCard;
