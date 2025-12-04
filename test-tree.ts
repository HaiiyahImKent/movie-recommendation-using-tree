// Test file para i-verify yung Decision Tree recommendations
import { DecisionTree } from "./src/data-structures/DecisionTree";

const tree = new DecisionTree();
const genreMap: Record<number, string> = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Sci-Fi",
	53: "Thriller",
	10752: "War",
	37: "Western",
};

function testPath(name: string, answers: boolean[]) {
	const result = tree.traverseDFS(answers);
	const genres = result.recommendedGenres.map((id) => genreMap[id] || id).join(", ");
	console.log("\n=== " + name + " ===");
	console.log("Questions answered:", result.path.join(" -> "));
	console.log("Depth:", result.depth);
	console.log("Recommended Genres:", genres);
	return result;
}

console.log("🎬 CinePath Decision Tree Test\n");
console.log("Tree Stats:");
console.log("Total Nodes:", tree.getTotalNodes());
console.log("Tree Height:", tree.getHeight());

// Test 1: User wants PURE COMEDY (no romance)
testPath("Pure Comedy (NO romance) - Should get Comedy genres", [
	false, // Q1: NOT energized -> relaxed mood
	true, // Q2: comforting? YES
	true, // Q3: feel-good? YES
	true, // Q4: comedy? YES
	false, // Q5: comedy that makes you think? NO (light comedy)
	false, // Q6: slapstick? NO (should give witty comedy)
]);

// Test 2: Action sci-fi path
testPath("Action Sci-Fi - Should get Action/Sci-Fi", [
	true, // Q1: energized? YES -> action mood
	true, // Q2: high-energy action? YES
	true, // Q3: superhero/fantasy? YES
	true, // Q4: sci-fi over fantasy? YES
	true, // Q5: dystopian? YES
	true, // Q6: dark and serious? YES
	true, // Q7: psychological? YES
	true, // Q8: mind-bending? YES
	true, // Q9: philosophical? YES
	true, // Q10: action sequences? YES
]);

// Test 3: Pure Drama - emotional but NOT romance focused
testPath("Emotional Drama - Should be Drama focused", [
	true, // Q1: energized? YES
	true, // Q2: high-energy? YES
	false, // Q3: superhero/fantasy? NO
	false, // Q4: fun uplifting? NO -> more serious
	false, // Q5: thriller? NO
	true, // Q6: emotional/character-driven? YES
	true, // Q7: inspirational/uplifting? YES
	true, // Q8: true stories? YES
	true, // Q9: biographical? YES
	true, // Q10: personal growth? YES
]);

// Test 4: Horror fan
testPath("Horror - Should get Horror genres", [
	false, // Q1: NOT energized -> dark mood
	false, // Q2: NOT comforting -> darker
	false, // Q3: NOT thought-provoking drama
	false, // Q4: NOT mysteries -> horror
	true, // Q5: horror with substance? YES
	true, // Q6: psychological horror? YES
]);

// Test 5: Romantic Comedy - this SHOULD have romance
testPath("Romantic Comedy - Should have Comedy + Romance", [
	false, // Q1: NOT energized
	true, // Q2: comforting? YES
	true, // Q3: feel-good? YES
	true, // Q4: comedy? YES
	true, // Q5: comedy that makes you think? YES
	true, // Q6: romantic element? YES -> romantic comedy
]);

// Test 6: Adventure without romance
testPath("Pure Adventure - Should be Adventure/Action", [
	true, // Q1: energized? YES
	true, // Q2: high-energy? YES
	false, // Q3: superhero? NO
	true, // Q4: fun uplifting? YES
	true, // Q5: witty humor? YES
	true, // Q6: clever? YES
	true, // Q7: adventure? YES
	true, // Q8: exotic? YES
	true, // Q9: treasure hunting? YES
	true, // Q10: historical settings? YES
]);

// Test 7: Thriller path
testPath("Thriller/Crime - Should get Thriller/Crime", [
	true, // Q1: energized? YES
	true, // Q2: high-energy? YES
	false, // Q3: superhero? NO
	false, // Q4: fun uplifting? NO
	true, // Q5: thriller? YES
	true, // Q6: crime/heist? YES
	true, // Q7: organized crime? YES
	true, // Q8: power struggles? YES
	true, // Q9: epic scale? YES
	true, // Q10: legacy themes? YES
]);

// Test 8: Musical
testPath("Musical - Should have Music genre", [
	true, // Q1: energized? YES
	true, // Q2: high-energy? YES
	false, // Q3: superhero? NO
	true, // Q4: fun uplifting? YES
	false, // Q5: witty humor? NO
	false, // Q6: family-friendly? NO
	false, // Q7: action-comedy? NO
	false, // Q8: exploration? NO
	true, // Q9: musical? YES
	true, // Q10: drama with music? YES
	false, // Q11: biographical? NO
]);

// Test 9: Documentary
testPath("Documentary - Should have Documentary", [
	false, // Q1: NOT energized
	false, // Q2: NOT comforting
	true, // Q3: thought-provoking? YES
	true, // Q4: real-world? YES
	true, // Q5: documentary? YES
	true, // Q6: social issues? YES
	true, // Q7: environmental? YES
	true, // Q8: climate? YES
]);

// Test 10: Family/Animation
testPath("Family Animation - Should have Animation/Family", [
	true, // Q1: energized? YES
	true, // Q2: high-energy? YES
	false, // Q3: superhero? NO
	true, // Q4: fun uplifting? YES
	false, // Q5: witty humor? NO
	true, // Q6: family-friendly? YES
	true, // Q7: animated? YES
	true, // Q8: emotional depth? YES
	true, // Q9: universal themes? YES
	true, // Q10: philosophical? YES
]);

console.log("\n\n✅ Test completed!");
