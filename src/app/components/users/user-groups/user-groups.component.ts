import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
  itemDialog: boolean = false;

  deleteItemDialog: boolean = false;

  deleteItemsDialog: boolean = false;

  items: Item[] = [];

  item: Item = {};

  selectedItems: Item[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemService.getItems().then((data: any) => this.items = data);

    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
      { field: 'rating', header: 'Reviews' },
      { field: 'inventoryStatus', header: 'Status' }
    ];

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  deleteSelectedItems() {
    this.deleteItemsDialog = true;
  }

  editItem(item: Item) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: Item) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDeleteSelected() {
    this.deleteItemsDialog = false;
    this.items = this.items.filter(val => !this.selectedItems.includes(val));
    // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
    this.selectedItems = [];
  }

  confirmDelete() {
    this.deleteItemDialog = false;
    this.items = this.items.filter(val => val.id !== this.item.id);
    // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
    this.item = {};
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.item.name?.trim()) {
      if (this.item.id) {
        // @ts-ignore
        this.item.inventoryStatus = this.item.inventoryStatus.value ? this.item.inventoryStatus.value : this.item.inventoryStatus;
        this.items[this.findIndexById(this.item.id)] = this.item;
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
      } else {
        this.item.id = this.createId();
        this.item.code = this.createId();
        this.item.image = 'item-placeholder.svg';
        // @ts-ignore
        this.item.inventoryStatus = this.item.inventoryStatus ? this.item.inventoryStatus.value : 'INSTOCK';
        this.items.push(this.item);
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
      }

      this.items = [...this.items];
      this.itemDialog = false;
      this.item = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
