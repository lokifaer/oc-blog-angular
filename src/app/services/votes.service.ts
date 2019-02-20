import { Injectable } from '@angular/core';
import { Vote } from '../models/vote.model';
import { Subject } from 'rxjs';
import { Globals } from './globals.service';
import * as firebase from 'firebase';

export interface PostVotesAndSubject {
  postId:string,
  votes:Vote[],
  subject:Subject<Vote[]>
}

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  userVotes: Vote[] = [];
  userVotesSubject = new Subject<Vote[]>();

  postVotesAndSubjects: PostVotesAndSubject[] = [];

  constructor(private globals:Globals) { }

  emitUserVotes() {
    this.userVotesSubject.next(this.userVotes);
  }

  emitPostVotes(postId:string) {
    var current = this.postVotesAndSubjects[this.getPostVotesIndexFromPostIndex(postId)];
    if (current)
      current.subject.next(current.votes);
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

  getPostVotes(postId:string):Subject<Vote[]> {
    var newPVS:PostVotesAndSubject = {postId:postId, 
      votes:[], 
      subject:new Subject<Vote[]>()
    };
    firebase.database().ref('/votes/').orderByChild('postId').equalTo(postId).on('value',
      (data) => {
        newPVS.votes = data.val() ? Object.keys(data.val())
        .map(
          (index) => {
            return data.val()[index];
          }
        ) : [];

        var currentIndex = this.getPostVotesIndexFromPostIndex(postId);
        if (currentIndex === -1) {
          this.postVotesAndSubjects.push(newPVS);
        }
        else {
          this.postVotesAndSubjects.splice(currentIndex,1,newPVS);
        }
        this.emitPostVotes(postId);
      }
    );

    return newPVS.subject;
  }

  getUserVoteIndexFromPostIndex(postIndex:string): number {
    return this.userVotes.findIndex(
      (vote) => {
        return vote.postId === postIndex;
      }
    );
  }

  getPostVotesIndexFromPostIndex(postIndex:string): number {
    return this.postVotesAndSubjects.findIndex(
      (vs) => {
        return vs.postId === postIndex;
      }
    );
  }

  getPostVotesDowns(postIndex:string): number {
    var downs = 0;
    var index = this.getPostVotesIndexFromPostIndex(postIndex);
    if (index > -1) {
      this.postVotesAndSubjects[index].votes
          .forEach((vs) => {
            if (vs.val < 0) downs++;
          }
        );
    }
    return downs;
  }
}
