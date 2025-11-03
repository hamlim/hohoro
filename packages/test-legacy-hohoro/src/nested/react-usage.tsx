import { useState } from "react";

import type { JSX } from "react/jsx-runtime";

export function Counter(): JSX.Element {
  let [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
