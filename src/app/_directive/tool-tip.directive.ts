import {Directive, ElementRef, Input} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appToolTip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class ToolTipDirective {
  @Input() toolTipValue: any;
  dataRes: any;
  constructor(public er: ElementRef) {
  }
  onMouseEnter() {
    // console.log(this.toolTipValue);
    let text = '';
    let i;
    for (i = 0; i < this.toolTipValue.length; i++) {
      text += this.toolTipValue[i].testcaseName + '<br>';
    }
    // console.log(text);
    $(this.er.nativeElement).tooltip({title: text, html: true});
    text = '';
  }
  onMouseLeave() {
    this.toolTipValue = [];
  }


}
