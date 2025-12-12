// swalAlerts.js
import Swal from "sweetalert2";

const SuccessPopup = (title, timer = 2000, target) => {
  const options = {
    icon: "success",
    title: title,
    timer: timer,
    confirmButtonText: "Ok",
    confirmButtonColor: "#33996A",
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

export default SuccessPopup;
