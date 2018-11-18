import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from "./services/loader.service";

@Component({
  selector: 'app-root',
  template: '<router-outlet><span *ngIf="showLoader" class="loading"></span></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  showLoader: boolean = false;
  constructor(translate: TranslateService,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit() {
    this.consoleTest();
  }
  ngAfterViewChecked() {
    this.loaderService.status.subscribe((val: boolean) => {
      // this.cdRef.detectChanges();
      this.showLoader = val;
      this.showLoader = false;
    });
  }
  consoleTest() {
    const foo    = { name: 'tom',   age: 30, nervous: false };
const bar    = { name: 'dick',  age: 40, nervous: false };
const baz    = { name: 'harry', age: 50, nervous: true };
const arr = [ {
  "name": "#ChainedToTheRhythm",
  "url": "http://twitter.com/search?q=%23ChainedToTheRhythm",
  "promoted_content": null,
  "query": "%23ChainedToTheRhythm",
  "tweet_volume": 48857
}, {
  "name": "#ChainedToTheRhythm",
  "url": "http://twitter.com/search?q=%23ChainedToTheRhythm",
  "promoted_content": null,
  "query": "%23ChainedToTheRhythm",
  "tweet_volume": 48857
}, {
  "name": "#ChainedToTheRhythm",
  "url": "http://twitter.com/search?q=%23ChainedToTheRhythm",
  "promoted_content": null,
  "query": "%23ChainedToTheRhythm",
  "tweet_volume": 48857
},];


'Bad Code 💩'

console.log(foo);
console.log(bar);
console.log(baz);



'Good Code ✅'

// Computed Property Names

console.log('%c My Friends', 'color: orange; font-weight: bold;' )
console.log({ foo, bar, baz });

// Console.table(...)
console.table([foo, bar, baz])


// // Console.time
console.time('looper')

let i = 0;
while (i < 1000000) { i ++ }

console.timeEnd('looper')

// // Stack Trace Logs

const deleteMe = () => console.trace('bye bye database')

deleteMe()
deleteMe()
console.table(arr[0]);
  }
  

}
