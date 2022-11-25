export class AppConfig {
  api: {
    baseUrl: string
  };
  deepzoom: {
    baseUrl: string
  };
  slogan: {
    content: string,
    author: string
  };
  constructor() {
    this.api = {
      baseUrl: ''
    };
    this.deepzoom = {
      baseUrl: ''
    };
    this.slogan = {
      content: '',
      author: ''
    };
  }
}