import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
const SweetAlert = () => {
  const sweetAlertToast = useRef(null);
  const alert = useSelector((state) => state.sweetAlert.toastState);
  useEffect(() => {
    sweetAlertToast.current = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    if (alert.created_time) {
      sweetAlertToast.current.fire({
        icon: alert.status,
        title: alert.content,
      });
    }
  }, [alert.created_time]);
};

export default SweetAlert;
