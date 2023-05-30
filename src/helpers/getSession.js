export const session = (key) => JSON.parse(sessionStorage.getItem(key)) || {};
