/* eslint-disable */
const stage = () => {
  const url = window.location.hostname;
  switch (url) {
    case "jaidee.3utilities.com":
      return "dev";
    case "localhost":
      return "local";
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
      return "https://jaidee.3utilities.com/backend";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
};
export default baseUrl;
