export class Post {
    index: string;
    constructor(public title:string,
        public content:string,
        public author:string,
        public createdAt:number) {}
}