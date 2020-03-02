import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appHover]',
})
export class HoverElementDirective implements OnInit {
  //   @HostListener('mouseenter') mouseover(eventData: Event) {
  //     this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'white');
  //   }
  //   @HostListener('mouseleave') mouseleave(eventData: Event) {
  //     this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'black');
  //   }

  @Input()
  set appHover(condition: boolean) {
    if (condition) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'background-color',
        'springgreen',
      );
    } else {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'background-color',
        'transparent',
      );
    }
  }

  constructor(
    // private templateRef: TemplateRef<any>,
    // private vcRef: ViewContainerRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {}
}
