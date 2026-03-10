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

/**
 * Get all LiteLLM models that support the /responses endpoint
 * @returns {Promise<{models: string[]}>}
 */
export const getAvailableModels = async () => {
  const response = await fetch(`${API_BASE_URL}/models`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Stream a response from a single AI model via SSE.
 * @param {string} modelName
 * @param {string} apiKey
 * @param {string} prompt
 * @param {(chunk: string) => void} onChunk - called for each text chunk
 * @param {() => void} onDone - called when stream completes
 * @param {(error: string) => void} onError - called on error
 */
export const streamModelResponse = async (modelName, apiKey, prompt, onChunk, onDone, onError) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/get_response_stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_data: { model_name: modelName, secret: apiKey.trim() },
        prompt,
      }),
    });
  } catch (e) {
    onError(e.message ?? 'Network error');
    return;
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    onError(errData.detail || `HTTP error ${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) { onError(parsed.error); return; }
          if (parsed.content) onChunk(parsed.content);
        } catch { /* skip malformed */ }
      }
    }
    onDone();
  } catch (e) {
    onError(e.message ?? 'Stream read error');
  }
};
