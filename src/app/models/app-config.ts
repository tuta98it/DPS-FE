export class AppConfig {
  api: {
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
    this.slogan = {
      content: '',
      author: ''
    };
  }
}