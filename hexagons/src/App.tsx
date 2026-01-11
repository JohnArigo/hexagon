import Hexagon, { type HexagonFunction } from "./components/Hexagon";
import "./App.css";

const fakeFunctions: HexagonFunction[] = [
  {
    id: "core",
    title: "Command & Control (C2)",
    subtitle: "Operational decision authority",
    score: 4.6,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
    // military command / operations room
  },
  {
    id: "detect",
    title: "ISR",
    subtitle: "Intelligence, Surveillance & Reconnaissance",
    score: 3.7,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=1400&q=80",
    // drone / aerial surveillance
  },
  {
    id: "triage",
    title: "Threat Assessment",
    subtitle: "Risk evaluation & prioritization",
    score: 2.6,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
    // analyst / briefing
    // tactical planning / maps
  },
  {
    id: "explain",
    title: "Decision Support",
    subtitle: "Explainable operational insights",
    score: 1.5,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
    // analyst / data / briefing context
  },
  {
    id: "audit",
    title: "After-Action Review",
    subtitle: "Accountability & traceability",
    score: 3.3,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80", // briefing / review
    // briefing / review environment
  },
  {
    id: "scale",
    title: "Force Projection",
    subtitle: "Global operational reach",
    score: 4.2,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=1400&q=80",
    // aircraft carrier / power projection
  },
  {
    id: "protect",
    title: "Force Protection",
    subtitle: "Personnel & asset defense",
    score: 4.9,
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=1400&q=80",
    // soldiers / security posture
  },
];

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true" />

      <main className="app-content">
        <Hexagon
          functions={fakeFunctions}
          showLegend
          legendLabel="Threat score (1.0 low → 5.0 high)"
          onHexClick={(fn, index) => {
            console.log("Hex clicked:", fn.id, "at index", index);
          }}
        />
      </main>
    </div>
  );
}
