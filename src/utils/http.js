const url = process.env.REACT_APP_SERVER_URL;
export const getServerUrl = (path) => `${url}${path}`;