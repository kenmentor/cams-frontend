"use client";
import HeaderCustom from "@/components/HeaderCostum";
import Input from "@/components/Input";
import React, { useState, useMemo } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { IoLocation } from "react-icons/io5";
import Req from "@/app/utility/axois";
import { useAuthStore } from "../store/authStore";
import Loading from "@/components/Loainding";
import { motion } from "framer-motion";
import { propertyCategory, propertyType, statesAndLGAs } from "../data";
import { BsHouse } from "react-icons/bs";
interface request {
  max: number;
  min: number;
  description: string;
  type: string;
  category: string;
  lga: string;
  state: string;
}

const Footer = () => {
  const { app, base } = Req;
  const [request, setRequest] = useState({
    max: 0,
    min: 0,
    description: "",
    lga: "LGA",
    state: "State",
    type: "Type",
    category: "Category",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  function sendDemand() {
    app.post(`${base}/v1/demand`, {
      ...request,
      price: (request.max + request.min) * 0.55,
      guest: user._id,
    });
  }
  async function handleSubmit() {
    try {
      setLoading(true);
      await sendDemand();
      setSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(" ");
  }

  const lgaOptions = useMemo(
    () => statesAndLGAs[request.state] ?? [],
    [request.state]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const elementName = e.target.name;

    setRequest((prev) => ({ ...prev, [elementName]: e.target.value }));
  }
  if (loading) return <Loading />;
  return (
    <>
      <HeaderCustom text="Book on request" />
      <div className="flex flex-col min-h-screen bg-slate-950 text-white pt-14 ">
        {sent && (
          <>
            <div className=" flex items-center justify-center p-5">
              <p className="text-green-500 font-semibold mt-2">
                Your Demand have been Sent
              </p>
            </div>
          </>
        )}
        <div className="flex justify-center items-center p-4  flex-col gap-5 pb-56 ">
          <div className="w-full max-w-lg p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700 hover:shadow-2xl transition-all duration-300">
            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {request.description}
            </p>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="text-slate-200 font-semibold mb-2">Price Range</h3>
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span className="px-4 py-1.5 rounded-lg bg-green-600/20 text-green-400 font-medium shadow-sm">
                  Max: ₦{request.max?.toLocaleString()}
                </span>
                <span className="px-4 py-1.5 rounded-lg bg-red-600/20 text-red-400 font-medium shadow-sm">
                  Min: ₦{request.min?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-slate-400 mb-4">
              <IoLocation className="mr-2 text-blue-400" />
              <span className="mr-2">{request?.state}</span> •
              <span className="mx-2">{request?.lga}</span> •
              <span className="mx-2">{request?.category}</span> •
              <span className="mx-2">{request?.type}</span> •
            </div>

            {/* Owner Info */}
            <div className="text-slate-300 text-sm">
              <span className="block font-semibold text-slate-100">
                {user?.userName || ""}
              </span>
              <span className="block">{user?.email || ""}</span>
              <span className="block text-xs text-slate-500 mt-1">
                Received
              </span>
            </div>
          </div>{" "}
        </div>

        {/* Bottom Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-lg">
          <div className="flex gap-3">
            <div className="w-full">
              <Input
                name="min"
                icon={BiDownArrow}
                placeholder="Min price"
                onChange={handleChange}
                type="number"
                value={request.min}
              />
            </div>
            <div className="w-full">
              <Input
                icon={BiUpArrow}
                placeholder="Max price"
                name="max"
                type="number"
                value={request.max}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <div className=" relative mb-6 red">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                  <BsHouse className="size-5 text-blue-500" />
                </div>
                <input />

                <motion.select
                  id=""
                  className=" w-full pl-10  pr-3 py-2 bg-gray-500 bg-opacity-50 rounded-lg border border-gray-700 focus:border-blue-500 fovus:ring-blue-500 text-white placeholder-gray-400 transition-duration-200"
                  name="type"
                  onChange={(e) => {
                    const name = e.target.name;
                    const value = e.target.value;
                    console.log(name, value);
                    setRequest((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                >
                  <option value=""> Category </option>

                  {propertyCategory.map((element, index) => (
                    <motion.option
                      key={index}
                      whileTap={{ scale: 0.9 }}
                      value={element}
                    >
                      {element}
                    </motion.option>
                  ))}
                </motion.select>
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">State</label>

              <select
                value={request.state}
                onChange={(e) =>
                  setRequest((f) => ({
                    ...f,
                    state: e.target.value,
                    lga: "",
                  }))
                }
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select state</option>
                {Object.keys(statesAndLGAs).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* LGA */}
            <div>
              <label className="text-slate-300 text-sm mb-2 block">LGA</label>
              <div className="relative">
                <select
                  value={request.lga}
                  onChange={(e) =>
                    setRequest((f) => ({ ...f, lga: e.target.value }))
                  }
                  disabled={!request.state}
                  className={classNames(
                    "w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2",
                    !request.state
                      ? "border-slate-800 text-slate-500"
                      : "border-slate-700 focus:ring-blue-600"
                  )}
                >
                  <option value="">Select LGA</option>
                  {lgaOptions.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full">
              <motion.select
                className="bg-blue-600 text-white px-1 rounded-sm "
                id=""
                name="category"
                onChange={(e) => {
                  const name = e.target.name;
                  const value = e.target.value;
                  console.log(name, value);
                  setRequest((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
              >
                <option value="">Type </option>
                {propertyType.map((element, index) => (
                  <motion.option
                    key={index}
                    whileTap={{ scale: 0.9 }}
                    value={element}
                  >
                    {element}
                  </motion.option>
                ))}
              </motion.select>
            </div>
          </div>
          <div className="mt-2">
            <textarea
              id="description"
              placeholder="Enter description"
              value={request.description}
              onChange={(e) =>
                setRequest((prev: request) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full pl-3 pr-3 py-2 bg-slate-800 bg-opacity-70 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-400 transition duration-200 h-28"
            ></textarea>
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
