import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import { bufferTime, distinctUntilChanged, shareReplay, mergeMap, filter, switchMap, map } from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  // selectLongTermData: any;
  constructor(private slRx: EntitySelectorService) {}

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }

  // selectQuarterData(quarterStartTime$: Observable<number>, currentUser$: Observable<User>, cId: string): Observable<QuarterData> {

  //   return combineLatest(quarterStartTime$, currentUser$).pipe(
  //     switchMap(([quarterStartTime, currentUser]) => {
  //       return this.slRx.selectQuarter<QuarterData>(`${quarterStartTime}`, cId, (q) => ({
  //         quarterGoals: this.slRx.selectQuarterGoals([
  //           ['__userId', '==', currentUser.__id],
  //           ['__quarterId', '==', q.__id],
  //         ], cId).pipe(
  //           map(goals => {
  //             goals.sort((a, b) => a.order - b.order);
  //             return goals;
  //           }),
  //         ),
  //       }));
  //     }),
  //   );
  // }

  selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermGoal>{
    return (currentUser$).pipe(
      switchMap((currentUser) =>{
        return this.slRx.selectLongTermGoals<LongTermGoal>([['__userId', '==', currentUser.__id]], cId).pipe(
          switchMap
          (goals => {
          return goals;
        }),
        );
      }),
    );
  }

  // /** Select the quarter data. */
  // selectLongTermData(currentUser$: Observable<User>, cID: string): Observable<LongTermGoal> {
  //   return currentUser$.pipe(
  //     switchMap((currentUser) => {
  //       return this.slRx.selectLongTermGoals<LongTermGoal>([['__userId', '==', currentUser.__id]], cID).pipe(
  //         switchMap(goals => {
  //           return of(goals); 
  //         })
  //       );
  //     })
  //   );
  // }

// selectLongTermData (containerId: string) {
//   return this.slRx,seleectLongTermGoal('ltg', containerId);
// }
}