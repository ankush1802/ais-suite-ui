import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-confirmation-Dialog',
    templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {
    @Input() showConfirmationDialog : boolean;
    @Input() msgConfirmationDialog : string;
    @Input() showYesButton : boolean;
    @Input() yesButtonText : string;
    @Input() showNoButton : boolean;
    @Input() noButtonText : string;

    @Output() closeConfirmationDialogEvent = new EventEmitter<boolean>();
    @Output() confirmationDialogActionEvent = new EventEmitter<boolean>();
    ngOnInit(): void {

    }
    cancelDelete(){
        this.closeConfirmationDialogEvent.emit(false);
    }
    confirmDelete(){
        this.confirmationDialogActionEvent.emit(true);
        this.closeConfirmationDialogEvent.emit(false);
    }
}
