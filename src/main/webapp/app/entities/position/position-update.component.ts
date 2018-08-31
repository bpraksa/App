import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPosition } from 'app/shared/model/position.model';
import { PositionService } from './position.service';

@Component({
    selector: 'jhi-position-update',
    templateUrl: './position-update.component.html'
})
export class PositionUpdateComponent implements OnInit {
    private _position: IPosition;
    isSaving: boolean;

    constructor(private positionService: PositionService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ position }) => {
            this.position = position;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.position.id !== undefined) {
            this.subscribeToSaveResponse(this.positionService.update(this.position));
        } else {
            this.subscribeToSaveResponse(this.positionService.create(this.position));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IPosition>>) {
        result.subscribe((res: HttpResponse<IPosition>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get position() {
        return this._position;
    }

    set position(position: IPosition) {
        this._position = position;
    }
}
