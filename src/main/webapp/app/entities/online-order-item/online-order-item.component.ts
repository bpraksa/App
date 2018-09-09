import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Principal } from 'app/core';
import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { OnlineOrderItemService } from './online-order-item.service';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {
    onlineOrderItems: IOnlineOrderItem[];
    onlineOrderId: number;

    currentAccount: any;
    eventSubscriber: Subscription;

    settings = {
        mode: 'external',
        add: {
            addButtonContent: 'Create a New Online Order Item'
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
            articleName: {
                title: 'Article'
            },
            articlePrice: {
                title: 'Price per Unit'
            },
            orderedAmount: {
                title: 'Ordered Amount'
            },
            itemPrice: {
                title: 'Price'
            }
        }
    };

    data: LocalDataSource;

    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOnlineOrderItems();
    }

    loadAll() {
        this.route.params.subscribe(params => {
            this.onlineOrderId = params['id'];
        });

        // novi upit za samo one iteme koji nam trebaju
        this.onlineOrderItemService.findByOnlineOrderId(this.onlineOrderId).subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                this.onlineOrderItems = res.body;
                this.data = new LocalDataSource();
                for (const onlineOrderItem of res.body) {
                    onlineOrderItem.articleName = onlineOrderItem.article.name;
                    onlineOrderItem.articlePrice = onlineOrderItem.article.price;
                    onlineOrderItem.itemPrice = onlineOrderItem.article.price * onlineOrderItem.orderedAmount;
                    this.data.add(onlineOrderItem);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInOnlineOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderItemListModification', response => this.loadAll());
    }

    trackId(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCreate() {
        this.router.navigate(['online-order-item/new']);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['online-order-item/' + event.data.id + '/view']);
        } else if (event.action === 'edit') {
            this.router.navigate(['online-order-item/' + event.data.id + '/edit']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'online-order-item/' + event.data.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}
