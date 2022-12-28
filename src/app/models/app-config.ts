export class AppConfig {
  api: {
    baseUrl: string,
    fileUrl: string,
  };
  deepzoom: {
    baseUrl: string
  };
  domain: string;
  sharedUrl: string;
  layout: string;
  slogan: {
    content: string,
    author: string
  };
  constructor() {
    this.api = {
      baseUrl: '',
      fileUrl: '',
    };
    this.deepzoom = {
      baseUrl: ''
    };
    this.domain = '';
    this.sharedUrl = '';
    this.layout = '';
    this.slogan = {
      content: '',
      author: ''
    };
  }
}