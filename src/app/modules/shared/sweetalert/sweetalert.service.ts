import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {
  processProgress: any
  alertBasic(title: string) {
    swal.fire({
      title: title,
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-fill btn-success"
      }
    })
  }

  alertBasicWithText(title: string, description: string, buttonText: string) {
    swal.fire({
      title: title,
      text: description,
      buttonsStyling: false,
      confirmButtonText: buttonText || "OK",
      customClass: {
        confirmButton: "btn btn-fill btn-info"
      }
    })
  }

  alertSuccess(title: string, description: string, buttonText: string) {
    swal.fire({
      title: title,
      text: description,
      buttonsStyling: false,
      confirmButtonText: buttonText || "OK",
      customClass: {
        confirmButton: "btn btn-fill btn-success",
      },
      icon: "success"
    })
  }

  alertInfo(title: string, description: string, buttonText: string) {
    swal.fire({
      title: title,
      text: description,
      buttonsStyling: false,
      confirmButtonText: buttonText || "OK",
      customClass: {
        confirmButton: "btn btn-fill btn-info",
      },
      icon: "info"
    })
  }

  alertWarning(title: string, description: string, buttonText: string) {
    swal.fire({
      title: title,
      text: description,
      buttonsStyling: false,
      confirmButtonText: buttonText || "OK",
      customClass: {
        confirmButton: "btn btn-fill btn-warning",
      },
      icon: "warning"
    })
  }

  alertError(title: string, description: string, buttonText: string) {
    swal.fire({
      title: title,
      text: description,
      buttonsStyling: false,
      confirmButtonText: buttonText || "OK",
      customClass: {
        confirmButton: "btn btn-fill btn-danger",
      },
      icon: "error"
    })
  }


  alertSuccessSetTimeOut(title: string, description: string, timeOut: number) {
    return swal.fire({
      icon: 'success',
      title: title || '',
      text: description || '',
      timer: timeOut || 1000,
      showCancelButton: false,
      showConfirmButton: false
    })
  }

  alertErrorSetTimeOut(title: string, description: string, timeOut: number) {
    return swal.fire({
      icon: 'error',
      title: title || '',
      text: description || '',
      timer: timeOut || 1000,
      showCancelButton: false,
      showConfirmButton: false
    })
  }


  alertwarningSetTimeOut(title: string, description: string, timeOut: number) {
    return swal.fire({
      icon: 'warning',
      title: title || '',
      text: description || '',
      timer: timeOut || 1000,
      showCancelButton: false,
      showConfirmButton: false
    })
  }


  alertConfirm(title: string, description: string, confirmText: string, cancelText: string) {
    return swal.fire({
      title: title,
      text: description,
      icon: 'question',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-fill btn-primary btn-mr-5',
        cancelButton: 'btn btn-fill btn-default',
      },
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      buttonsStyling: false,
    })
  }

  alertConfirmDanger(title: string, description: string, confirmText: string, cancelText: string) {
    return swal.fire({
      title: title,
      text: description,
      icon: 'question',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-fill btn-danger btn-mr-5',
        cancelButton: 'btn btn-fill btn-default',
      },
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      buttonsStyling: false,

    })
  }

  showProgress(title: string, description: string, confirmText: string, cancelText: string) {
    this.processProgress = swal.fire({
      title: title,
      text: description,
      timerProgressBar: true,
      didOpen: () => {
        swal.showLoading()
      },
      allowOutsideClick: false
    })
  }

  closeProgrss() {
    this.processProgress.close()
  }
}
