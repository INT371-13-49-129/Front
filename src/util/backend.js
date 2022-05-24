/* eslint-disable */
const stage = () => {
  const url = window.location.hostname;
  switch (url) {
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
      return "";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
};
export default baseUrl;
