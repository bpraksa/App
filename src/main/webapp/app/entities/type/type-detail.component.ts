import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IType } from 'app/shared/model/type.model';

@Component({
    selector: 'jhi-type-detail',
    templateUrl: './type-detail.component.html'
})
export class TypeDetailComponent implements OnInit {
    type: IType;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ type }) => {
            this.type = type;
        });
    }

    previousState() {
        window.history.back();
    }
}
