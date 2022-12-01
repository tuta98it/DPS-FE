export default class Utils {
  static extractContent(html: string) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .documentElement.textContent;
  }
}