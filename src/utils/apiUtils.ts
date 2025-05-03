
// Collection of API service configurations
export interface ApiService {
  id: string;
  name: string;
  description: string;
  apiKeyName: string;
  baseUrl: string;
  defaultEndpoint: string;
}

export const availableApiServices: ApiService[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Access powerful language models like GPT-4',
    apiKeyName: 'OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com/v1',
    defaultEndpoint: '/chat/completions'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access the Hugging Face Inference API',
    apiKeyName: 'HUGGINGFACE_API_KEY',
    baseUrl: 'https://api-inference.huggingface.co/models',
    defaultEndpoint: '/gpt2'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Access the Perplexity API',
    apiKeyName: 'PERPLEXITY_API_KEY',
    baseUrl: 'https://api.perplexity.ai',
    defaultEndpoint: '/chat/completions'
  }
];

// Class to handle API calls
export class ApiManager {
  private apiKeys: Map<string, string>;
  
  constructor() {
    this.apiKeys = new Map();
    
    // Load saved API keys from localStorage
    this.loadApiKeys();
  }
  
  private loadApiKeys(): void {
    try {
      const savedKeys = localStorage.getItem('cyberAI_apiKeys');
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys);
        Object.entries(parsedKeys).forEach(([service, key]) => {
          this.apiKeys.set(service, key as string);
        });
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  }
  
  private saveApiKeys(): void {
    try {
      const keysObj: Record<string, string> = {};
      this.apiKeys.forEach((key, service) => {
        keysObj[service] = key;
      });
      localStorage.setItem('cyberAI_apiKeys', JSON.stringify(keysObj));
    } catch (error) {
      console.error('Failed to save API keys:', error);
    }
  }
  
  public setApiKey(service: string, key: string): void {
    this.apiKeys.set(service, key);
    this.saveApiKeys();
  }
  
  public getApiKey(service: string): string | undefined {
    return this.apiKeys.get(service);
  }
  
  public hasApiKey(service: string): boolean {
    return this.apiKeys.has(service) && !!this.apiKeys.get(service);
  }
  
  public deleteApiKey(service: string): void {
    this.apiKeys.delete(service);
    this.saveApiKeys();
  }
  
  public async callOpenAI(prompt: string, systemPrompt = 'You are a helpful assistant.'): Promise<string> {
    const apiKey = this.getApiKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
  
  public async callHuggingFace(model: string, input: string): Promise<any> {
    const apiKey = this.getApiKey('huggingface');
    if (!apiKey) {
      throw new Error('Hugging Face API key not found');
    }
    
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ inputs: input })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }
  
  public async callPerplexity(prompt: string, systemPrompt = 'You are a helpful assistant.'): Promise<string> {
    const apiKey = this.getApiKey('perplexity');
    if (!apiKey) {
      throw new Error('Perplexity API key not found');
    }
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }
}
