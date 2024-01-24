import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { PageAnimations } from './page.animations';
import { FirebaseService } from '../../core/firebase/firebase.service';
import { tap, filter, withLatestFrom, take, takeUntil, map, subscribeOn } from 'rxjs/operators';
import { distinctUntilChanged, interval, Observable, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { User } from '../../core/store/user/user.model';
import { PageSelectors } from './+state/page.selectors';
import { LoadData, Cleanup } from './+state/page.actions';
import { RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';
import { LongTermGoal } from '../../core/store/long-term-goal/long-term-goal.model';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { UpdateLongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.actions';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
  providers: [MatDialogModule],
})
export class PageComponent implements OnInit {

  // --------------- ROUTE PARAMS & CURRENT USER ---------
  // currentUser$: Observable<User> = of({
  //   __id: 'test-user',
  //   email: 'test@sample.com',
  //   name: 'Test User',
  //   photoURL: 'http://placekitten.com/100/100',
  //   onboardingState: 1,
  // });
  currentUser$: Observable<User> = this.store.pipe(
    select(fromAuth.selectUser),
    filter((user) => user !== null),
  );
  // --------------- LOCAL AND GLOBAL STATE --------------
  /** For storing the dialogRef in the opened modal. */
  dialogRef: MatDialogRef<any>;


  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  // --------------- DATA BINDING ------------------------

  longTermGoal$: Observable<LongTermGoal> = this.selectors.selectLongTermData(
    this.currentUser$,
    this.containerId,
  );

  // --------------- EVENT BINDING -----------------------
  openEditModal$: Subject<void> = new Subject();

  // saveGoals$: Subject<{ goals: [oneYear, fiveYear], loading$: BehaviorSubject<boolean> }> = new Subject();
  saveGoals$: Subject<{
    goals: [string, string]; 
    loading$: BehaviorSubject<boolean>;
  }> = new Subject();

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();
  // dialog: any;

  constructor(
    private route: ActivatedRoute,
    private selectors: PageSelectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() { 
    // --------------- EVENT HANDLING ----------------------
    this.openEditModal$
    .pipe(
      withLatestFrom(this.longTermGoal$),
      takeUntil(this.unsubscribe$)
    )
    .subscribe(([_, longTermGoal]) => {
      this.dialogRef = this.dialog.open(ModalComponent, {
        height: '366px',
        width: '100%',
        maxWidth: '500px',
        data: {
          longTermGoal: longTermGoal,
          updateGoals: (
            goals: (longtermgoal: LongTermGoal) => {
              this.store.dispatch(
                new UpdateLongTermGoal(
                  longTermGoal.__id,
                  {
                    oneYear: longTermGoal.oneYear,
                    fiveYear: longTermGoal.fiveYear
                  },
                  this.containerId
                )
              );
              console.log(longTermGoal); 
            }
          )
        }
      });
    });

  

    /** Handle save goals events. */
    // this.saveGoals$
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(({ goals, loading$ }) => {
    //   // Define the action sets we'd like to dispatch
    //   const actionSets = goals.map((g, i) => {
    //     return {
    //       action: new UpdateQuarterGoal(
    //         g.__id,
    //         {
    //           text: g.text,
    //           order: i + 1,
    //         },
    //         this.containerId
    //       ),
    //       responseActionTypes: {
    //         success: QuarterGoalActionTypes.UPDATE_SUCCESS,
    //         failure: QuarterGoalActionTypes.UPDATE_FAIL,
    //       },
    //     };
    //   });

    // --------------- LOAD DATA ---------------------------
    // Once everything is set up, load the data for the role.

    combineLatest(this.currentUser$).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([currentUser]) => {
      this.store.dispatch(
        new LoadData({
          currentUser,
        }, this.containerId)
      );
    });

  }

  ngOnDestroy() {
    // Unsubscribe subscriptions.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Unsubscribe from firebase connection from load and free up memoized selector values.
    this.store.dispatch(new Cleanup(this.containerId));
    this.selectors.cleanup(this.containerId);
  }
}
