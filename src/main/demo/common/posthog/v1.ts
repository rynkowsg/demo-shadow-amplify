import { posthog } from "posthog-js";
import { printLog } from "../printer";

export const nativeInit = async () => {
  try {
    printLog("[POSTHOG1] Init...")
    posthog.init("fake", {
      api_host: "fake"
    });
    printLog("[POSTHOG1] Init...DONE")
  } catch (err) {
    printLog("[POSTHOG1] ERROR", err);
  }
};

export const nativeCapture = (evt, props) => {
  try {
    console.log("[POSTHOG] Capture...")
    posthog.capture(evt, props);
    console.log("[POSTHOG] Capture... DONE")
  } catch (err) {
    console.log("[POSTHOG] ERROR", err);
  }
};
