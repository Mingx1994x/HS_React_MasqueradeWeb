import { useEffect } from "react";
import { Modal } from "bootstrap";

const DeleteModal = ({
  modalRef,
  title,
  id,
  deleteMode,
  closeDeleteModal,
  deleteMethod,
}) => {
  useEffect(() => {
    new Modal(modalRef.current, {
      backdrop: "static",
    });
  }, []);

  return (
    <div
      className="modal"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="deleteLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fs-5" id="deleteLabel">
              刪除商品
            </h3>
            <button
              type="button"
              className="btn-close"
              onClick={closeDeleteModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{`確定刪除"${title}"嗎?`}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDeleteModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteMode === "single" ? deleteMethod(id) : deleteMethod();
              }}
            >
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
