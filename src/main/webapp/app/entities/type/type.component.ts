import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Principal } from 'app/core';
import { IType } from 'app/shared/model/type.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { TypeService } from './type.service';

@Component({
    selector: 'jhi-type',
    templateUrl: './type.component.html'
})
export class TypeComponent implements OnInit, OnDestroy {
    types: IType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    settings = {
        mode: 'external',
        add: {
            addButtonContent: 'Create New'
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
            name: {
                title: 'Name'
            },
            description: {
                title: 'Description'
            }
        }
    };

    data: LocalDataSource;

    constructor(
        private typeService: TypeService,
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
        this.registerChangeInTypes();
    }

    loadAll() {
        this.typeService.query().subscribe(
            (res: HttpResponse<IType[]>) => {
                this.types = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInTypes() {
        this.eventSubscriber = this.eventManager.subscribe('typeListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackId(index: number, item: IType) {
        return item.id;
    }

    onCreate() {
        this.router.navigate(['type/new']);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['type/' + event.data.id + '/view']);
        } else if (event.action === 'edit') {
            this.router.navigate(['type/' + event.data.id + '/edit']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'type/' + event.data.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}
