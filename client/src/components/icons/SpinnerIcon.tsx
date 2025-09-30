import { FaSpinner } from "react-icons/fa";

const SpinnerIcon = () => {
  return (
    <FaSpinner
      className="spinner-icon"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        fontSize: "40px",
        color: "#fff",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    />
  );
};

export default SpinnerIcon;
