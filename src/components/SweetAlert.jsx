import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
const SweetAlert = memo(({ alertMessage }) => {
  // const alertMessage = useSelector((state) => state.sweetAlert.toastState);
  const sweetAlertToast = useRef(null);
  const preToastId = useRef(null);
  useEffect(() => {
    if (!alertMessage.id || preToastId.current === alertMessage.id) return;

    preToastId.current = alertMessage.id;

    if (alertMessage) {
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
      sweetAlertToast.current.fire({
        icon: alertMessage.status,
        title: alertMessage.content,
      });
    }
  }, [alertMessage]);

  useEffect(() => {
    console.log(!alertMessage.id);
    console.log(preToastId.current === alertMessage.id);
  }, [alertMessage]);

  return null;
});

export default SweetAlert;
