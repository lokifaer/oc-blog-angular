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

/*   savePosts() { // deprecated: it could overwrite someone else's post.
    firebase.database().ref('/posts').set(this.posts);
  }
 */
  saveNewPost(post: Post): any {
    var errorMessage: string;

    const newKey = firebase.database().ref('/posts').push().key;  // get an unique key

    firebase.database().ref('/posts/'+newKey).set(post, // save the post online
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
    firebase.database().ref('/posts').on('child_added', (data, prevKey) => {
      var newPost:Post = data.val();
      if (newPost) {
        newPost.index = data.key;
        var index = this.posts.findIndex(
          (post) => {
            return post.index === newPost.index;
          }
        );
        if (index > -1) {
          this.posts.splice(index, 1, newPost);
        }
        else {
          var prevIndex = this.posts.findIndex(
            (post) => {
              return post.index === prevKey;
            }
          );
          // console.log('index=',prevIndex);
          this.posts.splice(prevIndex+1, 0, newPost);
        }
        // console.log('child_added');
        // console.log(this.posts);
      }
    });
    
    firebase.database().ref('/posts').on('child_removed', (data) => {
      var index = this.posts.findIndex(
        (post) => {
          return post.index === data.key;
        }
      );
      // console.log('index=',index);
      if (index > -1) {
        this.posts.splice(index, 1);
        // console.log('child_removed');
        // console.log(data.key);
      }
    });
  }

  /* the whole function is useless now...
  createNewPost(post: Post): any {
    // this.posts.push(post);
    // this.savePosts();
    // replace the last two lines with what's following, so instead of updating the whole database each time, only the new one is pushed
    const err = this.saveNewPost(post);
    if (!err) {
      // this.emitPosts();  // useless
    }
    else return err;
  } */

/*   removePost(post: Post) {  // deprecated: it could overwrite someone else's post.
    const postIndex = this.posts.findIndex(
      (postElt) => {
        if (postElt === post) return true;
      }
    );

    this.posts.splice(postIndex, 1);
    this.savePosts();
    this.emitPosts();
  }
 */
  removeOnePost(index: string) {
    firebase.database().ref('/posts/'+index).once('value').then(
      (data) => {
        const post = data.val();
        if (this.globals.getIp()) {
          if (this.globals.getIp() === post.author) {
            firebase.database().ref('/posts/'+index).remove(
              (error) => {
                if (error) {
                  console.log('Deleting of post '+index+' failed: '+error);
                }
              });
            // this.emitPosts();
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

  // updatePostLoveIts(post: Post) {
  //   firebase.database().ref('/posts/'+post.index).update({loveIts: post.loveIts},
  //     (error) => {
  //       if (error)
  //         console.log('Error while updating loveits: '+error);
  //     }
  //   );
  // }
}
