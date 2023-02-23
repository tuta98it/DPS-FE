import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root',
})
export class ListLabelsService extends BaseService {
    override url = '/Label';
}
