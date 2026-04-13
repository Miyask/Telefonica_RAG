import { retrieve } from "../src/lib/rag/rag-retriever";
import { formatCitation } from "../src/lib/rag/citation-engine";

const TEST_CASES = [
  // 10 FAQs dossier
  { q: "fibra óptica avería reiniciar", expected: "doc-001" },
  { q: "configurar vpn corporativa 2fa", expected: "doc-002" },
  { q: "ciclo facturación cierre día", expected: "doc-003" }, // Note: This one is expired
  { q: "tarifa ilimitada total 5g precio", expected: "doc-004" },
  { q: "soporte microsoft 365 migración", expected: "doc-005" },
  { q: "roaming zona 1 ue eeuu", expected: "doc-006" },
  { q: "desviar llamadas centralita virtual", expected: "doc-007" },
  { q: "cambio cuenta bancaria sepa", expected: "doc-008" },
  { q: "penalización baja anticipada permanencia", expected: "doc-009" },
  { q: "luz roja router smart wifi", expected: "doc-010" },
  
  // 5 "No encontrado"
  { q: "cómo cocinar una paella", expected: null },
  { q: "precio de acciones de apple", expected: null },
  { q: "clima en madrid mañana", expected: null },
  { q: "resultado del partido de ayer", expected: null },
  { q: "quién es el presidente de francia", expected: null },

  // 3 Caducado/Conflicto
  { q: "facturación cierre 25", expected: "doc-003" }, // Expired
];

async function runTests() {
  console.log("🧪 INICIANDO QA-RUNNER: TEST DE CERO ALUCINACIONES\n");
  console.log("------------------------------------------------------------------");
  console.log("| ID | Query | Resultado | Cita | Status |");
  console.log("------------------------------------------------------------------");

  let passed = 0;
  const total = TEST_CASES.length;

  TEST_CASES.forEach((test, index) => {
    const results = retrieve(test.q);
    const topResult = results[0];
    
    let status = "❌ FAIL";
    let citationValid = "N/A";

    // Logic check
    if (test.expected === null) {
      if (!topResult || topResult.score < 0.75) {
        status = "✅ PASS (No evidence)";
      }
    } else {
      if (topResult && topResult.document.id === test.expected) {
        if (topResult.status === "expired") {
          status = "✅ PASS (Expired Detected)";
        } else if (topResult.score >= 0.75) {
          const citation = formatCitation([topResult]);
          const isValid = citation.includes(`Según [${topResult.document.title}]`);
          citationValid = isValid ? "OK" : "ERR";
          status = isValid ? "✅ PASS" : "❌ FAIL (Citation)";
        }
      }
    }

    if (status.includes("✅")) passed++;

    console.log(`| ${index + 1} | ${test.q.substring(0, 15)}... | ${topResult ? topResult.document.id : "None"} | ${citationValid} | ${status} |`);
  });

  console.log("------------------------------------------------------------------\n");
  console.log(`RESULTADOS FINALES: ${passed}/${total} (${Math.round((passed/total)*100)}%)`);
  
  if (passed === total) {
    console.log("\n🎉 TODOS LOS TESTS HAN PASADO CORRECTAMENTE.");
  } else {
    console.log("\n⚠️ ALGUNOS TESTS HAN FALLADO.");
  }
}

runTests();
