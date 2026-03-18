import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import {
  completePlan,
  getPlanInfo,
  startPlan as usePlan,
} from "../services/ClientApi";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

type Items = {
  id: number;
  shop_plan_id: number;
  name: string;
  price: number;
  expected_quantity: number;
  actual_quantity: number;
};

type PlanInfoType = {
  address: string;
  date_scheduled: string;
  budget: number;
  number_of_items: number;
  status: number;
};

const ShopPlan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [originalBudget, setOriginalBudget] = useState(0);
  const [planInfo, setPlanInfo] = useState<PlanInfoType | null>(null);
  const [itemList, setItemList] = useState<Items[] | []>([]);
  const [startPlan, setStartPlan] = useState(false);

  useEffect(() => {
    fetchPlanInfo();
  }, []);

  const fetchPlanInfo = async () => {
    try {
      const result = await getPlanInfo(state.id);

      if (result.success) {
        const data = result.data;
        const formattedDate = new Date(data.date_scheduled).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        setOriginalBudget(data.budget);

        setPlanInfo({
          address: data.address,
          date_scheduled: formattedDate,
          budget: data.budget,
          status: data.status,
          number_of_items: data.number_of_items,
        });

        if (data.status === 1) {
          setStartPlan(true);
        }

        setItemList(data.items);
      }
    } catch (error: any) {
      console.error("error", error);
      const message = error.response?.data?.message;

      if (message) {
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    const totalPrice = itemList.reduce(
      (sum, item) => sum + item.actual_quantity * item.price,
      0,
    );

    if (Number(totalPrice.toFixed(2)) <= 0) {
      setPlanInfo((prev) =>
        prev ? { ...prev, budget: originalBudget } : null,
      );
    } else {
      setPlanInfo((prev) =>
        prev
          ? {
              ...prev,
              budget: originalBudget - Number(totalPrice.toFixed(2)),
            }
          : null,
      );
    }
  }, [itemList]);

  const handleStart = async () => {
    try {
      const authUser = localStorage.getItem("user");
      const user = authUser ? JSON.parse(authUser) : null;

      if (!user) {
        throw new Error("User Session not set! Please re-login");
      }
      const result = await usePlan(state.id, user.id);

      // console.log("start plan:", result);
      if (result.success) {
        setPlanInfo((prev) => (prev ? { ...prev, status: 1 } : null));
        setStartPlan(true);
      } else {
        toast.warning(result.message);
      }
    } catch (error: any) {
      console.error("error", error);
      const message = error.response?.data.message;

      if (message) {
        toast.error(message);
      }
    }
  };

  const handleComplete = async () => {
    try {
      const items = itemList.map(
        ({ id, shop_plan_id, expected_quantity, ...rest }) => rest,
      );
      const params = {
        status: 2,
        updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        items: items,
      };
      const result = await completePlan(params, state.id);

      if (result.success) {
        setPlanInfo((prev) =>
          prev ? { ...prev, status: result.data.status } : null,
        );
        toast.success(result.message);

        setTimeout(() => {
          navigate("/list");
        }, 300);
      }
    } catch (error: any) {
      console.error("error", error);
      const message = error.response?.data.message;

      if (message) {
        toast.error(message);
      }
    }
  };

  return (
    <>
      <Layout>
        <div className="plan-header relative">
          <div className="title-wrapper static md:sticky top-6 main-text">
            Shop Plan
          </div>
          <div className="plan-fields-wrapper">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col flex-1">
                <label className="ps-5" htmlFor="">
                  Address
                </label>
                <input
                  type="text"
                  className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-full"
                  placeholder="Type Shop Address/Name here..."
                  value={planInfo?.address}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="ps-5" htmlFor="">
                  Date Scheduled
                </label>
                <input
                  type="text"
                  className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200"
                  placeholder="Fri Feb 27, 2026"
                  value={planInfo?.date_scheduled}
                  readOnly
                />
              </div>
              <div className="hidden lg:flex flex-col">
                <label className="ps-5" htmlFor="">
                  Budget
                </label>
                <input
                  type="number"
                  className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-32"
                  placeholder="0"
                  value={planInfo?.budget}
                  readOnly
                />
              </div>
              <div className="hidden lg:flex flex-col">
                <label className="ps-5" htmlFor="">
                  Total
                </label>
                <input
                  type="number"
                  className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-32"
                  placeholder="0"
                  value={planInfo?.number_of_items}
                  readOnly
                />
              </div>

              <div className="flex justify-between lg:hidden gap-5">
                <div className="flex flex-col">
                  <label className="ps-5" htmlFor="">
                    Budget
                  </label>
                  <input
                    type="number"
                    className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-full"
                    placeholder="0"
                    value={planInfo?.budget}
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <label className="ps-5" htmlFor="">
                    Total
                  </label>
                  <input
                    type="number"
                    className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-full"
                    placeholder="0"
                    value={planInfo?.number_of_items}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="border border-stone-300" />
        </div>
        <div className="items-plan-wrapper md:custom-scrollbar">
          {itemList.length > 0 ? (
            itemList.map((item) => (
              <ProductItems
                key={item.id}
                id={item.id}
                handleItemChange={setItemList}
                itemData={item}
                startPlan={startPlan}
              />
            ))
          ) : (
            <div className="text-center italic text-gray-500">
              No Items Found.
            </div>
          )}

          {[0, 1].includes(planInfo?.status ?? -1) &&
            format(new Date(planInfo?.date_scheduled ?? ""), "yyyy-MM-dd") ===
              format(new Date(), "yyyy-MM-dd") && (
              <button
                type="button"
                className="bg-accent primary-action-btn rounded-xl fixed bottom-0 mb-6 w-5/6 md:w-40 px-6 left-0 right-0 md:left-auto md:right-auto mx-auto md:mx-0"
                onClick={() => {
                  if (!startPlan) {
                    handleStart();
                  } else if (startPlan && planInfo?.status == 1) {
                    handleComplete();
                  }
                }}
              >
                {!startPlan ? "Start Plan" : "Complete"}
              </button>
            )}
        </div>
      </Layout>
    </>
  );
};

export default ShopPlan;

interface ProductItemsProp {
  id: number;
  handleItemChange: React.Dispatch<React.SetStateAction<Items[]>>;
  itemData: Items;
  startPlan: boolean;
}

const ProductItems = ({
  id,
  handleItemChange,
  itemData,
  startPlan,
}: ProductItemsProp) => {
  return (
    <>
      <div className="product-item">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-6">
          <div className="flex flex-col">
            <label className="ps-5" htmlFor="">
              Item Name
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200"
              placeholder="(e.g. Coke 1 can)"
              value={itemData.name}
              readOnly
            />
          </div>
          <div className="flex md:hidden lg:flex flex-col flex-1">
            <label className="ps-5" htmlFor="">
              Expected Quantity
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-44"
              placeholder="0"
              value={itemData.expected_quantity}
              readOnly
            />
          </div>
          <div className="flex md:hidden lg:flex flex-col flex-1">
            <label className="ps-5" htmlFor="">
              Actual Quantity
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-44"
              placeholder="0"
              value={itemData.actual_quantity}
              onInput={(e) =>
                handleItemChange((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          actual_quantity: Number(
                            (e.target as HTMLInputElement).value,
                          ),
                        }
                      : item,
                  ),
                )
              }
              disabled={!startPlan}
            />
          </div>
          <div className="hidden lg:flex flex-col flex-1">
            <label className="ps-5" htmlFor="">
              Price
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-36"
              placeholder="0"
              value={itemData.price}
              onInput={(e) =>
                handleItemChange((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          price: Number((e.target as HTMLInputElement).value),
                        }
                      : item,
                  ),
                )
              }
              step="0.01"
              disabled={!startPlan}
            />
          </div>
          <div className="hidden lg:flex flex-col flex-1">
            <label className="ps-5" htmlFor="">
              Total
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-36"
              placeholder="0"
              value={itemData.actual_quantity * itemData.price}
              readOnly
              step="0.01"
            />
          </div>

          <div className="hidden md:flex gap-4 lg:hidden">
            <div className="flex flex-col flex-1">
              <label className="ps-5" htmlFor="">
                Expected Quantity
              </label>
              <input
                type="text"
                className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-44"
                placeholder="0"
                value={itemData.expected_quantity}
                readOnly
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="ps-5" htmlFor="">
                Actual Quantity
              </label>
              <input
                type="text"
                className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-44"
                placeholder="0"
                value={itemData.actual_quantity}
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-4 lg:hidden">
            <div className="flex flex-col flex-1">
              <label className="ps-5" htmlFor="">
                Price
              </label>
              <input
                type="text"
                className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-full"
                placeholder="0"
                value={itemData.price}
                onInput={(e) =>
                  handleItemChange((prev) =>
                    prev.map((item) =>
                      item.id === id
                        ? {
                            ...item,
                            price: Number((e.target as HTMLInputElement).value),
                          }
                        : item,
                    ),
                  )
                }
                step="0.01"
                disabled={!startPlan}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="ps-5" htmlFor="">
                Total
              </label>
              <input
                type="text"
                className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-full"
                placeholder="0"
                value={itemData.actual_quantity * itemData.price}
                readOnly
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
