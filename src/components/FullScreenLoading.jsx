import { HashLoader } from "react-spinners";

const FullScreenLoading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(3px)",
      }}
    >
      <HashLoader
        color={"#000"}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default FullScreenLoading;
