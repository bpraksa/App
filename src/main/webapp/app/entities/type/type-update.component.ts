import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IType } from 'app/shared/model/type.model';
import { TypeService } from './type.service';

@Component({
    selector: 'jhi-type-update',
    templateUrl: './type-update.component.html'
})
export class TypeUpdateComponent implements OnInit {
    private _type: IType;
    isSaving: boolean;

    constructor(private typeService: TypeService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ type }) => {
            this.type = type;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.type.id !== undefined) {
            this.subscribeToSaveResponse(this.typeService.update(this.type));
        } else {
            this.subscribeToSaveResponse(this.typeService.create(this.type));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IType>>) {
        result.subscribe((res: HttpResponse<IType>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get type() {
        return this._type;
    }

    set type(type: IType) {
        this._type = type;
    }
}
