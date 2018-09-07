import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Principal } from 'app/core';
import { ICity } from 'app/shared/model/city.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { CityService } from './city.service';

@Component({
    selector: 'jhi-city',
    templateUrl: './city.component.html'
})
export class CityComponent implements OnInit, OnDestroy {
    cities: ICity[];
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
                title: 'First Name'
            },
            zipcode: {
                title: 'ZIP Code'
            }
        }
    };

    data: LocalDataSource;

    constructor(
        private cityService: CityService,
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
        this.registerChangeInCities();
    }

    loadAll() {
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInCities() {
        this.eventSubscriber = this.eventManager.subscribe('cityListModification', response => this.loadAll());
    }

    trackId(index: number, item: ICity) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCreate() {
        this.router.navigate(['city/new']);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['city/' + event.data.id + '/view']);
        } else if (event.action === 'edit') {
            this.router.navigate(['city/' + event.data.id + '/edit']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'city/' + event.data.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}
