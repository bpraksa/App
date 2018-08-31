import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArticle } from 'app/shared/model/article.model';

@Component({
    selector: 'jhi-article-detail',
    templateUrl: './article-detail.component.html'
})
export class ArticleDetailComponent implements OnInit {
    article: IArticle;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ article }) => {
            this.article = article;
        });
    }

    previousState() {
        window.history.back();
    }
}
