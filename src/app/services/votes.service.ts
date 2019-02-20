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

  userVotes: Vote[] = []; // contains all the votes of the current user
  userVotesSubject = new Subject<Vote[]>();

  postVotesAndSubjects: PostVotesAndSubject[] = []; // holds the votes of all the posts displayed

  constructor(private globals:Globals) { }

  emitUserVotes() {
    this.userVotesSubject.next(this.userVotes);
  }

  emitPostVotes(postId:string) {  // emits the right row of the array
    var current = this.postVotesAndSubjects[this.getPostVotesIndexFromPostIndex(postId)];
    if (current)
      current.subject.next(current.votes);
  }

  updateVote(vote: Vote) {
    if (this.globals.getIp()) {
      vote.userIp = this.globals.getIp(); // each couple post+ip has one unique entry that I can overwrite anytime
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
    if (this.globals.getIp()) { // get all the votes of current user
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
    // get all the votes of a specific post
    firebase.database().ref('/votes/').orderByChild('postId').equalTo(postId).on('value',
      (data) => {
        newPVS.votes = data.val() ? Object.keys(data.val())
        .map(
          (index) => {
            return data.val()[index];
          }
        ) : [];
        // check if it's already in the array
        var currentIndex = this.getPostVotesIndexFromPostIndex(postId);
        if (currentIndex === -1) {  // if not, push it
          this.postVotesAndSubjects.push(newPVS);
        }
        else {  // otherwise replace it
          this.postVotesAndSubjects.splice(currentIndex,1,newPVS);
        }
        this.emitPostVotes(postId);
      }
    );

    return newPVS.subject;
  }

  getUserVoteIndexFromPostIndex(postIndex:string): number {
    return this.userVotes.findIndex(
      (vote) => { // find the matching vote for a specified post
        return vote.postId === postIndex;
      }
    );
  }

  getPostVotesIndexFromPostIndex(postIndex:string): number {
    return this.postVotesAndSubjects.findIndex(
      (vs) => { // find the matching PostVote object for specified post
        return vs.postId === postIndex;
      }
    );
  }

  removeVotesOfOnePost(postIndex:string) {
    firebase.database().ref('/votes/').orderByChild('postId').equalTo(postIndex).once('value').then(
      (data) => { // find all votes for specified post
        var votes = data.val() ? Object.keys(data.val()) : [];
        votes.forEach((voteId) => { // remove them all
          firebase.database().ref('/votes/'+voteId).remove(
            (error) => {
              if (error)
                console.log(error);
            }
          );
        });
      }
    );
  }
}
