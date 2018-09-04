import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOnlineOrder } from 'app/shared/model/online-order.model';

type EntityResponseType = HttpResponse<IOnlineOrder>;
type EntityArrayResponseType = HttpResponse<IOnlineOrder[]>;

@Injectable({ providedIn: 'root' })
export class OnlineOrderService {
    private resourceUrl = SERVER_API_URL + 'api/online-orders';

    constructor(private http: HttpClient) {}

    create(onlineOrder: IOnlineOrder): Observable<EntityResponseType> {
        return this.http.post<IOnlineOrder>(this.resourceUrl, onlineOrder, { observe: 'response' });
    }

    update(onlineOrder: IOnlineOrder): Observable<EntityResponseType> {
        return this.http.put<IOnlineOrder>(this.resourceUrl, onlineOrder, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IOnlineOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IOnlineOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
