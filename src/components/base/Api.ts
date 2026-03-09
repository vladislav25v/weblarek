import { ApiPostMethods } from '@types';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...((options.headers as object) ?? {}),
      },
    };
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('application/json')) {
      const body = await response.text();
      const preview = body.slice(0, 120).trim();
      throw new Error(
        `Expected JSON but received ${contentType || 'unknown content type'} from ${response.url}. ${preview}`,
      );
    }

    const data = await response.json();

    if (response.ok) {
      return data as T;
    }

    throw new Error(data.error ?? response.statusText);
  }

  get<T extends object>(uri: string) {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET',
    }).then((response) => this.handleResponse<T>(response));
  }

  post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    }).then((response) => this.handleResponse<T>(response));
  }
}
