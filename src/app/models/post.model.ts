import { Vote } from './vote.model';

export class Post {
    ups:number;
    downs:number;
    votes:Vote[];
    index: string;
    constructor(public title:string,
        public content:string,
        public author:string,
        public createdAt:number) {}
}