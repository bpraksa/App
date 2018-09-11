import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Principal } from 'app/core';
import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { OnlineOrderItemService } from './online-order-item.service';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {

    settings = {
        mode: 'external',
        add: {
            addButtonContent: 'Order a New Article'
        },
        actions: {
            columnTitle: '',
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

    onlineOrderItems: IOnlineOrderItem[];
    onlineOrderId: number;
    data: LocalDataSource;
    totalItemPrice: number;

    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private route: ActivatedRoute
    ) { }

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

                this.totalItemPrice = 0;
                for (const onlineOrderItem of res.body) {
                    onlineOrderItem.articleName = onlineOrderItem.article.name;
                    onlineOrderItem.articlePrice = onlineOrderItem.article.price;
                    onlineOrderItem.itemPrice = onlineOrderItem.article.price * onlineOrderItem.orderedAmount;
                    this.data.add(onlineOrderItem);

                    this.totalItemPrice += onlineOrderItem.itemPrice;
                }
                console.log('test OnlineOrderItem loadAll() this.totalItemPrice', this.totalItemPrice);
                this.eventManager.broadcast({ name: 'onlineOrderItemTotalPrice', content: this.totalItemPrice });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInOnlineOrderItems() {
        this.eventSubscriber = this.eventManager
            .subscribe('onlineOrderItemListModification', response => {
                this.loadAll();
            });
    }

    trackId(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCreate() {
        console.log('test OnlineOrderItem onCreate() broadcast');
        this.eventManager.broadcast({ name: 'onlineOrderItemChange', content: 'On create item' });

        setTimeout(() => {
            this.router.navigate(['online-order/' + this.onlineOrderId + '/online-order-item/new']);
        }, 100);
    }

    onCustom(event) {
        const item: OnlineOrderItem = event.data;
        if (event.action === 'view') {
            console.log('test OnlineOrderItem onCustom() view broadcast');
            this.eventManager.broadcast({ name: 'onlineOrderItemChange', content: 'On view item' }); // broadcast da je doslo do promene OnlineOrderItem-a

            setTimeout(() => {
                this.router.navigate(['online-order/' + item.onlineOrder.id + '/online-order-item/' + item.id + '/view']);
            }, 100);
        } else if (event.action === 'edit') {
            console.log('test OnlineOrderItem onCustom() edit broadcast');
            this.eventManager.broadcast({ name: 'onlineOrderItemChange', content: 'On edit item' });

            setTimeout(() => {
                this.router.navigate(['online-order/' + item.onlineOrder.id + '/online-order-item/' + item.id + '/edit']);
            }, 100);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'online-order-item/' + item.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

}
