export class Items {
    id: number=0;
    name: string="";
    description: string ="";
    type: string ="";
    date:any;

  constructor(
    itemId: number,
    itemName: any,
    itemDescription: any,
    itemType: string,
    itemDate: any,
  ) {
    this.id = itemId;
    this.name = itemName;
    this.description = itemDescription;
    this.type = itemType;
    this.date = itemDate;
  }
}