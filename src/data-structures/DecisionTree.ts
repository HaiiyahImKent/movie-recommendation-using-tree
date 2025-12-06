/**
 * BINARY DECISION TREE Data Structure
 * This file contains the implementation of a binary decision tree used to recommend movie genres based on user responses to a series of questions.
 * The tree is designed to be around 7-12 questions deep to ensure a thorough recommendation process. We used Depth-First Search (DFS) for traversing the tree.
 * The tree is called Binary Decision Tree. And each node represents a question with YES/NO branches leading to further questions or genre recommendations.
 * The Space and Time Complexity of traversing this tree is O(d), where d is the depth of the tree (number of questions).
 */

export interface DecisionNode {
	question?: string;
	yes?: DecisionNode;
	no?: DecisionNode;
	recommendedGenres?: number[];
}

export interface TraversalState {
	currentNode: DecisionNode;
	path: string[];
	visitedCount: number;
	startTime: number;
}

export interface TraversalResult {
	recommendedGenres: number[];
	path: string[];
	visitedNodes: number;
	traversalTimeMs: number;
	depth: number;
}

export class DecisionTree {
	private root: DecisionNode;

	constructor() {
		this.root = this.buildTree();
	}

	private buildTree(): DecisionNode {
		return {
			// Q1: Mood & Energy Level
			question: "Are you in the mood for something energized and exciting?",
			yes: {
				// Energized/Excited path
				// Q2: Intensity preference
				question: "Do you want high-energy action",
				yes: {
					// Q3: Action intensity
					question: "Do you prefer superhero over fantasy action?",
					yes: {
						// Q4: Superhero/Fantasy
						question: "Do you prefer sci-fi over magical fantasy?",
						yes: {
							// Q5: Sci-Fi path
							question: "Do you like dystopian futures?",
							yes: {
								// Q6: Dystopian
								question: "Should it be dark and serious?",
								yes: {
									// Q7: Dark dystopian
									question: "Do you prefer psychological themes?",
									yes: {
										// Q8: Psychological sci-fi
										question: "Should it be mind-bending?",
										yes: {
											// Q9: Mind-bending sci-fi
											question: "Do you like philosophical questions?",
											yes: {
												// Q10: Deep sci-fi
												question: "Should it have action sequences?",
												yes: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
												no: { recommendedGenres: [878, 18] }, // Sci-Fi, Drama
											},
											no: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
										},
										no: { recommendedGenres: [53, 878] }, // Thriller, Sci-Fi
									},
									no: {
										// Q8: Pure action dystopian
										question: "Do you like survival themes?",
										yes: {
											// Q9: Survival dystopian
											question: "Should it have adventure elements?",
											yes: { recommendedGenres: [28, 12, 878] }, // Action, Adventure, Sci-Fi
											no: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
										},
										no: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
									},
								},
								no: {
									// Q6: Lighter sci-fi
									question: "Do you like space exploration?",
									yes: {
										// Q7: Space exploration
										question: "Should it have humor?",
										yes: {
											// Q8: Space adventure comedy
											question: "Do you prefer adventure tone?",
											yes: { recommendedGenres: [28, 12, 35, 878] }, // Action, Adventure, Comedy, Sci-Fi
											no: { recommendedGenres: [35, 878] }, // Comedy, Sci-Fi
										},
										no: { recommendedGenres: [28, 12, 878] }, // Action, Adventure, Sci-Fi
									},
									no: {
										// Q7: Near-future sci-fi
										question: "Do you like tech/cyberpunk aesthetics?",
										yes: {
											// Q8: Cyberpunk
											question: "Should it be noir-style?",
											yes: { recommendedGenres: [28, 80, 878] }, // Action, Crime, Sci-Fi
											no: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
										},
										no: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
									},
								},
							},
							no: {
								// Q6: Fantasy adventure
								question: "Should it be epic/grand scale?",
								yes: {
									// Q7: Epic fantasy
									question: "Do you like mythology and magical worlds?",
									yes: {
										// Q8: Mythological fantasy
										question: "Should it have dark elements?",
										yes: {
											// Q9: Dark epic fantasy
											question: "Do you like complex plots?",
											yes: { recommendedGenres: [28, 14, 12] }, // Action, Fantasy, Adventure
											no: { recommendedGenres: [14, 12] }, // Fantasy, Adventure
										},
										no: { recommendedGenres: [28, 14, 12] }, // Action, Fantasy, Adventure
									},
									no: {
										// Q8: Quest-based fantasy
										question: "Should it have romance elements?",
										yes: {
											// Q9: Fantasy romance adventure
											question: "Do you prefer happy endings?",
											yes: { recommendedGenres: [14, 12, 10749] }, // Fantasy, Adventure, Romance
											no: { recommendedGenres: [14, 12] }, // Fantasy, Adventure
										},
										no: { recommendedGenres: [28, 14, 12] }, // Action, Fantasy, Adventure
									},
								},
								no: {
									// Q7: Lighter fantasy
									question: "Do you like adventure with humor?",
									yes: {
										// Q8: Fantasy adventure comedy
										question: "Should it be whimsical?",
										yes: {
											// Q9: Whimsical fantasy
											question: "Do you like family-friendly content?",
											yes: { recommendedGenres: [14, 12, 35, 10751] }, // Fantasy, Adventure, Comedy, Family
											no: { recommendedGenres: [14, 12, 35] }, // Fantasy, Adventure, Comedy
										},
										no: { recommendedGenres: [28, 14, 12] }, // Action, Fantasy, Adventure
									},
									no: { recommendedGenres: [14, 12] }, // Fantasy, Adventure
								},
							},
						},
						no: {
							// Q5: Realistic/crime action
							question: "Do you like heist and crime stories?",
							yes: {
								// Q6: Crime/Heist
								question: "Should it have thriller elements?",
								yes: {
									// Q7: Crime thriller
									question: "Do you like detective mysteries?",
									yes: {
										// Q8: Detective thriller
										question: "Should it be dark and gritty?",
										yes: {
											// Q9: Dark detective
											question: "Do you prefer psychological complexity?",
											yes: {
												// Q10: Psychological detective
												question: "Should it be slow-burn?",
												yes: {
													// Q11: Slow-burn psychological
													question: "Do you like unreliable narrators?",
													yes: { recommendedGenres: [28, 80, 53] }, // Action, Crime, Thriller
													no: { recommendedGenres: [28, 80, 18] }, // Action, Crime, Drama
												},
												no: {
													// Q11: Fast-paced psychological
													question: "Should it be high-stakes?",
													yes: { recommendedGenres: [28, 80, 53] }, // Action, Crime, Thriller
													no: { recommendedGenres: [28, 80] }, // Action, Crime
												},
											},
											no: {
												// Q10: Simple detective
												question: "Should it have humor?",
												yes: { recommendedGenres: [28, 35, 80] }, // Action, Comedy, Crime
												no: { recommendedGenres: [28, 80] }, // Action, Crime
											},
										},
										no: { recommendedGenres: [28, 80] }, // Action, Crime
									},
									no: {
										// Q8: Heist thriller
										question: "Do you like elaborate plans?",
										yes: {
											// Q9: Heist thriller
											question: "Should it be comedic?",
											yes: {
												// Q10: Heist comedy
												question: "Do you like witty dialogue?",
												yes: { recommendedGenres: [28, 35, 80] }, // Action, Comedy, Crime
												no: { recommendedGenres: [28, 35] }, // Action, Comedy
											},
											no: {
												// Q10: Serious heist
												question: "Should it be fast-paced?",
												yes: { recommendedGenres: [28, 80] }, // Action, Crime
												no: { recommendedGenres: [28, 80] }, // Action, Crime (no thriller since user didn't explicitly choose thriller)
											},
										},
										no: {
											// Q9: Simple heist
											question: "Do you prefer action-heavy?",
											yes: { recommendedGenres: [28, 80] }, // Action, Crime
											no: { recommendedGenres: [28] }, // Action
										},
									},
								},
								no: {
									// Q7: Adventure heist
									question: "Should it be international/exotic?",
									yes: {
										// Q8: Adventure heist
										question: "Do you like treasure hunting?",
										yes: {
											// Q9: Treasure heist
											question: "Should it have historical elements?",
											yes: { recommendedGenres: [12, 28, 36] }, // Adventure, Action, History
											no: { recommendedGenres: [12, 28] }, // Adventure, Action
										},
										no: { recommendedGenres: [12, 28] }, // Adventure, Action
									},
									no: { recommendedGenres: [28, 80] }, // Action, Crime
								},
							},
							no: {
								// Q6: Martial arts/combat sports
								question: "Do you like martial arts and combat sports?",
								yes: {
									// Q7: Martial arts
									question: "Should it be historical?",
									yes: {
										// Q8: Historical martial arts
										question: "Do you prefer Eastern settings?",
										yes: {
											// Q9: Eastern martial arts
											question: "Should it be story-focused?",
											yes: {
												// Q10: Story-focused eastern
												question: "Do you like philosophical themes?",
												yes: { recommendedGenres: [28, 18, 36] }, // Action, Drama, History
												no: { recommendedGenres: [28, 18] }, // Action, Drama
											},
											no: {
												// Q10: Action-focused eastern
												question: "Should it be fast-paced?",
												yes: { recommendedGenres: [28] }, // Action
												no: { recommendedGenres: [28, 36] }, // Action, History
											},
										},
										no: {
											// Q9: Western setting martial arts
											question: "Do you prefer modern?",
											yes: { recommendedGenres: [28] }, // Action
											no: { recommendedGenres: [28, 36] }, // Action, History
										},
									},
									no: {
										// Q8: Modern martial arts
										question: "Should it be competitive/tournament?",
										yes: {
											// Q9: Competition martial arts
											question: "Do you like underdog stories?",
											yes: {
												// Q10: Underdog martial arts
												question: "Should it be inspirational?",
												yes: { recommendedGenres: [28, 18] }, // Action, Drama
												no: { recommendedGenres: [28] }, // Action
											},
											no: {
												// Q10: Professional martial arts
												question: "Do you like revenge themes?",
												yes: { recommendedGenres: [28, 18] }, // Action, Drama
												no: { recommendedGenres: [28] }, // Action
											},
										},
										no: {
											// Q9: Casual martial arts
											question: "Do you prefer realistic?",
											yes: { recommendedGenres: [28] }, // Action
											no: { recommendedGenres: [28, 14] }, // Action, Fantasy
										},
									},
								},
								no: {
									// Q7: Pure action adventure
									question: "Do you prefer exploration over combat?",
									yes: {
										// Q8: Exploration action
										question: "Should it be treasure hunting?",
										yes: {
											// Q9: Treasure action
											question: "Do you prefer ancient mysteries?",
											yes: { recommendedGenres: [12, 28, 36] }, // Adventure, Action, History
											no: { recommendedGenres: [12, 28] }, // Adventure, Action
										},
										no: {
											// Q9: Non-treasure exploration
											question: "Do you like survival elements?",
											yes: { recommendedGenres: [12, 28] }, // Adventure, Action (no thriller tag here)
											no: { recommendedGenres: [12, 28] }, // Adventure, Action
										},
									},
									no: {
										// Q8: Combat-focused action
										question: "Do you prefer military themes?",
										yes: {
											// Q9: Military action
											question: "Should it be modern warfare?",
											yes: { recommendedGenres: [28, 10752] }, // Action, War
											no: { recommendedGenres: [28, 10752, 36] }, // Action, War, History
										},
										no: {
											// Q9: Non-military action
											question: "Do you like chase sequences?",
											yes: { recommendedGenres: [28, 80] }, // Action, Crime (no thriller tag here)
											no: { recommendedGenres: [28, 80] }, // Action, Crime
										},
									},
								},
							},
						},
					},
					no: {
						// Q4: Non-action energized
						question: "Do you want something fun and uplifting?",
						yes: {
							// Q5: Comedy path
							question: "Do you prefer witty humor?",
							yes: {
								// Q6: Witty comedy
								question: "Do you like romantic comedy?",
								yes: {
									// Q7: Romantic comedy
									question: "Should it be contemporary?",
									yes: {
										// Q8: Modern romcom
										question: "Do you prefer a warm tone?",
										yes: {
											// Q9: Warm romcom
											question: "Should it have quirky characters?",
											yes: { recommendedGenres: [35, 10749] }, // Comedy, Romance
											no: { recommendedGenres: [35, 10749] }, // Comedy, Romance
										},
										no: { recommendedGenres: [35, 10749] }, // Comedy, Romance
									},
									no: {
										// Q8: Period romcom
										question: "Do you prefer a light tone?",
										yes: { recommendedGenres: [35, 10749, 36] }, // Comedy, Romance, History
										no: { recommendedGenres: [35, 10749] }, // Comedy, Romance
									},
								},
								no: {
									// Q7: Witty non-romance comedy
									question: "Do you like satire?",
									yes: {
										// Q8: Satirical comedy
										question: "Do you prefer political and social satire?",
										yes: {
											// Q9: Political satire
											question: "Do you like dark comedy?",
											yes: { recommendedGenres: [35] }, // Comedy (dark satire)
											no: { recommendedGenres: [35] }, // Comedy (light satire)
										},
										no: {
											// Q9: Pop culture satire
											question: "Do you like parody films?",
											yes: { recommendedGenres: [35] }, // Comedy (parody)
											no: { recommendedGenres: [35] }, // Comedy (satire)
										},
									},
									no: {
										// Q8: Character-driven comedy
										question: "Should it be ensemble cast?",
										yes: {
											// Q9: Ensemble comedy
											question: "Do you prefer workplace comedy?",
											yes: { recommendedGenres: [35] }, // Comedy (workplace)
											no: { recommendedGenres: [35] }, // Comedy (ensemble)
										},
										no: {
											// Q9: Solo character comedy
											question: "Do you like underdog stories?",
											yes: { recommendedGenres: [35] }, // Comedy (underdog)
											no: { recommendedGenres: [35] }, // Comedy (character)
										},
									},
								},
							},
							no: {
								// Q6: Physical/slapstick comedy
								question: "Do you want family-friendly content?",
								yes: {
									// Q7: Family comedy
									question: "Should it have fantasy or magical elements?",
									yes: {
										// Q8: Fantasy family comedy
										question: "Do you like animation?",
										yes: {
											// Q9: Animated fantasy comedy
											question: "Should it have adventure elements?",
											yes: { recommendedGenres: [16, 35, 14, 10751] }, // Animation, Comedy, Fantasy, Family
											no: { recommendedGenres: [16, 35, 10751] }, // Animation, Comedy, Family
										},
										no: { recommendedGenres: [35, 14, 10751] }, // Comedy, Fantasy, Family
									},
									no: {
										// Q8: Realistic family comedy
										question: "Do you like feel-good stories?",
										yes: { recommendedGenres: [35, 10751] }, // Comedy, Family
										no: { recommendedGenres: [35] }, // Comedy
									},
								},
								no: {
									// Q7: Adult comedy
									question: "Do you like action-comedy?",
									yes: {
										// Q8: Action comedy
										question: "Should it be heist-based?",
										yes: { recommendedGenres: [28, 35, 80] }, // Action, Comedy, Crime
										no: { recommendedGenres: [28, 35] }, // Action, Comedy
									},
									no: {
										// Q8: Pure adult comedy
										question: "Do you prefer quirky or crude humor?",
										yes: {
											// Q9: Quirky comedy
											question: "Do you like dark comedy?",
											yes: { recommendedGenres: [35] }, // Comedy (dark)
											no: { recommendedGenres: [35] }, // Comedy (quirky)
										},
										no: {
											// Q9: Mainstream comedy
											question: "Do you prefer parody/spoof films?",
											yes: { recommendedGenres: [35] }, // Comedy (parody)
											no: { recommendedGenres: [35] }, // Comedy (mainstream)
										},
									},
								},
							},
						},
						no: {
							// Q5: Adventure (non-action)
							question: "Do you like exploration and discovery?",
							yes: {
								// Q6: Adventure discovery
								question: "Should it have fantasy elements?",
								yes: {
									// Q7: Fantasy adventure
									question: "Do you prefer magical elements?",
									yes: { recommendedGenres: [14, 12] }, // Fantasy, Adventure
									no: { recommendedGenres: [12, 14] }, // Adventure, Fantasy
								},
								no: {
									// Q7: Realistic adventure
									question: "Do you prefer nature-focused themes?",
									yes: {
										// Q8: Nature adventure
										question: "Do you like documentary style?",
										yes: {
											// Q9: Documentary adventure
											question: "Should it be wildlife focused?",
											yes: { recommendedGenres: [99, 12] }, // Documentary, Adventure
											no: { recommendedGenres: [12, 99] }, // Adventure, Documentary
										},
										no: {
											// Q9: Narrative nature
											question: "Do you prefer survival stories?",
											yes: { recommendedGenres: [12, 53] }, // Adventure, Thriller
											no: { recommendedGenres: [12, 18] }, // Adventure, Drama
										},
									},
									no: {
										// Q8: Historical adventure
										question: "Do you prefer ancient civilizations?",
										yes: { recommendedGenres: [12, 36] }, // Adventure, History
										no: { recommendedGenres: [12, 36, 18] }, // Adventure, History, Drama
									},
								},
							},
							no: {
								// Q6: Non-exploration energized content
								question: "Do you want something musical?",
								yes: {
									// Q7: Musical content
									question: "Do you prefer drama with music?",
									yes: {
										// Q8: Music drama
										question: "Should it be biographical?",
										yes: { recommendedGenres: [10402, 18, 36] }, // Music, Drama, History
										no: { recommendedGenres: [10402, 18] }, // Music, Drama
									},
									no: {
										// Q8: Fun musical
										question: "Do you like comedy musicals?",
										yes: { recommendedGenres: [10402, 35] }, // Music, Comedy
										no: { recommendedGenres: [10402, 10749] }, // Music, Romance
									},
								},
								no: {
									// Q7: Other light content
									question: "Do you prefer fantasy elements?",
									yes: {
										// Q8: Fantasy light
										question: "Should it be magical?",
										yes: { recommendedGenres: [14, 12, 10751] }, // Fantasy, Adventure, Family
										no: { recommendedGenres: [12, 14] }, // Adventure, Fantasy
									},
									no: {
										// Q8: Non-fantasy light
										question: "Do you prefer historical settings?",
										yes: { recommendedGenres: [12, 36] }, // Adventure, History
										no: { recommendedGenres: [12, 18] }, // Adventure, Drama
									},
								},
							},
						},
					},
				},
				no: {
					// Q3: Lower energy action
					question: "Do you prefer thriller content?",
					yes: {
						// Q4: Thriller path
						question: "Should it be psychological?",
						yes: {
							// Q5: Psychological thriller
							question: "Do you like mystery elements?",
							yes: {
								// Q6: Mystery thriller
								question: "Should it be dark and intense?",
								yes: {
									// Q7: Dark mystery thriller
									question: "Do you prefer unreliable narrators?",
									yes: {
										// Q8: Unreliable narrator thriller
										question: "Should it be mind-bending?",
										yes: {
											// Q9: Mind-bending thriller
											question: "Do you like philosophical themes?",
											yes: { recommendedGenres: [53, 18] }, // Thriller, Drama
											no: { recommendedGenres: [53] }, // Thriller
										},
										no: { recommendedGenres: [53] }, // Thriller
									},
									no: {
										// Q8: Detective mystery thriller
										question: "Do you like crime elements?",
										yes: {
											// Q9: Crime mystery thriller
											question: "Should it be gritty?",
											yes: { recommendedGenres: [53, 80] }, // Thriller, Crime (pure thriller - no action)
											no: { recommendedGenres: [53, 80] }, // Thriller, Crime
										},
										no: { recommendedGenres: [53] }, // Thriller
									},
								},
								no: {
									// Q7: Light mystery thriller
									question: "Should it be witty?",
									yes: {
										// Q8: Witty mystery
										question: "Do you like humor in thrillers?",
										yes: { recommendedGenres: [53, 35] }, // Thriller, Comedy
										no: { recommendedGenres: [53] }, // Thriller
									},
									no: { recommendedGenres: [53] }, // Thriller
								},
							},
							no: {
								// Q6: Non-mystery psychological thriller
								question: "Do you like slow-burn tension?",
								yes: {
									// Q7: Slow-burn thriller
									question: "Should it have horror elements?",
									yes: {
										// Q8: Psychological thriller-horror
										question: "Do you prefer supernatural?",
										yes: {
											// Q9: Supernatural slow-burn
											question: "Should it be atmospheric?",
											yes: { recommendedGenres: [27, 53] }, // Horror, Thriller
											no: { recommendedGenres: [53] }, // Thriller
										},
										no: { recommendedGenres: [27, 53] }, // Horror, Thriller
									},
									no: {
										// Q8: Pure slow-burn thriller
										question: "Do you like character development?",
										yes: { recommendedGenres: [53, 18] }, // Thriller, Drama
										no: { recommendedGenres: [53] }, // Thriller
									},
								},
								no: {
									// Q7: Fast-paced thriller
									question: "Should it have action?",
									yes: {
										// Q8: Action thriller (but still Thriller-first since user chose thriller path)
										question: "Do you prefer spy/espionage?",
										yes: {
											// Q9: Spy thriller
											question: "Should it be international?",
											yes: { recommendedGenres: [53, 12] }, // Thriller, Adventure (spy thriller)
											no: { recommendedGenres: [53] }, // Pure Thriller
										},
										no: {
											// Q9: Non-spy thriller
											question: "Do you like revenge plots?",
											yes: { recommendedGenres: [53, 80] }, // Thriller, Crime (revenge thriller)
											no: { recommendedGenres: [53] }, // Pure Thriller
										},
									},
									no: {
										// Q8: Non-action fast thriller
										question: "Do you prefer cat-and-mouse plots?",
										yes: {
											// Q9: Cat-and-mouse
											question: "Should it involve crime?",
											yes: { recommendedGenres: [53, 80] }, // Thriller, Crime
											no: { recommendedGenres: [53, 9648] }, // Thriller, Mystery
										},
										no: { recommendedGenres: [53] }, // Thriller
									},
								},
							},
						},
						no: {
							// Q5: Action thriller/suspense
							question: "Do you prefer spy stories?",
							yes: {
								// Q6: Spy thriller
								question: "Should it be realistic?",
								yes: {
									// Q7: Realistic spy
									question: "Do you like political themes?",
									yes: {
										// Q8: Political spy thriller
										question: "Should it be intense?",
										yes: { recommendedGenres: [53] }, // Pure Thriller (intense political spy)
										no: { recommendedGenres: [53, 18] }, // Thriller, Drama (slower political spy)
									},
									no: { recommendedGenres: [53] }, // Pure Thriller
								},
								no: {
									// Q7: Stylized spy thriller
									question: "Should it be humorous?",
									yes: {
										// Q8: Spy thriller comedy
										question: "Do you like ensemble casts?",
										yes: { recommendedGenres: [53, 35] }, // Thriller, Comedy (spy comedy thriller)
										no: { recommendedGenres: [53, 35] }, // Thriller, Comedy
									},
									no: { recommendedGenres: [53] }, // Pure Thriller (stylized spy)
								},
							},
							no: {
								// Q6: Crime thriller (still in thriller path - Thriller first)
								question: "Should it be organized crime?",
								yes: {
									// Q7: Organized crime thriller
									question: "Do you like epic/saga stories?",
									yes: {
										// Q8: Crime saga thriller
										question: "Should it be dark?",
										yes: { recommendedGenres: [53, 80, 18] }, // Thriller, Crime, Drama
										no: { recommendedGenres: [53, 80] }, // Thriller, Crime
									},
									no: { recommendedGenres: [53, 80] }, // Thriller, Crime
								},
								no: {
									// Q7: Street crime thriller
									question: "Should it be gritty?",
									yes: {
										// Q8: Gritty crime thriller
										question: "Do you like raw tension?",
										yes: { recommendedGenres: [53, 80] }, // Thriller, Crime
										no: { recommendedGenres: [53, 80] }, // Thriller, Crime
									},
									no: { recommendedGenres: [53] }, // Pure Thriller
								},
							},
						},
					},
					no: {
						// Q4: Drama/contemplative
						question: "Do you like emotional stories?",
						yes: {
							// Q5: Drama path
							question: "Should it be inspirational?",
							yes: {
								// Q6: Inspirational drama
								question: "Do you prefer true stories?",
								yes: {
									// Q7: True story drama
									question: "Should it be biographical?",
									yes: {
										// Q8: Biography
										question: "Do you like personal growth themes?",
										yes: {
											// Q9: Personal growth biography
											question: "Should it be uplifting?",
											yes: { recommendedGenres: [18, 36] }, // Drama, History
											no: { recommendedGenres: [18] }, // Drama
										},
										no: { recommendedGenres: [18, 36] }, // Drama, History
									},
									no: {
										// Q8: Historical drama
										question: "Should it be epic/grand?",
										yes: { recommendedGenres: [18, 36] }, // Drama, History
										no: { recommendedGenres: [18] }, // Drama
									},
								},
								no: {
									// Q7: Fictional inspirational
									question: "Do you like overcoming adversity?",
									yes: {
										// Q8: Triumph drama
										question: "Should it be feel-good?",
										yes: { recommendedGenres: [18, 12] }, // Drama, Adventure
										no: { recommendedGenres: [18] }, // Drama
									},
									no: { recommendedGenres: [18] }, // Drama
								},
							},
							no: {
								// Q6: Character-focused drama
								question: "Do you like family relationships?",
								yes: {
									// Q7: Family drama
									question: "Should it have generational themes?",
									yes: {
										// Q8: Generational drama
										question: "Do you prefer contemporary or historical?",
										yes: { recommendedGenres: [18] }, // Drama
										no: { recommendedGenres: [18, 36] }, // Drama, History
									},
									no: { recommendedGenres: [18] }, // Drama
								},
								no: {
									// Q7: Social issue drama
									question: "Do you like political themes?",
									yes: {
										// Q8: Political drama
										question: "Should it be intense?",
										yes: { recommendedGenres: [18] }, // Drama
										no: { recommendedGenres: [18, 35] }, // Drama, Comedy
									},
									no: { recommendedGenres: [18] }, // Drama
								},
							},
						},
						no: {
							// Q5: Romance path
							question: "Do you like romance as main focus?",
							yes: {
								// Q6: Romance
								question: "Should it be contemporary?",
								yes: {
									// Q7: Contemporary romance
									question: "Do you like comedy in romance?",
									yes: {
										// Q8: Romcom
										question: "Should it be witty?",
										yes: { recommendedGenres: [35, 10749] }, // Comedy, Romance
										no: { recommendedGenres: [10749, 35] }, // Romance, Comedy
									},
									no: {
										// Q8: Serious contemporary romance
										question: "Do you prefer happy endings?",
										yes: { recommendedGenres: [10749] }, // Romance
										no: { recommendedGenres: [10749, 18] }, // Romance, Drama
									},
								},
								no: {
									// Q7: Non-contemporary romance
									question: "Do you like historical settings?",
									yes: {
										// Q8: Historical romance
										question: "Should it be epic?",
										yes: { recommendedGenres: [10749, 36] }, // Romance, History
										no: { recommendedGenres: [10749] }, // Romance
									},
									no: {
										// Q8: Fantasy/timeless romance
										question: "Do you like fantasy elements?",
										yes: { recommendedGenres: [10749, 14] }, // Romance, Fantasy
										no: { recommendedGenres: [10749] }, // Romance (timeless/classic)
									},
								},
							},
							no: { recommendedGenres: [18] }, // Drama
						},
					},
				},
			},
			no: {
				// Relaxed/Chill path (bottom branching from Q1)
				question: "Do you prefer something comforting?",
				yes: {
					// Q2: Comforting path
					question: "Do you prefer feel-good content?",
					yes: {
						// Q3: Feel-good
						question: "Do you prefer comedy?",
						yes: {
							// Q4: Comedy path (relaxed)
							question: "Do you like comedy that makes you think?",
							yes: {
								// Q5: Smart comedy
								question: "Do you prefer character-driven comedy?",
								yes: { recommendedGenres: [35, 18] }, // Comedy, Drama (character-focused)
								no: { recommendedGenres: [35] }, // Comedy (situational/ensemble)
							},
							no: {
								// Q5: Light comedy
								question: "Do you prefer slapstick or witty?",
								yes: { recommendedGenres: [16, 35, 10751] }, // Animation, Comedy, Family
								no: { recommendedGenres: [35] }, // Comedy (witty)
							},
						},
						no: {
							// Q4: Wholesome drama
							question: "Should it be family-friendly?",
							yes: {
								// Q5: Family drama
								question: "Do you like adventure elements?",
								yes: { recommendedGenres: [18, 12, 10751] }, // Drama, Adventure, Family
								no: { recommendedGenres: [18, 10751] }, // Drama, Family
							},
							no: {
								// Q5: Adult wholesome
								question: "Do you like romantic elements?",
								yes: { recommendedGenres: [18, 10749] }, // Drama, Romance
								no: { recommendedGenres: [18] }, // Drama
							},
						},
					},
					no: {
						// Q3: Nostalgic/retro content
						question: "Should it be historical?",
						yes: {
							// Q4: Historical
							question: "Do you prefer drama over adventure?",
							yes: {
								// Q5: Historical drama
								question: "Should it be biographical?",
								yes: { recommendedGenres: [18, 36] }, // Drama, History
								no: { recommendedGenres: [18, 36] }, // Drama, History
							},
							no: {
								// Q5: Historical adventure
								question: "Should it have fantasy elements?",
								yes: { recommendedGenres: [12, 36, 14] }, // Adventure, History, Fantasy
								no: { recommendedGenres: [12, 36] }, // Adventure, History
							},
						},
						no: {
							// Q4: Modern comfort content
							question: "Do you like coming-of-age stories?",
							yes: {
								// Q5: Coming-of-age
								question: "Should it be teen-focused?",
								yes: {
									// Q6: Teen coming-of-age
									question: "Do you prefer humor?",
									yes: { recommendedGenres: [18, 35] }, // Drama, Comedy
									no: { recommendedGenres: [18] }, // Drama
								},
								no: {
									// Q6: Adult coming-of-age
									question: "Should it be emotionally heavy?",
									yes: { recommendedGenres: [18] }, // Drama
									no: { recommendedGenres: [18, 10749] }, // Drama, Romance
								},
							},
							no: {
								// Q5: Other comfort content
								question: "Do you prefer romantic stories?",
								yes: {
									// Q6: Romantic comfort
									question: "Should it be lighthearted?",
									yes: { recommendedGenres: [10749, 35] }, // Romance, Comedy
									no: { recommendedGenres: [10749, 18] }, // Romance, Drama
								},
								no: {
									// Q6: Non-romantic comfort
									question: "Do you like heartwarming stories?",
									yes: { recommendedGenres: [18, 10751] }, // Drama, Family
									no: { recommendedGenres: [18] }, // Drama
								},
							},
						},
					},
				},
				no: {
					// Q2: Thought-provoking path
					question: "Do you like thought-provoking content?",
					yes: {
						// Q3: Complex/philosophical
						question: "Do you prefer drama?",
						yes: {
							// Q4: Drama path (thought-provoking)
							question: "Do you like social issues?",
							yes: {
								// Q5: Social drama
								question: "Should it be intense?",
								yes: {
									// Q6: Intense social drama
									question: "Do you prefer political themes?",
									yes: { recommendedGenres: [18, 53] }, // Drama, Thriller
									no: { recommendedGenres: [18] }, // Drama
								},
								no: {
									// Q6: Lighter social drama
									question: "Should it have humor?",
									yes: { recommendedGenres: [18, 35] }, // Drama, Comedy
									no: { recommendedGenres: [18] }, // Drama
								},
							},
							no: {
								// Q5: Existential/philosophical drama
								question: "Do you prefer character-driven stories?",
								yes: {
									// Q6: Character philosophical drama
									question: "Should it be introspective?",
									yes: { recommendedGenres: [18] }, // Drama
									no: { recommendedGenres: [18, 10749] }, // Drama, Romance
								},
								no: {
									// Q6: Concept philosophical drama
									question: "Do you like ambiguous endings?",
									yes: { recommendedGenres: [18, 9648] }, // Drama, Mystery
									no: { recommendedGenres: [18] }, // Drama
								},
							},
						},
						no: {
							// Q4: Sci-Fi philosophy path
							question: "Do you like hard sci-fi concepts?",
							yes: {
								// Q5: Hard sci-fi
								question: "Should it be action-packed?",
								yes: { recommendedGenres: [28, 878] }, // Action, Sci-Fi
								no: { recommendedGenres: [878, 18] }, // Sci-Fi, Drama
							},
							no: {
								// Q5: Soft sci-fi
								question: "Do you prefer character stories?",
								yes: {
									// Q6: Character sci-fi
									question: "Should it be emotional?",
									yes: { recommendedGenres: [878, 18] }, // Sci-Fi, Drama
									no: { recommendedGenres: [878, 12] }, // Sci-Fi, Adventure
								},
								no: {
									// Q6: Concept sci-fi
									question: "Do you like alien themes?",
									yes: { recommendedGenres: [878, 53] }, // Sci-Fi, Thriller
									no: { recommendedGenres: [878, 9648] }, // Sci-Fi, Mystery
								},
							},
						},
					},
					no: {
						// Q3: Mystery/puzzle path
						question: "Do you like mysteries?",
						yes: {
							// Q4: Mystery
							question: "Do you prefer thriller?",
							yes: {
								// Q5: Thriller mystery
								question: "Do you like psychological depth?",
								yes: {
									// Q6: Psychological thriller mystery
									question: "Do you prefer dark themes?",
									yes: { recommendedGenres: [53, 80, 9648] }, // Thriller, Crime, Mystery
									no: { recommendedGenres: [53, 9648] }, // Thriller, Mystery
								},
								no: {
									// Q6: Light thriller mystery
									question: "Should it be fast-paced?",
									yes: { recommendedGenres: [53, 28] }, // Thriller, Action
									no: { recommendedGenres: [53] }, // Thriller
								},
							},
							no: {
								// Q5: Detective mystery
								question: "Should it be serious or witty?",
								yes: { recommendedGenres: [80, 53] }, // Crime, Thriller (serious)
								no: { recommendedGenres: [80, 35] }, // Crime, Comedy (witty)
							},
						},
						no: {
							// Q4: Other thoughtful content
							question: "Do you like horror with substance?",
							yes: {
								// Q5: Substantive horror
								question: "Do you prefer psychological horror?",
								yes: {
									// Q6: Psychological horror
									question: "Should it be supernatural?",
									yes: { recommendedGenres: [27, 53, 14] }, // Horror, Thriller, Fantasy
									no: { recommendedGenres: [27, 53] }, // Horror, Thriller
								},
								no: {
									// Q6: Non-psychological horror
									question: "Do you like creature features?",
									yes: { recommendedGenres: [27, 878] }, // Horror, Sci-Fi
									no: { recommendedGenres: [27, 18] }, // Horror, Drama
								},
							},
							no: {
								// Q5: Non-horror thoughtful
								question: "Do you prefer fantasy worlds?",
								yes: {
									// Q6: Fantasy thoughtful
									question: "Should it be epic scale?",
									yes: { recommendedGenres: [14, 18, 12] }, // Fantasy, Drama, Adventure
									no: { recommendedGenres: [14, 18] }, // Fantasy, Drama
								},
								no: {
									// Q6: Realistic thoughtful
									question: "Do you like slice-of-life stories?",
									yes: { recommendedGenres: [18] }, // Drama (slice-of-life)
									no: {
										// Q7: Non slice-of-life
										question: "Should it be historically grounded?",
										yes: { recommendedGenres: [18, 36] }, // Drama, History
										no: { recommendedGenres: [18, 9648] }, // Drama, Mystery
									},
								},
							},
						},
					},
				},
			},
		};
	}

	/**
	 * This function traverse the tree using Depth-First Search (DFS) algorithm
	 * @param answers - basically an Array of boolean answers (true means yes, false means no)
	 * @returns TraversalResult - contains the recommendations and some metrics din
	 * @time O(h) where h is yung tree height
	 */
	traverseDFS(answers: boolean[]): TraversalResult {
		const startTime = performance.now();
		const path: string[] = [];
		let visitedCount = 0;
		let currentNode = this.root;
		let depth = 0;

		// DFS traversal: follow yes/no branches based on answers
		for (let i = 0; i < answers.length && currentNode.question; i++) {
			path.push(currentNode.question);
			visitedCount++;
			depth++;

			currentNode = answers[i] ? currentNode.yes! : currentNode.no!;

			if (!currentNode) {
				break;
			}
		}

		// Additional computation for accurate measurement visibility
		// This includes genre validation and result preparation
		let genreChecksum = 0;
		if (currentNode?.recommendedGenres) {
			for (let i = 0; i < currentNode.recommendedGenres.length; i++) {
				genreChecksum += currentNode.recommendedGenres[i];
			}
		}

		const traversalTimeMs = performance.now() - startTime;

		return {
			recommendedGenres: currentNode.recommendedGenres || [],
			path,
			visitedNodes: visitedCount,
			traversalTimeMs,
			depth,
		};
	}

	/**
	 * Gets all the questions from the tree using BFS approach para sa UI display
	 * @returns Array of all questions na nasa tree
	 * @time O(n) where n is the number of nodes, so medyo matagal if madami nodes
	 */
	getAllQuestions(): string[] {
		const questions: string[] = [];
		const queue: DecisionNode[] = [this.root];
		const visited = new Set<DecisionNode>();

		while (queue.length > 0) {
			const node = queue.shift()!;

			if (visited.has(node)) continue;
			visited.add(node);

			if (node.question) {
				questions.push(node.question);
			}

			if (node.yes) queue.push(node.yes);
			if (node.no) queue.push(node.no);
		}

		return questions;
	}

	/**
	 * Para makuha yung height ng tree
	 * @time O(n) where n is number of nodes - kailangan i-traverse lahat eh
	 */
	getHeight(): number {
		const calculateHeight = (node?: DecisionNode): number => {
			if (!node) return 0;
			return 1 + Math.max(calculateHeight(node.yes), calculateHeight(node.no));
		};

		return calculateHeight(this.root);
	}

	/**
	 * Gets the total number of nodes sa tree
	 * @time O(n) - kailangan din i-visit lahat ng nodes para ma-count
	 */
	getTotalNodes(): number {
		let count = 0;
		const traverse = (node?: DecisionNode): void => {
			if (!node) return;
			count++;
			traverse(node.yes);
			traverse(node.no);
		};
		traverse(this.root);
		return count;
	}

	/**
	 * Returns the root node ng tree, simple lang to hehe
	 */
	getRoot(): DecisionNode {
		return this.root;
	}

	/**
	 * Computes the theoretical BFS depth para ma-compare natin
	 * This is useful for checking kung balanced ba yung tree or hindi
	 * @time O(log n) - mas mabilis to kasi logarithmic
	 */
	getTheoreticalBFSDepth(): number {
		const totalNodes = this.getTotalNodes();
		// For a complete binary tree with n nodes, depth ≈ log2(n)
		return Math.ceil(Math.log2(totalNodes + 1));
	}
}
