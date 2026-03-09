import { API_BASE_URL } from '../config';

/**
 * Get a response from a single AI model
 * @param {string} modelName - The name of the model
 * @param {string} apiKey - The API key for the model
 * @param {string} prompt - The user's prompt
 * @returns {Promise<{model_name: string, response: string}>}
 */
export const getModelResponse = async (modelName, apiKey, prompt) => {
  const response = await fetch(`${API_BASE_URL}/get_response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_data: {
        model_name: modelName,
        secret: apiKey
      },
      prompt: prompt
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get similarity scores between model responses
 * @param {number} baseModelIdx - Index of the baseline model in the responses array
 * @param {Array<{model_name: string, content: string}>} modelResponses - Array of model responses
 * @returns {Promise<{base_model_name: string, content: Array<{model_name: string, similarity_score: number}>}>}
 */
export const getSimilarityScores = async (baseModelIdx, modelResponses) => {
  const response = await fetch(`${API_BASE_URL}/get_similarity_score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base_model_idx: baseModelIdx,
      content: modelResponses
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Health check for the backend
 * @returns {Promise<{message: string, status: string}>}
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};
