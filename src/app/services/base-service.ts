import { Observable } from "rxjs";
import { Service } from "./service";

export abstract class BaseService extends Service {
  search(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  getById(url: string, id: any): Observable<any> {
    return this.get(`${url}/${id}`);
  }
  create(url: string, data: any): Observable<any> {
    return this.post(url, data);
  }
  update(url: string, id: any, data: any): Observable<any> {
    return this.post(`${url}/${id}`, data);
  }
  deleteById(url: string, id: any): Observable<any> {
    return this.delete(url, id);
  }
}