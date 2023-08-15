import { posthog } from "posthog-js";

export const nativeInit = async () => {
  try {
    console.log("[POSTHOG] Init...")
    posthog.init("fake", {
      api_host: "fake"
    });
    console.log("[POSTHOG] Init...DONE")
  } catch (err) {
    console.log("[POSTHOG] ERROR", err);
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
