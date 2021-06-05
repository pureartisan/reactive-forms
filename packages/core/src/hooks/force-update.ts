import { useState, useCallback } from "react";

export function useForceUpdate(): () => void {
  const [, setTick] = useState({});
  return useCallback(() => setTick({}), []);
}
