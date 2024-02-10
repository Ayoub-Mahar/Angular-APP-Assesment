import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Items } from 'src/models/items';
import { HttpClient } from "@angular/common/http";
import { GlobalComponent } from 'src/global-component';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private projectsSubject: BehaviorSubject<Items[]> = new BehaviorSubject<Items[]>([]);
  public projects$: Observable<Items[]> = this.projectsSubject.asObservable();

  constructor(private httpClient: HttpClient) { }
  
  async getItemList(): Promise<any[]| undefined> {
    try {
      const response = await this.httpClient.get<any[]>(GlobalComponent.API_URL + 'Items').toPromise();
      return response;
    } catch (error) {
      console.error('Error in getItemList:', error);
      throw new Error('Failed to fetch items. Please try again later.');
    }
  }
  

  addItem(project: any): Observable<any> {
    const itemObject = {
      "id": 0,
      "itemName": project.name,
      "itemDescription": project.description,
      "itemType": project.type,
      "itemDate": project.date
    };

    return this.httpClient.post<any>(GlobalComponent.API_URL + 'Items', itemObject);
  }

  deleteItem(itemId: any) {
    return this.httpClient.delete<any>(GlobalComponent.API_URL + `Items?id=${itemId}`);
  }

}
