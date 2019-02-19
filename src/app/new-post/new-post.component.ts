import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { Globals } from '../services/globals.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  postForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private postsService: PostsService, 
              private router: Router,
              private globals: Globals) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  onSavePost() {
    const title = this.postForm.get('title').value;
    const content = this.postForm.get('content').value;
    const createdAt = Date.now();
    const author = this.globals.getIp() ? this.globals.getIp() : "";

    const post = new Post(title, content, author, createdAt);

    // const err = this.postsService.createNewPost(post);
    this.postsService.saveNewPost(post);
    this.router.navigate(['/posts']);
  }
}
