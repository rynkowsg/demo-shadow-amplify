(ns demo.core
  (:require
    ["aws-amplify" :default Amplify :refer [Auth Hub]]
    [demo.config :as config]
    [oops.core :refer [oapply ocall oget oset!]]
    [reagent.dom :as r-dom]))

(defn root-component []
  [:div
   [:p "I am a component!"]
   [:p.someclass
    "I have " [:strong "bold"]
    [:span {:style {:color "red"}} " and red "] "text."]])


(defn mount-root []
  (js/console.log "Rendering...")
  (r-dom/render [root-component] (.getElementById js/document "app"))
  (js/console.log "Rendering... DONE"))

(defn ^:after-load re-render
  []
  (mount-root))

(defn init-amplify
  []
  ;; Configure Amplify
  (ocall
    Amplify
    :configure
    (clj->js {:identityPoolId                 config/identity-pool-id
              :region                         "eu-west-1"
              :userPoolId                     config/user-pool-id
              :userPoolWebClientId            config/user-pool-web-client-id
              :aws_appsync_graphqlEndpoint    config/aws-appsync-graphql-endpoint
              :aws_appsync_region             "eu-west-1"
              :aws_appsync_authenticationType "AMAZON_COGNITO_USER_POOLS"
              :aws_appsync_apiKey             config/aws-appsync-api-key}))

  ;; Configure Amplify.Auth
  (ocall
    Auth
    :configure
    (clj->js {:oauth {:redirectSignIn  (str config/app-url "/sso/callback")
                      :redirectSignOut (str config/app-url "/sso/signout")
                      :domain          config/cognito-domain
                      :responseType    "code"
                      :scope           ["aws.cognito.signin.user.admin" "email" "openid" "phone" "profile"]}}))

  (ocall Hub :listen "auth" (fn [message]
                              (let [{:keys [channel payload]}    (-> message (js->clj :keywordize-keys true))
                                    {:keys [event data message]} payload]
                                (when (and
                                        (= "auth" channel)
                                        (= "customOAuthState" event))
                                  (do #_(dispatch [::ident/federated-sign-in-success {:redirect-url data}])
                                    :nothing))
                                ;; External provider false error
                                (when (and (= event "signIn_failure") (= message "The OAuth response flow failed"))
                                  ;; Even though we get a failure, the accounts were actually linked. To know where
                                  ;; to redirect the user to, the pre-sign-up cognito lambda returns the org as an
                                  ;; error message. We can't control the format of the message so some regexing is
                                  ;; needed. See the `comment` block below for an example.
                                  #_(let [org  (nth (re-find #"LINKED_EXTERNAL_USER_(\w+)\.\+" (.-message data)) 1)
                                          path (or (routes/get-sso-callback-path {:remove-from-storage? true}) (str "/org/" org "/user/login"))]
                                      (dispatch [:demo.login/add-alert
                                                 {:msg  "Accounts linked, please sign in using Single Sign On."
                                                  ;; We can't use the routes helper functions for reasons that are
                                                  ;; beyond my comprehension.
                                                  :path path}])))))))

(defn ^:export init []
  (js/console.log "HELLO")
  (init-amplify)
  (mount-root))
