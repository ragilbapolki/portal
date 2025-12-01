import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://172.27.8.252:8080",
  // url: "http://localhost:8080",
  realm: "company-app",
  // realm: "company-apps",
  clientId: "portal-app",
});

export default keycloak;
