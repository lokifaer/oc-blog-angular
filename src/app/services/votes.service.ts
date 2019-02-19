import { Injectable } from '@angular/core';
import { Vote } from '../models/vote.model';
import { Subject } from 'rxjs';
import { Globals } from './globals.service';
import * as firebase from 'firebase';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  userVotes: Vote[] = [];
  postVotes: Vote[] = [];
  userVotesSubject = new Subject<Vote[]>();

  constructor(private globals:Globals) { }

  emitUserVotes() {
    this.userVotesSubject.next(this.userVotes);
  }

  updateVote(vote: Vote) {
    if (this.globals.getIp()) {
      vote.userIp = this.globals.getIp();
      firebase.database().ref('/votes/'+vote.postId+'@'+vote.userIp.replace(/\./g,'',)).set(vote, 
        (error) => {
          if (error) {
            console.log('Error at saving vote: '+error);
          }
        }
      );
    }
    else {
      console.log('error: no IP could be found.');
    }
  }

  getUserVotes() {
    if (this.globals.getIp()) {
      firebase.database().ref('/votes/').orderByChild('userIp').equalTo(this.globals.getIp()).on('value',
        (data) => {
          this.userVotes = data.val() ? Object.keys(data.val())
            .map(
              (index) => {
                return data.val()[index];
              }
            ) : [];
          this.emitUserVotes();
        }
      );
    }
  }

  getPostVotes(post: Post) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/votes/').orderByChild('postId').equalTo(post.index).on('value',
          (data) => {
            this.postVotes = data.val() ? Object.keys(data.val())
              .map(
                (index) => {
                  return data.val()[index];
                }
              ) : [];
            resolve(this.postVotes);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getVoteIndexFromPostIndex(postIndex: string): number {
    var indexToReturn:number = -1;
    this.userVotes.forEach(
      (vote, index) => {
        if (vote.postId === postIndex) {
          indexToReturn = index;
          return true;
        }
      }
    );
    return indexToReturn;
  }
}
