import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p className="read-the-docs text-4xl">
        Click on the Vite and React logos to learn more
      </p>

      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button variant="outline">Button</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon />
        </Button>
      </div>
    </>
  );
}

export default App;
