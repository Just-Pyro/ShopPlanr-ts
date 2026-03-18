import React, { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import RegLogLink from "../components/RegLogLink";
import FormLogo from "../assets/ShopPlanr - nobg.png";
import { loginUser } from "../services/ClientApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const result = await loginUser(input);

      if (result?.success) {
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
    <>
      <div className="flex justify-center items-center h-full w-full">
        <form onSubmit={handleFormSubmit} className="logreg-form">
          <img
            src={FormLogo}
            alt="ShopPlanr Logo"
            className="w-80 mx-auto mb-5"
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
            text={isLoading ? <div className="loader"></div> : "Login"}
            disabled={isLoading}
            className="mt-6"
          />
          <RegLogLink type="login" />
        </form>
      </div>
    </>
  );
};

export default Login;
