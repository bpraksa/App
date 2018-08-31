export interface IArticle {
    id?: number;
    name?: string;
    articleNumber?: string;
    price?: number;
    availableAmount?: number;
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public name?: string,
        public articleNumber?: string,
        public price?: number,
        public availableAmount?: number
    ) {}
}
