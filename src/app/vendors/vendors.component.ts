import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { PropertyServiceService } from '../property-service.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {


  constructor(private http: HttpClient, public dialog: MatDialog, private property: PropertyServiceService) {
  }
  dataList: any
  vendorList: any
  isApprovedVendor: boolean = false
  url = this.property.uri
  ngOnInit(): void {
    this.isApprovedVendor = false
    this.getAllVendors();
  }
  getVendorDetails(list) {
    this.vendorList = list
    var dialogClosed = this.dialog.open(DialogModalComponent, {
      width: '50%', height: '80%', autoFocus: false,
      data: { title: "Vendor Details", divType: 'getVendorDetails', vendor_list: list }
    });
    dialogClosed.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // this.getApprovedVendors();
        this.getAllVendors();
      }
    });

  }

  getAllVendors() {
    this.dataList = []
    this.http.post(this.url + 'admin/get_all_vendors', '').subscribe((res: any) => {
      if (res.status_code == "200") {
        this.dataList = res.data.result;
      }
    });
  }
  getApprovedVendors() {
    let formObj = new FormData();
    formObj.append('admin_user_id', '1')
    this.dataList = []
    this.isApprovedVendor = true
    this.http.post(this.url + 'admin/get_approved_vendors', formObj).subscribe((res: any) => {
      if (res.status_code == "200") {
        this.dataList = res.data.result;
      }
    });
  }
  getVendorRejectedOrders(list) {
    if (list.rejected_orders.length > 0) {
      this.dialog.open(DialogModalComponent, {
        width: '50%',
        data: { title: "Vendor Rejected List", divType: 'getVendorRejectedList', vendor_list: list }
      });
    }
  }
  back() {
    this.isApprovedVendor = false
    this.getAllVendors();
  }

  approveVendor(id) {
    let formObj = new FormData();
    formObj.append('user_id', id)
    this.http.post(this.url + 'admin/approve_vendor', formObj).subscribe((res: any) => {
      if (res.status_code == "200") {
        // this.dataList = res.data.result;
        this.getAllVendors()
      }
    });
  }
  rejectVendor(id){
    let formObj = new FormData();
    formObj.append('user_id', id)
    formObj.append('is_vendor_rejected', "Y")
    this.http.post(this.url + 'admin/reject_vendor', formObj).subscribe((res: any) => {
      if (res.status_code == "200") {
        // this.dataList = res.data.result;
        this.getAllVendors()
      }
    });
  }
  deleteVendor(id){
    let formObj = new FormData();
    formObj.append('user_id', id)
    this.http.post(this.url + 'admin/delete_vendor', formObj).subscribe((res: any) => {
      if (res.status_code == "200") {
        // this.dataList = res.data.result;
        this.getAllVendors()
      }
    });
  }
  suspendVendor(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: '22%',
      data: { title: "Suspend Vendor", message: "Are you want to suspend this vendor!" }
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let formObj = new FormData();
        formObj.append('user_id', id)
        formObj.append('is_vendor_suspend', 'Y')
        this.http.post(this.url + 'admin/suspend_vendor', formObj).subscribe((res: any) => {
          if (res.status_code == "200") {
            this.getApprovedVendors()
          }
        });
      }
    })
  }
 activateSuspendVendor(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: '22%',
      data: { title: "Vendor Activation", message: "Are you want to activate this vendor!" }
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let formObj = new FormData();
        formObj.append('user_id', id)
        formObj.append('is_vendor_suspend', 'N')
        this.http.post(this.url + 'admin/suspend_vendor', formObj).subscribe((res: any) => {
          if (res.status_code == "200") {
            this.getApprovedVendors()
          }
        });
      }
    })
  }
  addVendorPoints(list) {
    var dialogResult = this.dialog.open(DialogModalComponent, {
      width: '50%',
      data: { title: "Add Vendor Points", divType: 'addVendorPoints', vendor_id: list.id, vendor_name: list.first_name }
    });
    dialogResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getApprovedVendors();
      }
    });
  }
}
