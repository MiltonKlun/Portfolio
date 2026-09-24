import { lazy, Suspense, useEffect, useState } from "react";

const ShaderBackground = lazy(() => import("./effects/ShaderBackground"));

export function LandingBackground({
  chapter,
  paused,
}: {
  chapter: number;
  paused: boolean;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`landing-background composition-${chapter}`}
      aria-hidden="true"
    >
      {ready && (
        <Suspense fallback={null}>
          <ShaderBackground chapter={chapter} paused={paused} />
        </Suspense>
      )}
    </div>
  );
}
