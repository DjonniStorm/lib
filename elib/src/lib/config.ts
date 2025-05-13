export class Config {
  private _apiUrl?: string;
  public loadUrl(): string {
    this._apiUrl = import.meta.env.VITE_API_URL;
    if (!this._apiUrl) {
      throw new Error('Cannot read .env file');
    }

    return this._apiUrl;
  }

  get apiUrl(): string {
    if (!this._apiUrl) {
      throw new Error('API URL is not set. Call loadUrl() first.');
    }
    return this._apiUrl;
  }
}
