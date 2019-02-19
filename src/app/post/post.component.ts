import { Component, Input, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/post.model';
import { Vote } from '../models/vote.model';
import { VotesService } from '../services/votes.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  // @Input() vote: Vote;
  
  constructor(private postsService: PostsService/* ,
              private votesService: VotesService */) { }

  ngOnInit() {
    // console.log(this.vote);
    // console.log(this.post);
    // this.refreshVotes();
  }

  // refreshVotes() {
  //   this.votesService.getPostVotes(this.post).then(
  //     (postVotes: Vote[]) => {
  //       console.log('refresh for'+this.post.index);
  //       this.post.ups = 0;
  //       this.post.downs = 0;
  //       postVotes.forEach(vote => {
  //         if (vote.val > 0) this.post.ups++;
  //         if (vote.val < 0) this.post.downs++;
  //       });
  //     }
  //   );
  // }

  getColor()
  {
	  if (this.post.ups > this.post.downs)
	  	return "green";
		else if (this.post.ups < this.post.downs)
			return "red";
		else
			return "regular";
  }

  onLike()
  {
    // this.vote.val = +!this.isLiked();
    // this.votesService.updateVote(this.vote);
    // this.refreshVotes();
    // this.votesService.emitUserVotes();
  }

  onDislike()
  {
    // this.vote.val = +!this.isDisliked()*-1;
    // this.votesService.updateVote(this.vote);
    // this.refreshVotes();
    // this.votesService.emitUserVotes();
  }

  onDelete(post: Post) {
    if(confirm('Are you sure you want to delete post "'+post.title+'" ?'))
      this.postsService.removeOnePost(post.index);
  }

  isLiked(): boolean {
    // return this.vote.val > 0 ? true : false;
    // return this.vote.val > 0 ? 'btn btn-success active' : 'btn btn-success';
    return false;
  }

  isDisliked(): boolean {
    // return this.vote.val < 0 ? true : false;
    return false;
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
}
