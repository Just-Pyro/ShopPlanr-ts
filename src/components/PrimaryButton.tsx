interface PrimaryButtonProp {
  type: "button" | "submit";
  text: React.ReactNode;
  className: string;
  disabled: boolean;
}

const PrimaryButton = ({
  type = "button",
  text = "",
  className = "",
  disabled = false,
}: PrimaryButtonProp) => {
  return (
    <button
      type={type}
      className={`bg-accent primary-button ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
