import { MOCK_KB, type Document } from "./kb-manager";

export interface RetrievalResult {
  document: Document;
  score: number;
  status: "valid" | "expired";
}

export function retrieve(query: string): RetrievalResult[] {
  const now = new Date();
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  
  if (queryTerms.length === 0) return [];

  const results = MOCK_KB.map(doc => {
    let score = 0;
    const docText = (doc.title + " " + doc.content + " " + doc.chunks.join(" ")).toLowerCase();
    
    // Simple keyword matching score
    queryTerms.forEach(term => {
      if (docText.includes(term)) {
        // More weight to title matches to reach 0.75 threshold easier
        if (doc.title.toLowerCase().includes(term)) {
          score += 0.5;
        } else {
          score += 0.25;
        }
      }
    });

    // Normalize score (simple cap for prototype)
    const finalScore = Math.min(score, 1.0);
    const expiry = new Date(doc.expiryDate);
    
    return {
      document: doc,
      score: finalScore,
      status: (expiry < now ? "expired" : "valid") as "expired" | "valid"
    };
  });

  // Sort by score and filter out zero scores
  return (results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)) as RetrievalResult[];
}
