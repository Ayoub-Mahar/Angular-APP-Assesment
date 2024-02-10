import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { Items } from 'src/models/items';
import { ItemsService } from 'src/services/items.service';
import { AddItemComponent } from './add-item/add-item.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {

  searchItemName: string = '';
  searchItemType: string = '';

  ngOnInit(): void {
    this.searchItems();
  }

  public gridData: GridDataResult = {
    data: [],
    total: 0,
  };
  public pageSize = 10;
  public skip = 0;

  constructor(
    private toastr: ToastrService,
    public modalService: NgbModal,
    private itemService: ItemsService,
  ) {
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.searchItems();
  }

  addItem() {
    const modalRef = this.modalService.open(AddItemComponent);
    modalRef.componentInstance.title = 'Add New Item';

    modalRef.result.then((item) => {
      this.searchItems();  
        this.toastr.success('Save Success');
    },(closeModal:any) => {});
  }

  deleteItem(projectId: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(projectId).subscribe(() => {
        this.searchItems(); 
        this.toastr.success('Delete Success');
      });
    }
  }

  async searchItems(): Promise<void> {
    try {
      const response = await this.itemService.getItemList();
      if (response !== undefined) {
        if (response && response.length > 0) {
          const item: Items[] = response.map((item: any) => {
            const formattedDate = format(new Date(item.itemDate), 'dd-MM-yyyy');
            return new Items(
              item.id,
              item.itemName,
              item.itemDescription,
              item.itemType,
              formattedDate,
            );
          });
          this.gridData = {
            data: item.slice(this.skip, this.skip + this.pageSize),
            total: item.length,
          };
        } else {
          console.log('No item found in the response.');
        }
      } else {
        console.error('getItemList returned undefined');
        // Handle the case where the response is undefined
      }
    } catch (error) {
      console.error('Error fetching item list:');
      // Handle the error, show a user-friendly message, etc.
    }
  }
 
}
