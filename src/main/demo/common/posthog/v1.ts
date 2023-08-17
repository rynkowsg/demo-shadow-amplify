import { posthog } from "posthog-js";
 import { printLog } from "../printer";

export const nativeInit = async () => {
  try {
    printLog("[printLog] Init...")
    posthog.init("fake", {
      api_host: "fake"
    });
    printLog("[printLog] Init...DONE")
  } catch (err) {
    printLog("[printLog] ERROR", err);
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
