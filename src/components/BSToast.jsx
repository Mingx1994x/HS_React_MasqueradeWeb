import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToastMessage } from '../slice/bootstrapToast';
import { Toast } from 'bootstrap';
const BSToast = () => {
  const toastMessages = useSelector((state) => state.bsToast.messages);
  const bsToastRef = useRef({});
  const bsToast = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    toastMessages.forEach((message) => {
      const messageEl = bsToastRef.current[message.id];
      if (messageEl) {
        bsToast.current = new Toast(messageEl);
        bsToast.current.show();
        setTimeout(() => {
          dispatch(removeToastMessage(message.id));
        }, 3000);
      }
    });
  }, [toastMessages]);
  return (
    <div className="position-relative">
      <div className="toast-container top-0 end-0 p-3">
        {toastMessages.map((message) => (
          <div
            className="toast"
            role="alert"
            key={message.id}
            ref={(el) => {
              if (el) {
                bsToastRef.current[message.id] = el;
              }
            }}
          >
            <div
              className={`toast-header ${
                message.status === 'success' ? 'bg-success' : 'bg-danger'
              }`}
            >
              {message.mode === 'delete' ? (
                <i className="bi bi-trash text-danger me-2"></i>
              ) : message.mode === 'edit' ? (
                <i className="bi bi-pencil-square text-primary-700 me-2"></i>
              ) : (
                <i className="bi bi-plus-circle-fill text-warning me-2"></i>
              )}
              <strong className="me-auto text-white">{message.title}</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => {
                  dispatch(removeToastMessage(message.id));
                }}
              ></button>
            </div>
            <div className="toast-body">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BSToast;
