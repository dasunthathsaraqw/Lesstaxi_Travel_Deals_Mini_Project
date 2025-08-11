const API_URL = 'http://localhost:5000/api/deals';

export const fetchDeals = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch deals');
  return response.json();
};