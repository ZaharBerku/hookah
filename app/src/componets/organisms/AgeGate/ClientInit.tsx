"use client";

import { useLayoutEffect } from "react";

import { AGE_GATE_SCRIPT } from "./script";

// React does not run script tags it creates in the browser, so a layout mounted by client navigation starts the gate here.
const AgeGateClientInit = () => {
  useLayoutEffect(() => {
    const script = document.createElement("script");
    script.textContent = AGE_GATE_SCRIPT;
    document.head.appendChild(script).remove();
  }, []);
  return null;
};

export { AgeGateClientInit };
