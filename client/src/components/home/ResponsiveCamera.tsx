import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

function ResponsiveCamera() {
  const { setViewport } = useReactFlow();

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (w >= 1024) {
        // desktop → nodes right
        setViewport({ x: 400, y: 0, zoom: 1 }, { duration: 300 });
      } else if (w >= 768) {
        // tablet → centered
        setViewport({ x: 200, y: 100, zoom: 0.9 }, { duration: 300 });
      } else {
        // mobile → drop nodes down
        setViewport({ x: 0, y: 260, zoom: 0.85 }, { duration: 300 });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setViewport]);

  return null;
}

export default ResponsiveCamera;