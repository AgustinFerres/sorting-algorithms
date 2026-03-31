// Represents the state of the array at each step during visualization
export interface SortStep {
  array: number[];
  comparing?: number[];   // Indices being compared (yellow)
  swapping?: number[];    // Indices being swapped (red)
  sorted?: number[];      // Indices that are in final position (green)
}

// Generator function type for step-by-step sorting
export type SortGenerator = Generator<SortStep, void, unknown>;

// Algorithm definition with metadata
export interface SortAlgorithm {
  name: string;
  sort: (arr: number[]) => SortGenerator;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  longDescription: string;
  howItWorks: string[];
  proTip: { title: string; text: string };
  spaceComplexityLabel: string;
  spaceComplexityDesc: string;
  implementations: { js: string };
}
