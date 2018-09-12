import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

type EntityResponseType = HttpResponse<IDeliveryOrderItem>;
type EntityArrayResponseType = HttpResponse<IDeliveryOrderItem[]>;

@Injectable({ providedIn: 'root' })
export class DeliveryOrderItemService {
    private resourceUrl = SERVER_API_URL + 'api/delivery-order-items';

    constructor(private http: HttpClient) {}

    create(deliveryOrderItem: IDeliveryOrderItem): Observable<EntityResponseType> {
        return this.http.post<IDeliveryOrderItem>(this.resourceUrl, deliveryOrderItem, { observe: 'response' });
    }

    update(deliveryOrderItem: IDeliveryOrderItem): Observable<EntityResponseType> {
        return this.http.put<IDeliveryOrderItem>(this.resourceUrl, deliveryOrderItem, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IDeliveryOrderItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IDeliveryOrderItem[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
