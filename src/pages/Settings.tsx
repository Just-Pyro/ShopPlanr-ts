import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const Settings = () => {
  const [user, setUser] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      throw new Error("User Session not set! Please re-login");
    }
    setUser(JSON.parse(user));
  }, []);

  const ucwordsRegex = (str: string) => {
    str = String(str).toLowerCase();

    return str.replace(/(^|\s)\S/g, function (match) {
      return match.toUpperCase();
    });
  };

  return (
    <Layout>
      <div className="p-3 md:p-6 2xl:px-72">
        <div className="border border-gray-50 shadow bg-white rounded-xl p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6">
          <div className="profile w-16 h-16 rounded-full border border-gray-200 bg-gray-200 self-center flex justify-center items-center text-3xl font-bold main-text">
            {user.first_name[0] + user.last_name[0]}
          </div>
          <div className="flex-1 flex flex-col justify-between py-1 self-center">
            <p className="text-2xl main-text text-center md:text-left">
              {ucwordsRegex(user.full_name)}
            </p>
            <p className="italic text-gray-400">{user.email}</p>
          </div>
          <div className="flex flex-col justify-end pb-1 self-center">
            <p className="italic text-gray-400">v1.0</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
