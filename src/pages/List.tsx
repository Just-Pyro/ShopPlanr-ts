import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPlans } from "../services/ClientApi";

type PlanType = {
  id: number;
  address: string;
  date_scheduled: string;
  budget: number;
  number_of_items: number;
  status: number;
  created_by: number;
  updated_at: string;
};

const List = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsFetching(true);
      const authUser = localStorage.getItem("user");
      const user = authUser ? JSON.parse(authUser) : null;

      if (!user) {
        throw new Error("User Session Failed Please re-login");
      }

      const result = await getPlans(user.id);

      if (result.success) {
        setPlans(result.data);
      } else {
        toast.warning(result.message);
      }
    } catch (error: any) {
      console.error("error", error);
      const message = error.response?.data?.message;

      if (message) {
        toast.error(message);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="relative h-full flex md:block flex-col gap-5">
          <div className="content-header p-3 md:p-6 2xl:px-72 absolute top-3 left-0 right-0">
            <Link to="/create" className="hidden md:block">
              <button
                type="button"
                className="bg-accent primary-action-btn w-40"
              >
                Add Plan
              </button>
            </Link>
            <div className="title-wrapper md:hidden">
              <p className="mb-3">Plans</p>
              <Link to="/create">
                <button
                  type="button"
                  className="bg-accent primary-action-btn w-full"
                >
                  Add Plan
                </button>
              </Link>
            </div>
          </div>
          <div className="content-body p-3 md:p-6 2xl:px-72 flex-1 flex flex-col gap-6 overflow-y-auto pt-44 md:pt-24">
            {plans.length > 0 ? (
              <>
                {plans.map((plan) => {
                  const statusNames = [
                    { name: "pending", color: "maintext" },
                    { name: "in progress", color: "maintext" },
                    { name: "completed", color: "text-green-400" },
                    { name: "overdue", color: "text-emphasis" },
                  ];
                  return (
                    <Item
                      key={plan.id}
                      id={plan.id}
                      total={plan.number_of_items}
                      status={statusNames[plan.status].name}
                      statusColor={statusNames[plan.status].color}
                      address={plan.address}
                    />
                  );
                })}
              </>
            ) : isFetching ? (
              <div className="flex justify-center items-center">
                <div className="loader bg-gray-500! w-10! p-3!"></div>
              </div>
            ) : (
              <div className="text-center italic text-gray-500">
                No plans yet.
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

interface ItemProp {
  id: number;
  total: number;
  status: string;
  statusColor: string;
  address: string;
}

const Item = ({ id, total, status, statusColor, address }: ItemProp) => {
  return (
    <Link to="/shopplan" state={{ id }}>
      <div className="plan-item bg-white rounded-xl border border-gray-50 shadow-md p-5 flex flex-col gap-6 cursor-pointer hover:scale-[102%] transition-all ease-in">
        <p className="item-title text-xl main-text">{address}</p>
        <p className="flex justify-between text-xs main-text">
          <span className="">Total Items: {total}</span>
          <span className={`${statusColor}`}>{status}</span>
        </p>
      </div>
    </Link>
  );
};

export default List;
