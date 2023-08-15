// import posthog from "posthog-js";

export const initPosthog = async () => {
  try {
    // posthog.init(apiKey, {
    //   api_host,
    // });
    console.log("[POSTHOG] Init")
  } catch (err) {
    console.log("[POSTHOG] ERROR", err);
  }
};
