import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Principal } from 'app/core';
import { IPosition } from 'app/shared/model/position.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { PositionService } from './position.service';

@Component({
    selector: 'jhi-position',
    templateUrl: './position.component.html'
})
export class PositionComponent implements OnInit, OnDestroy {
    positions: IPosition[];
    currentAccount: any;
    eventSubscriber: Subscription;

    settings = {
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Name'
            }
        }
    };

    data: LocalDataSource;

    constructor(
        private positionService: PositionService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPositions();
    }

    loadAll() {
        this.positionService.query().subscribe(
            (res: HttpResponse<IPosition[]>) => {
                this.positions = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInPositions() {
        this.eventSubscriber = this.eventManager.subscribe('positionListModification', response => this.loadAll());
    }

    trackId(index: number, item: IPosition) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCreate() {
        this.router.navigate(['position/new']);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['position/' + event.data.id + '/view']);
        } else if (event.action === 'edit') {
            this.router.navigate(['position/' + event.data.id + '/edit']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'position/' + event.data.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}
