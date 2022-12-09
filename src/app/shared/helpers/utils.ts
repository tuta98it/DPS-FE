export default class Utils {
  static extractContent(html: string) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .documentElement.textContent;
  }
  static humanFileSize(size: number) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }
  static  saveLocalFile(url:string, filename:string) {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
