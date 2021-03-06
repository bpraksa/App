import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'app/entities/city';
import { ClientService } from 'app/entities/client';
import { DeliveryOrderService } from 'app/entities/delivery-order';
import { ICity } from 'app/shared/model/city.model';
import { IClient } from 'app/shared/model/client.model';
import { DeliveryOrder, IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { IOnlineOrder, OnlineOrder } from 'app/shared/model/online-order.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable, Subscription } from 'rxjs';
import { OnlineOrderService } from './online-order.service';

@Component({
    selector: 'jhi-online-order-update',
    templateUrl: './online-order-update.component.html'
})
export class OnlineOrderUpdateComponent implements OnInit, OnDestroy {

    private _onlineOrder: IOnlineOrder;
    isSaving: boolean;
    isNewForm: boolean;
    isOrderComplete: boolean; // treba da bude deo entiteta OnlineOrder, kako bi se cuvao u bazi

    cities: ICity[];
    clients: IClient[];
    eventSubscriber: Subscription;
    eventSubscriberTotalPrice: Subscription;

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderService: OnlineOrderService,
        private cityService: CityService,
        private clientService: ClientService,
        private deliveryOrderService: DeliveryOrderService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) { }

    ngOnInit() {
        console.log('test OnlineOrderUpdate ngOnInit() ran');
        this.isSaving = false;
        this.isOrderComplete = false;
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            this.onlineOrder = onlineOrder;
        });
        console.log('test OnlineOrderUpdate ngOnInit() this.router.url:', this.router.url);
        this.isNewForm = this.router.url.includes('new');

        this.subscribeToChanges();
        this.loadData();
    }

    subscribeToChanges() {
        this.eventSubscriber = this.eventManager
            .subscribe('onlineOrderItemChange', response => {
                console.log('test OnlineOrderUpdate ngOnInit() this.save() ran:', response);
                this.save();
            });
        this.eventSubscriberTotalPrice = this.eventManager
            .subscribe('onlineOrderItemTotalPrice', response => {
                console.log('test OnlineOrderUpdate ngOnInit() totalPrice:', response.content);
                this.onlineOrder.totalPrice = response.content;
            });
    }

    loadData() {
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    navigateToOrderOverview() {
        console.log('test OnlineOrderUpdate navigateToOrderOverview()');
        this.router.navigate(['online-order/']);
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderService.update(this.onlineOrder));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderService.create(this.onlineOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrder>>) {
        result.subscribe((res: HttpResponse<IOnlineOrder>) => {
            this.onSaveSuccess(res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    private onSaveSuccess(onlineOrder: OnlineOrder) {
        console.log('test OnlineOrderUpdate onSaveSuccess() onlineOrder:', onlineOrder);
        this.isSaving = false;
        // this.previousState();

        // menja se klikom na Complete Order dugme, sluzi da se kreira DeliveryOrder samo jednom i da posle forma bude readonly
        // (trenutno ne radi jer se ne cuva u bazu, tj ne postoji u entitetu i treba ga dodati - ili dodati polje status koje ce da obavlja tu funkciju)
        if (this.isOrderComplete) {
            this.createDeliveryOrder(onlineOrder);
        }
    }

    private onSaveError(err: HttpErrorResponse) {
        console.log('test OnlineOrderUpdate onSaveError() ERROR:', err);
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    createDeliveryOrder(onlineOrder: OnlineOrder) {
        this.isOrderComplete = true;
        const deliveryOrder = new DeliveryOrder();
        deliveryOrder.status = 'NEW';
        deliveryOrder.onlineOrder = onlineOrder;

        this.deliveryOrderService.create((deliveryOrder)).subscribe((res: HttpResponse<IDeliveryOrder>) => {
            console.log('test OnlineOrderUpdate saveDeliveryOrder() deliveryOrder:', res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    trackCityById(index: number, item: ICity) { // koristi Angular u html-u komponente pri for petljama da prati promene u podacima niza for petlje
        return item.id;
    }

    trackClientById(index: number, item: IClient) {
        return item.id;
    }

    get onlineOrder() {
        return this._onlineOrder;
    }

    set onlineOrder(onlineOrder: IOnlineOrder) {
        this._onlineOrder = onlineOrder;
    }

    ngOnDestroy(): void {
        console.log('test OnlineOrderUpdate ngOnDestroy() ran');
        // svaki eventSubscriber mora eksplicitno da se unisti, inace ostaje za vreme trajanja programa, i svaki od njih ce slusati za broadcast i
        // pokrenuti kod iz callback funkcije
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.eventSubscriberTotalPrice);
    }

}
