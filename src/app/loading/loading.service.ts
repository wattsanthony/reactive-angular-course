import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, tap, finalize } from "rxjs/operators";

@Injectable()
export class LoadingService{

    // Subject to hold bool for emitting
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // Observable to hold loading subject as observable
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    // Takes observable and turns off when completed
    // uses generic <T> to handle multiple observable types
    showLoaderUntilCompleted<T>(obs$: Observable<T>):Observable<T>{
        
        // Create default(null) observable
        return of(null).pipe(
            // Turn on loading
            tap( () => { this.loadingOn() } ),
            // Map to observable param
            concatMap( () => obs$ ),
            // When done, loading off
            finalize( () => { this.loadingOff() } )
        );

    }

    // Turns on the loading
    loadingOn(){
        this.loadingSubject.next(true);
    }

    // Turns off the loading
    loadingOff(){
        this.loadingSubject.next(false);
    }
}