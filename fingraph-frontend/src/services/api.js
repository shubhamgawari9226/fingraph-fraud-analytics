const API_BASE_URL = "http://127.0.0.1:8000";

export async function getStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return response.json();
}

export async function getTransactions(limit = 5) {
  const response = await fetch(
    `${API_BASE_URL}/transactions?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function getFraudAnalytics(limit = 5) {
  const response = await fetch(
    `${API_BASE_URL}/fraud-analytics?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch fraud analytics");
  }

  return response.json();
}

export async function getFraudBreakdown() {
  const response = await fetch(
    `${API_BASE_URL}/fraud-breakdown`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch fraud breakdown");
  }

  return response.json();
}

export async function getRiskDistribution() {
  const response = await fetch(
    `${API_BASE_URL}/risk-distribution`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk distribution");
  }

  return response.json();
}