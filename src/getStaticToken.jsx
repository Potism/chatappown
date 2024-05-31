// src/getStaticToken.js
export const getStaticToken = async () => {
  const response = await fetch("http://localhost:5001/static-token");
  const data = await response.json();
  return data.token;
};
