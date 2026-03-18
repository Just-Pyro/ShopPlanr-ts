import { Link } from "react-router-dom";

interface RegLogLinkProp {
  type: string;
}

const RegLogLink = ({ type = "register" }: RegLogLinkProp) => {
  return type == "register" ? (
    <p className="text-center main-text text-sm">
      Already have an account?{" "}
      <Link to="/" className="text-link text-accent">
        Login
      </Link>
    </p>
  ) : (
    <p className="text-center main-text text-sm">
      Don't have an account?{" "}
      <Link to="/register" className="text-link text-accent">
        Register
      </Link>
    </p>
  );
};

export default RegLogLink;
