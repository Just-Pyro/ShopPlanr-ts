import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { createShopPlan } from "../services/ClientApi";
import { useNavigate } from "react-router-dom";

type ItemList = {
  id: number;
  shop_plan_id?: number;
  name?: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
  expected_quantity?: number;
  actual_quantity?: number;
};

const Create = () => {
  const navigate = useNavigate();
  const [planInfo, setPlanInfo] = useState({
    address: "",
    date_scheduled: new Date(),
    budget: 0,
    number_of_items: 0,
  });
  const [itemList, setItemList] = useState<ItemList[] | []>([]);

  const handleChange = (date: Date | null) => {
    if (date) {
      setPlanInfo((prev) => ({ ...prev, date_scheduled: new Date(date) }));
    }
  };

  const addItem = () => {
    setItemList((prev) => [...prev, { id: Date.now() }]);
  };

  const removeItem = (id: number) => {
    setItemList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreate = async () => {
    try {
      const authUser = localStorage.getItem("user");
      const user = authUser ? JSON.parse(authUser) : null;

      if (!user) {
        throw new Error("User Session Failed Please re-login");
      }

      const items = itemList.map(({ id, ...rest }) => rest);
      const planParam = {
        created_by: user.id,
        address: planInfo.address,
        date_scheduled: format(planInfo.date_scheduled, "yyyy-MM-dd 00:00:00"),
        budget: planInfo.budget,
        number_of_items: planInfo.number_of_items,
        items: items,
      };
      const result = await createShopPlan(planParam);

      if (result.success) {
        toast.success(result.message);

        setTimeout(() => {
          navigate("/list");
        }, 300);
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
    const total = itemList.reduce(
      (sum, item) => sum + Number(item.expected_quantity),
      0,
    );

    setPlanInfo((prev) => ({ ...prev, number_of_items: total }));
  }, [itemList]);

  return (
    <Layout>
      <div className="plan-header">
        <div className="title-wrapper static md:sticky top-6 main-text">
          Create Plan
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
                value={planInfo.address}
                onInput={(e) =>
                  setPlanInfo((prev) => ({
                    ...prev,
                    address: (e.target as HTMLInputElement).value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="ps-5" htmlFor="">
                Date Scheduled
              </label>
              <DatePicker
                className="inputfield py-3 px-5 shadow-md shadow-gray-200"
                selected={planInfo.date_scheduled}
                onChange={handleChange}
                dateFormat="MMMM d, yyyy"
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
                value={planInfo.budget}
                onInput={(e) =>
                  setPlanInfo((prev) => ({
                    ...prev,
                    budget: Number((e.target as HTMLInputElement).value),
                  }))
                }
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
                value={planInfo.number_of_items}
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
                  value={planInfo.budget}
                  onInput={(e) =>
                    setPlanInfo((prev) => ({
                      ...prev,
                      budget: Number((e.target as HTMLInputElement).value),
                    }))
                  }
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
                  value={planInfo.number_of_items}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="">
            <button
              type="button"
              className="bg-accent w-full primary-action-btn md:w-40"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>
        </div>
        <hr className="border border-stone-300" />
      </div>
      <div className="items-plan-wrapper custom-scrollbar">
        {itemList.length > 0 ? (
          <>
            {itemList.map((item) => (
              <ProductItems
                key={item.id}
                id={item.id}
                onRemove={removeItem}
                itemValue={itemList}
                handleItemChange={setItemList}
                targetItem={item.id}
              />
            ))}

            <button
              type="button"
              className="bg-accent primary-action-btn w-5/6 md:w-40 rounded-xl fixed bottom-0 mb-6 self-center md:self-start"
              onClick={handleCreate}
            >
              Create Plan
            </button>
          </>
        ) : (
          <div className="text-center italic text-gray-500">No Items Yet.</div>
        )}
      </div>
    </Layout>
  );
};

interface ProductItemsProp {
  id: number;
  onRemove: (value: number) => void;
  itemValue: ItemList[];
  handleItemChange: React.Dispatch<React.SetStateAction<ItemList[]>>;
  targetItem: number;
}

const ProductItems = ({
  id,
  onRemove,
  itemValue,
  handleItemChange,
  targetItem,
}: ProductItemsProp) => {
  return (
    <>
      <div className="product-item">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col">
            <label className="ps-5" htmlFor="">
              Item Name
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200"
              placeholder="(e.g. Coke 1 can)"
              onInput={(e) =>
                handleItemChange((prev) =>
                  prev.map((item) =>
                    item.id === targetItem
                      ? { ...item, name: (e.target as HTMLInputElement).value }
                      : item,
                  ),
                )
              }
              value={
                itemValue.find((item) => item.id === targetItem)?.name ?? ""
              }
            />
          </div>
          <div className="hidden md:flex flex-col flex-1">
            <label className="ps-5" htmlFor="">
              Expected Quantity
            </label>
            <input
              type="text"
              className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-46"
              placeholder="0"
              onInput={(e) =>
                handleItemChange((prev) =>
                  prev.map((item) =>
                    item.id === targetItem
                      ? {
                          ...item,
                          expected_quantity: Number(
                            (e.target as HTMLInputElement).value,
                          ),
                        }
                      : item,
                  ),
                )
              }
              value={
                itemValue.find((item) => item.id === targetItem)
                  ?.expected_quantity ?? 0
              }
            />
          </div>
          <div className="hidden md:flex justify-center items-center">
            <button
              type="button"
              className="rounded-xl p-2 bg-emphasis text-white cursor-pointer hover:opacity-85 transition-all ease-in"
              onClick={() => onRemove(id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>

          <div className="flex md:hidden gap-3">
            <div className="flex flex-col flex-1">
              <label className="ps-5" htmlFor="">
                Expected Quantity
              </label>
              <input
                type="text"
                className="inputfield py-3 px-5 placeholder:italic shadow-md shadow-gray-200 w-46"
                placeholder="0"
                onInput={(e) =>
                  handleItemChange((prev) =>
                    prev.map((item) =>
                      item.id === targetItem
                        ? {
                            ...item,
                            expected_quantity: Number(
                              (e.target as HTMLInputElement).value,
                            ),
                          }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <div className="flex justify-center items-end">
              <button
                type="button"
                className="rounded-xl p-2 bg-emphasis text-white cursor-pointer hover:opacity-85 transition-all ease-in"
                onClick={() => onRemove(id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
