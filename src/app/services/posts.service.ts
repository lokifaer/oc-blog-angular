import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { Globals } from './globals.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = [];
  postSubject = new Subject<Post[]>();

  constructor(private globals:Globals) { }

  emitPosts() {
    this.postSubject.next(this.posts);
  }

  saveNewPost(post: Post): any {
    var errorMessage: string;

    const newKey = firebase.database().ref('/posts').push().key;  // get an unique key

    firebase.database().ref('/posts/'+newKey).set(post, // save the post online with the unique key
      (error) => {
        if (error) {
          console.log('Saving of new post failed: ' + error);
          errorMessage = error.message;
        }
      }
    );
  }

  getPosts() {
    this.posts = [];
    firebase.database().ref('/posts').on('child_added', (data, prevKey) => {  // check exclusively new post
      var newPost:Post = data.val();
      if (newPost) {
        newPost.index = data.key;
        var index = this.posts.findIndex( // check if already added in the array
          (post) => {
            return post.index === newPost.index;
          }
        );
        if (index > -1) {   // yes, then replace it
          this.posts.splice(index, 1, newPost);
        }
        else {              // no, put it right after the previous child
          var prevIndex = this.posts.findIndex(
            (post) => {
              return post.index === prevKey;
            }
          );
          this.posts.splice(prevIndex+1, 0, newPost);
        }
      }
    });
    
    firebase.database().ref('/posts').on('child_removed', (data) => { // check exclusively post deletion
      var index = this.posts.findIndex(
        (post) => {
          return post.index === data.key;
        }
      );
      if (index > -1) { // if still in the array, remove it
        this.posts.splice(index, 1);
      }
    });
  }

  removeOnePost(index: string) {
    firebase.database().ref('/posts/'+index).once('value').then(  // find the post
      (data) => {
        const post = data.val();
        if (this.globals.getIp()) {
          if (this.globals.getIp() === post.author) { // if IPs match
            firebase.database().ref('/posts/'+index).remove(  // remove it from database
              (error) => {
                if (error) {
                  console.log('Deleting of post '+index+' failed: '+error);
                }
              });
          }
          else {
            alert('You can\'t delete this post because it doesn\'t seem you wrote it yourself');
            console.log('Nope! forbidden: current('+this.globals.getIp()+') <> post('+post.author+')');
          }
        }
        else {
          console.log('error: No IP found');
        }
      },
      (error) => {
        console.log("Error while retrieving post at index: "+index+". "+error);
      }
    );
  }
}
