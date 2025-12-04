/**
 * MovieGrid Component
 * Displays a grid of recommended movies
 */

import { FC } from "react";
import { motion } from "framer-motion";
import MovieCard, { MovieCardProps } from "./MovieCard";

interface MovieGridProps {
	movies: MovieCardProps[];
	isLoading?: boolean;
	emptyMessage?: string;
}

const MovieGrid: FC<MovieGridProps> = ({
	movies,
	isLoading = false,
	emptyMessage = "No movies found. Try different preferences.",
}) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{[...Array(12)].map((_, i) => (
					<div
						key={i}
						className="bg-netflix-card-bg rounded-lg aspect-[2/3] animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (movies.length === 0) {
		return (
			<div className="flex items-center justify-center py-16">
				<p className="text-netflix-gray text-lg">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
		>
			{movies.map((movie, index) => (
				<MovieCard key={movie.id} {...movie} index={index} />
			))}
		</motion.div>
	);
};

export default MovieGrid;
