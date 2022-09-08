/* eslint-disable */
const stage = () => {
  const url = window.location.hostname;
  switch (url) {
    case "jaid.onthewifi.com":
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
      return "https://jaid.onthewifi.com/backend";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
};
export const baseUrlSocket = () => {
  switch (stage()) {
    case "production":
      return "";
    case "uat":
      return "";
    case "dev":
      return "https://jaid.onthewifi.com/";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
};
