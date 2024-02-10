import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/services/items.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private itemService: ItemsService,
  ) { }

  @Input() title: any;
  openmodel: boolean = false;

  itemForm: FormGroup = new FormGroup({
    projectTitle: new FormControl(''),
    projectName: new FormControl(''),
    projectStartDate: new FormControl(''),
    projectDescription: new FormControl(''),
  });

  get f(): { [key: string]: AbstractControl } {
    return this.itemForm.controls;
  }

  itemID: number = 0;
  itemName: string = "";
  itemDescription: string = "";
  itemType: string = "";
  itemDate: any;
  validationError: string = '';
  submitted = false;


  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      itemId: 0,
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]
      ],

      description: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]
      ],

      type: [
        '',
        [Validators.required]
      ],

      date: ['',[Validators.required]]
    });

    var item = {
      "id": this.itemID,
      "name": this.itemName,
      "description": this.itemDescription,
      "type": this.itemType,
      "date": this.itemDate
    };
    this.itemForm.patchValue(item);
  }

  buildModel(item: any) {
    var Date = this.parseDateString(item.startDate);
    this.itemID = item.projectID;
    this.itemName = item.title;
    this.itemDescription = item.name;
    this.itemType = item.description;
    this.itemDate =Date;
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.itemForm.invalid) {
      return;
    }
    var Projects = {
      "projectID": this.itemID,
      "name": this.itemName,
      "description": this.itemDescription,
      "Name": this.itemType,
      "startDate": this.itemDate,
    };
    Projects = this.itemForm.value;
    this.itemService.addItem(Projects).subscribe({
      next: () =>{
        this.activeModal.close(Projects);
      }
    })
  }

  parseDateString(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
  }
  

}
