import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';

type EntityResponseType = HttpResponse<IDeliveryOrder>;
type EntityArrayResponseType = HttpResponse<IDeliveryOrder[]>;

@Injectable({ providedIn: 'root' })
export class DeliveryOrderService {
    private resourceUrl = SERVER_API_URL + 'api/delivery-orders';

    constructor(private http: HttpClient) {}

    create(deliveryOrder: IDeliveryOrder): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(deliveryOrder);
        return this.http
            .post<IDeliveryOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(deliveryOrder: IDeliveryOrder): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(deliveryOrder);
        return this.http
            .put<IDeliveryOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDeliveryOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDeliveryOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(deliveryOrder: IDeliveryOrder): IDeliveryOrder {
        const copy: IDeliveryOrder = Object.assign({}, deliveryOrder, {
            deliveryDate:
                deliveryOrder.deliveryDate != null && deliveryOrder.deliveryDate.isValid()
                    ? deliveryOrder.deliveryDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((deliveryOrder: IDeliveryOrder) => {
            deliveryOrder.deliveryDate = deliveryOrder.deliveryDate != null ? moment(deliveryOrder.deliveryDate) : null;
        });
        return res;
    }
}
