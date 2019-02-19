import { Component, OnInit, OnDestroy, Host } from '@angular/core';
import { Post } from '../models/post.model';
import { Subscription } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { Vote } from '../models/vote.model';
import { VotesService } from '../services/votes.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
	posts: Post[];
	postSubscription: Subscription;
	// votes: Vote[];
	// voteSubscription: Subscription;

	constructor(private postsService: PostsService/* ,
				private votesServices: VotesService */) { }

  	ngOnInit() {
		this.postSubscription = this.postsService.postSubject.subscribe(
			(posts: Post[]) => {
				this.posts = posts;
			}
		);
		this.postsService.getPosts();
		this.postsService.emitPosts();

		// this.voteSubscription = this.votesServices.userVotesSubject.subscribe(
		// 	(votes: Vote[]) => {
		// 		this.votes = votes;
		// 	}
		// )
		// this.votesServices.getUserVotes();
		// this.votesServices.emitUserVotes();
  	}

	ngOnDestroy() {
		this.postSubscription.unsubscribe();
		// this.voteSubscription.unsubscribe();
	}

	// getVoteFromPost(post: Post): Vote {
	// 	const index = this.votesServices.getVoteIndexFromPostIndex(post.index);
	// 	return index > -1 ? this.votes[index] : new Vote(post.index, '', 0);
	// }
}