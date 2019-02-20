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
      title:'<strike>English here, French there?</strike> <span class="glyphicon glyphicon-arrow-right"></span> <b>English everywhere</b>',
      text:'I\'m French, I like my language, but I don\'t like it mixed with anything else. Moreover, for technical applications, I think English suits better.<br/>'+
            'So, English it will be until I know how to manage translations properly <i>(which was a former idea, but I gave up because of what\'s following)</i>.',
    },
    {
      title:'<b>Data persistence</b> or nothing',
      text:'That sounded obvious to use Firebase to keep the posts alive.',
    },
    {
      title:'<b>Reactive form</b> rather than template method',
      text:'By reading the course, I thought the reactive method was better, so I picked this one.',
    },
    {
      title:'<strike>Update locale then save the entire /post</strike> <span class="glyphicon glyphicon-arrow-right"></span> only <b>add one unique</b> post online',
      text:'I was bothered by the fact I had to rewrite the whole "database" each time I made an action. So I looked for something better.<br/>'+
            'I also realized that was quite dangerous if several people would write at the same time because they could overwrite each other\'s messages.',
    },
    {
      title:'<strike>Update locale then save the entire /post</strike> <span class="glyphicon glyphicon-arrow-right"></span> only <b>remove the selected</b> post online',
      text:'Same motivation as above, that felt better.',
    },
    {
      title:'Add a <b>data protection</b> service',
      text:'<p>I thought that wasn\'t great to let people remove posts they didn\'t write, though I didn\'t want to bother with manual identification, so I looked for '+
            'something else. By keeping track of public IP address, I can check if the user actually wrote what he wants to delete.</p>'+
            '<p>Yeah, I know this isn\'t really reliable, but that\'s a first step.</p>'+
            '<p>So I made a new service called Globals which is passed to every component to share global variables. In that service, I retrieve the'+
            ' IP from an online API and store it in new posts and compare the current IP with the one in the post the user wants to delete.</p>',
    },
    {
      title:'<b>Confirmation</b>',
      text:'Also, I added a short message asking for confirmation before trying to delete a post.',
    },
    {
      title:'Check connection to limit app access',
      text:'When offline, nothing can/must be done. So I check that and display a message instead of the regular content if offline.'+
            ' Since it takes a few seconds to get the IP from the API, I had to choose between real time checking and on specific action. So it\'s not perfect..',
    },
    {
      title:'<b>Correct management</b> of loveIts',
      text:'<p>When starting the last part of the work, I wondered how to manage it since I wanted the app to be able to take into account '+
            'several votes on the same post at the same time without overwriting <i>(always the same concern)</i>. So my first thought was I couldn\'t '+
            'just update the number of loveIts according to the locale value.</p>'+
            '<p><ul><li>The first idea was to make a sub-table which would include all the actual clicks, then I would just have to sum everything.</li>'+
            '<li>The second idea was to, just as I did for the deleting part, grab the user\'s IP to limit votes to one per post, without removing the '+
            '"I changed my mind" option. This would also prevent from oversizing the table with thousands of clicks...</li>'+
            '<li>The third idea was that the first one wasn\'t that good. It would mean I\'d have to sum everything at every new refresh. So I checked '+
            'a bit more on Google and found a doc about transactional operations. And I <i>"saw that it was good"</i>.</li></ul></p>'+
            '<p>So in order to make all of that happen I had to change a lot of things in the functionalities. But I kept the same appearance. '+
            'Now if you click once on "I love it" it checks it and keeps it checked. If you click again, it unchecks and cancels your vote. '+
            'Otherwise if you check "I don\'t love it", it will uncheck the other button if necessary and check this one instead. Then, the actual '+
            'view of the post on your screen depends of the sum of all votes and it changes in real time.</p>'+
            '<p>Finally, after spending a lot of time thinking about the best way to do something smart, I decided those:<ul>'+
            '<li>It\'s complete non-sense to have only one counter, so I\'ll have two. Ups and Downs.</li>'+
            '<li>I need to keep record of everything, so I can show the user if (s)he has already voted. That will be displayed on the Like buttons.</li>'+
            '<li><strike>I need to use transaction in order to not overwrite anything.</strike> I don\'t keep Ups and Downs in database, I calculate it from votes.</li>'+
            '<li>Last but not least, everything will be refreshed in real time ;-)</li>'+
            '',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
