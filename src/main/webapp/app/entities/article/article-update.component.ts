import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IArticle } from 'app/shared/model/article.model';
import { ArticleService } from './article.service';

@Component({
    selector: 'jhi-article-update',
    templateUrl: './article-update.component.html'
})
export class ArticleUpdateComponent implements OnInit {
    private _article: IArticle;
    isSaving: boolean;

    constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ article }) => {
            this.article = article;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.article.id !== undefined) {
            this.subscribeToSaveResponse(this.articleService.update(this.article));
        } else {
            this.subscribeToSaveResponse(this.articleService.create(this.article));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IArticle>>) {
        result.subscribe((res: HttpResponse<IArticle>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get article() {
        return this._article;
    }

    set article(article: IArticle) {
        this._article = article;
    }
}
