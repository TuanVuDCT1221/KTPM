export const validateUsername = (username) => username && username.trim().length > 0;
export const validatePassword = (p) => p && p.length >= 5;