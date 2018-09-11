import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'app/entities/article';
import { OnlineOrderService } from 'app/entities/online-order';
import { IArticle } from 'app/shared/model/article.model';
import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { OnlineOrderItemService } from './online-order-item.service';

@Component({
    selector: 'jhi-online-order-item-update',
    templateUrl: './online-order-item-update.component.html'
})
export class OnlineOrderItemUpdateComponent implements OnInit, OnDestroy {

    private _onlineOrderItem: IOnlineOrderItem;
    isSaving: boolean;
    onlineOrderId: number;

    onlineorders: IOnlineOrder[];
    articles: IArticle[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderItemService: OnlineOrderItemService,
        private onlineOrderService: OnlineOrderService,
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        console.log('test OnlineOrderItemUpdate ngOnInit()');
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });
        this.activatedRoute.params.subscribe(params => {
            this.onlineOrderId = params['orderId'];
        });
        this.loadOrder();

        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineorders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    loadOrder() {
        this.onlineOrderService.find(this.onlineOrderId).subscribe(
            (res: HttpResponse<IOnlineOrder>) => {
                this.onlineOrderItem.onlineOrder = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    calculatePrice() {
        console.log('test OnlineOrderItemUpdate calculatePrice()');

        if (this.onlineOrderItem.orderedAmount && this.onlineOrderItem.article) {
            this.onlineOrderItem.itemPrice = this.onlineOrderItem.orderedAmount * this.onlineOrderItem.article.price;
        }
    }

    previousState() {
        window.history.back();
    }

    navigateToOrderEdit() {
        console.log('test OnlineOrderItemUpdate navigateToOrderEdit()');
        this.router.navigate(['online-order/' + this.onlineOrderId + '/edit']);
    }

    onSaveAndNext() {
        console.log('test OnlineOrderItemUpdate onSaveAndNext()');
        this.save();

        // navigacija na istu komponentu - prvo se naviguje na pocetnu stranu, pa zatim natrag na komponentu
        // zbog navigacije, sama komponenta se brise - okida se ngOnDestroy(), i zatim se opet instancira - okida se ngOnInit()
        this.router.navigate(['']).then(() => {
            this.router.navigate(['online-order/' + this.onlineOrderId + '/online-order-item/new']);
        });

        // alternativno, vracanje polja na pocetno stanje, instanca komponente ostaje ista
        // this.onlineOrderItem.orderedAmount = null;
        // this.onlineOrderItem.itemPrice = null;
        // this.onlineOrderItem.article = null;
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe((res: HttpResponse<IOnlineOrderItem>) => {
            this.onSaveSuccess(res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    private onSaveSuccess(item: OnlineOrderItem) {
        console.log('test OnlineOrderItemUpdate onSaveSuccess() item:', item);
        this.isSaving = false;
        // this.previousState();
    }

    private onSaveError(err: HttpErrorResponse) {
        console.log('test OnlineOrderItemUpdate onSaveError() ERROR', err);
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackOnlineOrderById(index: number, item: IOnlineOrder) {
        return item.id;
    }

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }

    get onlineOrderItem() {
        return this._onlineOrderItem;
    }

    set onlineOrderItem(onlineOrderItem: IOnlineOrderItem) {
        this._onlineOrderItem = onlineOrderItem;
    }

    ngOnDestroy(): void {
        console.log('test OnlineOrderItemUpdate ngOnDestroy()');
    }

}
