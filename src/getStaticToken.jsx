// src/getStaticToken.js
export const getStaticToken = async () => {
  const response = await fetch("https://chatserver-mu.vercel.app/static-token");
  const data = await response.json();
  return data.token;
};
