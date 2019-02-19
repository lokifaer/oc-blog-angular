import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  changes = [
    // {
    //   title:'',
    //   text:'',
    // },
    {
      title:'<b>Data persistence</b> or nothing',
      text:'That sounded obvious to use Firebase to keep the posts alive.',
    },
    {
      title:'<b>Reactive form</b> rather than template method',
      text:'By reading the course, I thought the reactive method was better, so I picked this one.',
    },
    {
      title:'<strike>Update locale then save the entire /post</strike> => only <b>add one unique</b> post online',
      text:'I was bothered by the fact I had to rewrite the whole "database" each time I made an action. So I looked for something better.<br/>'+
            'I also realized that was quite dangerous if several people would write at the same time because they could overwrite each other\'s messages.',
    },
    {
      title:'<strike>Update locale then save the entire /post</strike> => only <b>remove the selected</b> post online',
      text:'Same motivation as above, that felt better.',
    },
    {
      title:'Add a data protection service',
      text:'I thought that wasn\'t great to let people remove posts they didn\'t write, though I didn\'t want to bother with manual identification, so I looked for '+
            'something else. By keeping track of public IP address, I can check if the user actually wrote what he wants to delete.<br/><br/>'+
            'Yeah, I know this isn\'t really reliable, but that\'s a first step.<br/><br/>'+
            'So I made a new service to retrieve the IP from an online API and I store it in every added post and check it with every post the user wants to delete.',
    },
    {
      title:'Confirmation',
      text:'Also, I added a short message asking for confirmation before deleting a post.',
    },
    {
      title:'Check connection to limit app access',
      text:'When offline, nothing can/must be done. So I check that and display a message instead of the regular content if offline.',
    },
    {
      title:'Correct management of loveIts',
      text:'When starting the last part of the work, I wondered how to manage it since I wanted the app to be able to take into account '+
            'several votes on the same post at the same time without overwriting (still the same issue). So my first thought was I couldn\'t '+
            'just update the number of loveIts according to the locale value.<br/><br/>'+
            '- The first idea was to make a sub-table which would include all the actual clicks, then I would just have to sum everything.<br/>'+
            '- The second idea was to, just as I did for the deleting part, grab the user\'s IP to limit votes to one per post, without removing the '+
            '"I changed my mind" option. This would also prevent from oversizing the table with thousands of clicks...<br/>'+
            '- The third idea was that the first one wasn\'t that good. It would mean I\'d have to sum everything at every new refresh. So I checked '+
            'a bit more on Google and found a doc about transactional operations. And I <i>"saw that it was good"</i>. <br/><br/>'+
            'So in order to make all of that happen I had to change a lot of things in the functionalities. But I kept the same appearance. '+
            'Now if you click once on "I love it" it checks it and keeps it checked. If you click again, it unchecks and cancels your vote. '+
            'Otherwise if you check "I don\'t love it", it will uncheck the other button if necessary and check this one instead. Then, the actual '+
            'view of the post on your screen depends of the sum of all votes and it changes in real time.',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
