(ns demo.common.posthog.posthog
  (:require
    ["/demo/common/posthog/v1" :refer [nativeInit nativeCapture]]))

(defn init []
  (nativeInit))

(defn capture [evt props]
  (nativeCapture evt (clj->js props)))
