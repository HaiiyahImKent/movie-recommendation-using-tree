/**
 * MovieCard Component
 * Displays a single movie recommendation with poster, details, and Netflix link
 */

import { FC } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

export interface MovieCardProps {
	id: number;
	title: string;
	image: string;
	overview: string;
	genreNames: string[];
	netflixUrl: string;
	displayYear: string | number;
	voteAverage: number;
	index?: number;
}

const MovieCard: FC<MovieCardProps> = ({
	title,
	image,
	overview,
	genreNames,
	netflixUrl,
	displayYear,
	index = 0,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className="group bg-netflix-card-bg rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
		>
			{/* Poster Image Container */}
			<div className="relative overflow-hidden bg-netflix-dark-bg aspect-[2/3]">
				<motion.img
					src={image}
					alt={title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
				/>
			</div>

			{/* Content Container */}
			<div className="p-4 flex-1 flex flex-col justify-between">
				{/* Title and Year */}
				<div className="mb-3">
					<h3 className="text-white font-bold text-lg leading-snug line-clamp-2 mb-1">
						{title}
					</h3>
					<p className="text-netflix-gray text-sm">{displayYear}</p>
				</div>

				{/* Overview */}
				<p className="text-netflix-gray text-sm line-clamp-3 mb-4 flex-grow">{overview}</p>

				{/* Genres */}
				<div className="flex flex-wrap gap-2 mb-4">
					{genreNames.slice(0, 3).map((genre) => (
						<span
							key={genre}
							className="inline-block bg-netflix-dark-bg text-netflix-red text-xs px-2 py-1 rounded border border-netflix-red"
						>
							{genre}
						</span>
					))}
				</div>

				{/* Netflix Link Button */}
				<motion.a
					href={netflixUrl}
					target="_blank"
					rel="noopener noreferrer"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="group/btn relative w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
				>
					<div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
					<span className="relative">Watch on Netflix</span>
					<FiExternalLink className="relative w-4 h-4" />
				</motion.a>
			</div>
		</motion.div>
	);
};

export default MovieCard;
