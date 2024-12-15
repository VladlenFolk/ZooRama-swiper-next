import { useRef } from "react";

const useRenderCount = (componentName: string) => {
  const renderCount = useRef(1);

  // console.log(`${componentName} rendered ${renderCount.current} times`);
  renderCount.current += 1;
};

export default useRenderCount;
