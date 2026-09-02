import { useRoute } from "./router";
import { PageShell } from "./components/Layout";
import Home from "./pages/Home";
import Architecture from "./pages/Architecture";
import Dataset from "./pages/Dataset";
import Models from "./pages/Models";
import VpiCalculator from "./pages/VpiCalculator";
import Forecasting from "./pages/Forecasting";
import Inventory from "./pages/Inventory";
import Impact from "./pages/Impact";
import About from "./pages/About";
import { Button, Section } from "./components/ui";

function NotFound({ path }: { path: string }) {
  return (
    <Section className="py-24 text-center">
      <p className="eyebrow-light">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
        No page at <code className="font-mono text-accent-200">{path}</code>
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[14px] text-white/80">
        Use the navigation above, or head back to the overview.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button to="/">Back to Home</Button>
        <Button to="/vpi" variant="secondary">
          Open VPI Calculator
        </Button>
      </div>
    </Section>
  );
}

const PAGES: Record<string, () => React.ReactElement> = {
  "/": Home,
  "/architecture": Architecture,
  "/dataset": Dataset,
  "/models": Models,
  "/vpi": VpiCalculator,
  "/forecasting": Forecasting,
  "/inventory": Inventory,
  "/impact": Impact,
  "/about": About,
};

export default function App() {
  const path = useRoute();
  const Page = PAGES[path];

  return (
    <PageShell path={path}>{Page ? <Page /> : <NotFound path={path} />}</PageShell>
  );
}
