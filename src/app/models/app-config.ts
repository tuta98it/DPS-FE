export class AppConfig {
  api: {
    baseUrl: string
  };
  deepzoom: {
    baseUrl: string
  };
  layout: string;
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
    this.layout = '';
    this.slogan = {
      content: '',
      author: ''
    };
  }
}