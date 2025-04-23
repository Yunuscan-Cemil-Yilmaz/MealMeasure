import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: '.utility-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {

  @Input() type: string = 'text';         
  @Input() placeholder: string = '';        
  @Input() model: string = '';    

  @Output() valueChanged = new EventEmitter<string>();

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(inputValue)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
