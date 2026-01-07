/**
 * OpenAI-compatible API client for chat completions
 * Supports any OpenAI-compatible endpoint (OpenAI, Azure, local, etc.)
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export type ApiError = 
  | { type: 'network'; message: string }
  | { type: 'unauthorized'; message: string }
  | { type: 'rate_limit'; message: string }
  | { type: 'timeout'; message: string }
  | { type: 'unknown'; message: string };

// Configuration - can be adjusted internally
const CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  timeout: 30000, // 30 seconds
};

export class OpenAIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Test the API key with a minimal request
   * Returns true if key is valid, false otherwise
   */
  async testKey(): Promise<{ success: boolean; error?: ApiError }> {
    try {
      await this.chat([
        {
          role: 'user',
          content: 'Hi',
        },
      ]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error as ApiError };
    }
  }

  /**
   * Send a chat completion request
   * @param messages Array of chat messages
   * @param options Optional configuration overrides
   */
  async chat(
    messages: ChatMessage[],
    options?: { temperature?: number; max_tokens?: number }
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

    try {
      const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: CONFIG.model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.max_tokens ?? 500,
        } as ChatCompletionRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw {
            type: 'unauthorized',
            message: 'Ungültiger Schlüssel',
          } as ApiError;
        }
        if (response.status === 429) {
          throw {
            type: 'rate_limit',
            message: 'Zu viele Anfragen',
          } as ApiError;
        }
        throw {
          type: 'unknown',
          message: `Fehler ${response.status}`,
        } as ApiError;
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw {
          type: 'timeout',
          message: 'Zeitüberschreitung',
        } as ApiError;
      }
      
      if (error.type) {
        throw error as ApiError;
      }

      if (!navigator.onLine) {
        throw {
          type: 'network',
          message: 'Offline',
        } as ApiError;
      }

      throw {
        type: 'network',
        message: 'Verbindung fehlgeschlagen',
      } as ApiError;
    }
  }

  /**
   * Request a concise explanation of text
   * @param text The text to explain
   * @param depth Optional depth level: 'short' | 'medium' | 'deep'
   */
  async explainText(
    text: string,
    depth: 'short' | 'medium' | 'deep' = 'medium'
  ): Promise<string> {
    const prompts = {
      short: 'Erkläre diesen Text in 2-3 Sätzen auf Deutsch.',
      medium: 'Erkläre diesen Text verständlich auf Deutsch. Bleibe konkret und klar.',
      deep: 'Erkläre diesen Text ausführlich auf Deutsch. Gib Kontext, Hintergrund und tiefere Bedeutung.',
    };

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Du bist ein hilfreicher Assistent in einem Museum. Deine Antworten sind klar, ruhig und respektvoll.',
      },
      {
        role: 'user',
        content: `${prompts[depth]}\n\nText: ${text}`,
      },
    ];

    return this.chat(messages);
  }

  /**
   * Have a conversation about the text
   * @param text The original text
   * @param userQuestion The user's question
   */
  async discussText(text: string, userQuestion: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Du bist ein hilfreicher Assistent in einem Museum. Beantworte Fragen zum Kunstwerk ruhig und verständlich.',
      },
      {
        role: 'user',
        content: `Bezugstext: ${text}\n\nFrage: ${userQuestion}`,
      },
    ];

    return this.chat(messages);
  }
}
