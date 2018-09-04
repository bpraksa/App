import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';

type EntityResponseType = HttpResponse<IOnlineOrderItem>;
type EntityArrayResponseType = HttpResponse<IOnlineOrderItem[]>;

@Injectable({ providedIn: 'root' })
export class OnlineOrderItemService {
    private resourceUrl = SERVER_API_URL + 'api/online-order-items';

    constructor(private http: HttpClient) {}

    create(onlineOrderItem: IOnlineOrderItem): Observable<EntityResponseType> {
        return this.http.post<IOnlineOrderItem>(this.resourceUrl, onlineOrderItem, { observe: 'response' });
    }

    update(onlineOrderItem: IOnlineOrderItem): Observable<EntityResponseType> {
        return this.http.put<IOnlineOrderItem>(this.resourceUrl, onlineOrderItem, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IOnlineOrderItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IOnlineOrderItem[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
