import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import RegLogLink from "../components/RegLogLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/ClientApi";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await registerUser(input);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data));
        toast.success(result.message);

        setTimeout(() => {
          navigate("/list");
        }, 1500);
      }
    } catch (error: any) {
      console.error("error", error.response?.data);
      const message = error.response?.data?.message;

      if (message) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <form onSubmit={handleFormSubmit} className="logreg-form">
        <Link
          to="/"
          className="absolute text-accent top-7 left-7 text-lg font-extrabold"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <input
          className="inputfield placeholder:main-text main-text mt-7"
          type="text"
          name="first_name"
          placeholder="First Name"
          onInput={(e) =>
            setInput((prev) => ({
              ...prev,
              first_name: (e.target as HTMLInputElement).value,
            }))
          }
          value={input.first_name}
          required
        />
        <input
          className="inputfield placeholder:main-text main-text"
          type="text"
          name="last_name"
          placeholder="Last Name"
          onInput={(e) =>
            setInput((prev) => ({
              ...prev,
              last_name: (e.target as HTMLInputElement).value,
            }))
          }
          value={input.last_name}
          required
        />
        <input
          className="inputfield placeholder:main-text main-text"
          type="email"
          name="email"
          placeholder="Email"
          onInput={(e) =>
            setInput((prev) => ({
              ...prev,
              email: (e.target as HTMLInputElement).value,
            }))
          }
          value={input.email}
          required
        />
        <input
          className="inputfield placeholder:main-text main-text"
          type="password"
          name="password"
          placeholder="Password"
          onInput={(e) =>
            setInput((prev) => ({
              ...prev,
              password: (e.target as HTMLInputElement).value,
            }))
          }
          value={input.password}
          required
        />
        <PrimaryButton
          type="submit"
          text={isLoading ? <div className="loader"></div> : "Register"}
          disabled={isLoading}
          className="mt-6"
        />
        <RegLogLink type="register" />
      </form>
    </div>
  );
};

export default Register;
