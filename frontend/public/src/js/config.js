// config.js
let baseUrl;

if (window.location.hostname.startsWith("100.")) {
  // Tailscale
  baseUrl = `http://${window.location.hostname}/ecoride-backend/api/`;
} else if (window.location.hostname === "dev.local2") {
  baseUrl = "http://dev.local2/ecoride-backend/api/";
} else {
  baseUrl = "http://dev.local/ecoride-backend/api/";
}

export { baseUrl };