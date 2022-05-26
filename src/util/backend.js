/* eslint-disable */
const stage = () => {
  const url = window.location.hostname;
  switch (url) {
    case "localhost":
      return "local";
    case "yenjai.3utilities.com":
      return "dev";
    default:
      return null;
  }
};
export const baseUrl = () => {
  switch (stage()) {
    case "production":
      return "";
    case "uat":
      return "";
    case "dev":
      return "yenjai.3utilities.com";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
};
export default baseUrl;
