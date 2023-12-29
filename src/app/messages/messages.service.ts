import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService{

    // Private subject to emit errors
    private subject = new BehaviorSubject<string[]>([]);

    // Observable to hold subject as observable
    errors$:Observable<string[]> = this.subject.asObservable().pipe(
        // Filter out empty/null so it isn't always displayed
        filter(messages => messages && messages.length > 0)
    );

    // Function to show any number of errors
    // Takes a string array of errors
    showErrors(...errors:string[]){
        // Emit the given errors
        this.subject.next(errors);
    }

}