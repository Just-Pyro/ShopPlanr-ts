import axios from "axios";

// const baseUrl = "http://10.10.1.102:8005/api";
const baseUrl = "http://127.0.0.1:8000/api";

type LoginUserProp = {
  email: string;
  password: string;
};

export const loginUser = async ({ email, password }: LoginUserProp) => {
  const route = `${baseUrl}/users/login`;
  const response = await axios.post(route, {
    email,
    password,
  });
  return response.data;
};

type RegisterUserProp = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export const registerUser = async ({
  first_name,
  last_name,
  email,
  password,
}: RegisterUserProp) => {
  const route = `${baseUrl}/users`;
  const response = await axios.post(route, {
    first_name,
    last_name,
    email,
    password,
  });
  return response.data;
};

export const getPlans = async (userId: number) => {
  const route = `${baseUrl}/shop_plans/by-user/${userId}`;
  const response = await axios.get(route);
  return response.data;
};

type Items = {
  shop_plan_id?: number;
  name?: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
  expected_quantity?: number;
  actual_quantity?: number;
};

type CreateShopPlanProp = {
  created_by: number;
  address: string;
  date_scheduled: string;
  budget: number;
  number_of_items: number;
  items: Items[];
};

export const createShopPlan = async ({
  created_by,
  address,
  date_scheduled,
  budget,
  number_of_items,
  items,
}: CreateShopPlanProp) => {
  const route = `${baseUrl}/shop_plans`;
  const response = await axios.post(route, {
    created_by,
    address,
    date_scheduled,
    budget,
    number_of_items,
    items,
  });
  return response.data;
};

export const getPlanInfo = async (planId: number) => {
  const route = `${baseUrl}/shop_plans/${planId}`;
  const response = await axios.get(route);
  return response.data;
};

export const startPlan = async (planId: number, userId: number) => {
  const checkRoute = `${baseUrl}/shop_plans/checkStarted/${userId}`;
  const res = await axios.get(checkRoute);
  // console.log("res", res);

  if (res.data?.success) {
    const route = `${baseUrl}/shop_plans/start/${planId}`;
    const response = await axios.put(route);
    return response.data;
  }

  return res.data;
};

type PartialItems = {
  name: string;
  price: number;
  actual_quantity: number;
};

type CompletePlanProp = {
  status: number;
  updated_at: Date | string;
  items: PartialItems[];
};

export const completePlan = async (
  { status, updated_at, items }: CompletePlanProp,
  planId: number,
) => {
  const route = `${baseUrl}/shop_plans/update-status/${planId}`;
  const response = await axios.put(route, {
    status,
    updated_at,
    items,
  });

  return response.data;
};
