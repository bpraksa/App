import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { Principal } from 'app/core';
import { OnlineOrderService } from './online-order.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-online-order',
    templateUrl: './online-order.component.html'
})
export class OnlineOrderComponent implements OnInit, OnDestroy {
    onlineOrders: IOnlineOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    settings = {
        mode: 'external',
        add: {
            addButtonContent: 'Create a New Article'
        },
        actions: {
            edit: false,
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: 'View '
                },
                {
                    name: 'edit',
                    title: 'Edit '
                },
                {
                    name: 'delete',
                    title: 'Delete '
                }
            ]
        },
        columns: {
            id: {
                title: 'ID'
            },
            clientName: {
                title: 'Client'
            },
            address: {
                title: 'Address'
            },
            cityName: {
                title: 'City'
            },
            phoneNumber: {
                title: 'Phone Number'
            },
            totalPrice: {
                title: 'Total Price'
            }
        }
    };

    data: LocalDataSource;

    constructor(
        private onlineOrderService: OnlineOrderService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineOrders = res.body;
                this.data = new LocalDataSource();
                for (const onlineOrder of res.body) {
                    onlineOrder.clientName = onlineOrder.client.name;
                    onlineOrder.cityName = onlineOrder.city.name;
                    this.data.add(onlineOrder);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOnlineOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrder) {
        return item.id;
    }

    registerChangeInOnlineOrders() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCreate() {
        this.router.navigate(['online-order/new']);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['online-order/' + event.data.id + '/view']);
        } else if (event.action === 'edit') {
            this.router.navigate(['online-order/' + event.data.id + '/edit']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'online-order/' + event.data.id + '/delete' } }]);
        }
    }
}
