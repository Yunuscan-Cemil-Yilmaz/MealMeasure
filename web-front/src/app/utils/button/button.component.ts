import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-utilty-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string = 'Button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'primary' | 'secondary' | 'success' = 'success';

  @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  handleClick(): void {
    if (!this.disabled && !this.loading){
      this.clicked.emit();
    }
  }

}
