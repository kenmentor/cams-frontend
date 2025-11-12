"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import REQ from "@/app/utility/axois";
import { toast } from "sonner";
import Input from "@/components/Input";
import { BiDollar, BiHomeAlt, BiMap } from "react-icons/bi";
import { propertyCategory, propertyType, statesAndLGAs } from "@/app/data";

interface PostData {
  title: string;
  description: string;
  state: string;
  address: string;
  location: string;
  price: number;
  maxgeust: number;
  type: string;
  category: string;
  waterSuply: boolean;
  electricity: number;
  avaliable: boolean;
  lga: string;
}

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const { houseId } = useParams();
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const { app, base } = REQ;

  // Fetch house details
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await app.get(`${base}/V1/house/detail/${houseId}`);
        setPostData(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching house:", error);
        toast.error("Failed to load house details.");
      } finally {
        setLoading(false);
      }
    };
    if (houseId) fetchHouse();
  }, [houseId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    //@ts-expect-error just didnt fill it would breac anything
    const { name, value, type, checked } = e.target;
    setPostData((prev: PostData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await app.put(`${base}/V1/house/${houseId}`, postData);
      toast.success("House updated successfully!");
      router.push("/homepage"); // redirect
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update house.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !postData) {
    return <div className="p-6 text-center">Loading house details...</div>;
  }

  if (!postData) {
    return <div className="p-6 text-center text-red-500">House not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700">
      <h1 className="text-2xl font-bold text-white mb-6">Edit House</h1>

      {/* Title */}
      <Input
        icon={BiHomeAlt}
        name="title"
        placeholder="House Title"
        value={postData.title}
        onChange={handleChange}
      />

      {/* Description */}
      <label className="block text-slate-300 mb-2">Description</label>
      <textarea
        name="description"
        value={postData.description}
        onChange={handleChange}
        className="w-full mb-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-blue-500 text-white placeholder-gray-400 h-32"
      />

      {/* Price */}
      <Input
        icon={BiDollar}
        type="number"
        name="price"
        placeholder="Price"
        value={postData.price}
        onChange={handleChange}
      />

      {/* State & Address */}
      <Input
        icon={BiMap}
        name="state"
        placeholder="State"
        value={postData.state}
        onChange={handleChange}
      />
      <label className="text-gray-400">State</label>
      <select
        value={postData.state}
        onChange={(e) =>
          setPostData((prev) => ({
            ...prev,
            state: e.target.value,
            lga: "", // reset LGA when state changes
          }))
        }
        className="w-full mb-3 p-2 rounded bg-gray-700 text-white border border-gray-600"
      >
        <option value="">Select State</option>
        {Object.keys(statesAndLGAs).map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <label className="text-gray-400">Local Government</label>
      <select
        value={postData.lga || ""}
        onChange={(e) =>
          setPostData((prev) => ({
            ...prev,
            lga: e.target.value,
          }))
        }
        className="w-full mb-3 p-2 rounded bg-gray-700 text-white border border-gray-600"
        disabled={!postData.state}
      >
        <option value="">Select LGA</option>
        {postData.state &&
          (statesAndLGAs[postData.state] || []).map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
      </select>
      <Input
        icon={BiMap}
        name="address"
        placeholder="Address"
        value={postData.address}
        onChange={handleChange}
      />

      {/* Location */}
      <Input
        icon={BiMap}
        name="location"
        placeholder="Location"
        value={postData.location}
        onChange={handleChange}
      />

      {/* Max Guests */}

      {/* Category & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={postData.category}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700/50 rounded-lg border border-slate-600 text-white"
          >
            {propertyCategory.map((category, index) => {
              return (
                <option value={category} key={index}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-2">Type</label>
          <select
            name="type"
            value={postData.type}
            onChange={handleChange}
            className="w-full p-2 bg-slate-700/50 rounded-lg border border-slate-600 text-white"
          >
            {propertyType.map((type, index) => {
              return (
                <option value={type} key={index}>
                  {type}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            name="waterSuply"
            checked={postData.waterSuply}
            onChange={handleChange}
          />
          Water Supply
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            name="avaliable"
            checked={postData.avaliable}
            onChange={handleChange}
          />
          Available
        </label>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
      >
        {loading ? "Updating..." : "Update House"}
      </button>
    </div>
  );
};

export default EditPostPage;
