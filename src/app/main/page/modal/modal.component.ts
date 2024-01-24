import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { QuarterData, QuarterGoalInForm } from '../+state/page.model';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';
import { UpdateLongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.actions';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  // constructor() { }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      longTermGoal: LongTermGoal,
      updateGoals: (
        goals: [string, string],
        loading$: BehaviorSubject<boolean>,
      ) => void,
    },
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }
  

  ngOnInit(): void {
  }
}
