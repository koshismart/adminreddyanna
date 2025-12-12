// swalAlerts.js
import Swal from "sweetalert2";

const WarningPopup = (title, target, confirmBtnText) => {
  const options = {
    icon: "warning",
    title: title,
    confirmButtonText: confirmBtnText || "Confirm",
    confirmButtonColor: "#33996A",
    showCancelButton: true, // Enables the Cancel button
    cancelButtonText: "Cancel", // Text for Cancel button
    cancelButtonColor: "#d33", // Red color for Cancel button
    showClass: {
      popup: "swal2-show",
      backdrop: "swal2-backdrop-show",
      icon: "swal2-icon-show",
    },
    hideClass: {
      popup: "swal2-hide",
      backdrop: "swal2-backdrop-hide",
      icon: "swal2-icon-hide",
    },
  };

  // Add target conditionally
  if (target) {
    options.target = target;
  }

  return Swal.fire(options);
};

export default WarningPopup;
