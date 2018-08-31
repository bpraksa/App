import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICity } from 'app/shared/model/city.model';
import { CityService } from './city.service';

@Component({
    selector: 'jhi-city-update',
    templateUrl: './city-update.component.html'
})
export class CityUpdateComponent implements OnInit {
    private _city: ICity;
    isSaving: boolean;

    constructor(private cityService: CityService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ city }) => {
            this.city = city;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.city.id !== undefined) {
            this.subscribeToSaveResponse(this.cityService.update(this.city));
        } else {
            this.subscribeToSaveResponse(this.cityService.create(this.city));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICity>>) {
        result.subscribe((res: HttpResponse<ICity>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get city() {
        return this._city;
    }

    set city(city: ICity) {
        this._city = city;
    }
}
