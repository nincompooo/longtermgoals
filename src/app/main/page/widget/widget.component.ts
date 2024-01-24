import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';
// import { LongTermGoal } from '../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The long term goal. */
  @Input() longTermGoal: LongTermGoal;
    
  /** Initiate edit of long term goals. */
  @Output() editGoals: EventEmitter<void> = new EventEmitter<void>();

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------
  edit() {
    this.editGoals.emit()
  }

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor() { }

  ngOnInit(): void {
  }
}
