import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/post.model';
import { Vote } from '../models/vote.model';
import { VotesService } from '../services/votes.service';
import { Globals } from '../services/globals.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  @Input() post: Post;
  @Input() userVote: Vote;
  postVotes: Vote[];
  postVotesSubscription: Subscription;
  
  constructor(private postsService: PostsService,
              private votesService: VotesService,
              private globals:Globals) { }

  ngOnInit() {
    this.postVotesSubscription = this.votesService.getPostVotes(this.post.index).subscribe(
          (votes: Vote[]) => {
            this.postVotes = votes;
          }
        );
    // this.votesService.getPostVotes(this.post.index);
    this.votesService.emitPostVotes(this.post.index);
      }

  ngOnDestroy() {
    this.postVotesSubscription.unsubscribe();
  }

  getColor()
  {
    const ups = this.getUps();
    const downs = this.getDowns();
	  if (ups > downs)
	  	return "green";
		else if (ups < downs)
			return "red";
		else
			return "regular";
  }

  onLike()
  {
    this.userVote.val = +!this.isLiked();
    this.votesService.updateVote(this.userVote);
  }

  onDislike()
  {
    this.userVote.val = +!this.isDisliked()*-1;
    this.votesService.updateVote(this.userVote);
  }

  onDelete(post: Post) {
    if(confirm('Are you sure you want to delete post "'+post.title+'" ?'))
      this.postsService.removeOnePost(post.index);
  }

  isLiked(): boolean {
    return this.userVote.val > 0 ? true : false;
  }

  isDisliked(): boolean {
    return this.userVote.val < 0 ? true : false;
  }

  getLoveBtnActiveClass(btnClasses: string): string {
    if (
        (btnClasses.search('success') > -1 && this.isLiked()) ||
        (btnClasses.search('danger') > -1 && this.isDisliked())
      ) {
      btnClasses += " active";
    }
    return btnClasses;
  }

  getUps() {
    if (!this.postVotes)
      return 0;
    else {
      var ups = 0;
      this.postVotes.forEach((vote) => {
        if (vote.val > 0) ups++;
      });
      return ups;
    }
  }

  getDowns() {
    if (!this.postVotes)
      return 0;
    else {
      var downs = 0;
      this.postVotes.forEach((vote) => {
        if (vote.val < 0) downs++;
      });
      return downs;
    }
  }

  isMine() {
    return this.globals.getIp() === this.post.author;
  }
}
