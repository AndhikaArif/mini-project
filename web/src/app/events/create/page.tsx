"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const [eventImage, setEventImage] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!name || !description || !price || !totalSeats) {
        alert("Please fill all required fields");
        return;
      }

      if (eventImage.length === 0) {
        alert("Event image is required");
        return;
      }

      if (new Date(endTime) <= new Date(startTime)) {
        alert("End time must be after start time");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("totalSeats", totalSeats);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);

      eventImage.forEach((file) => {
        formData.append("eventImage", file);
      });

      const res = await axios.post(
        "http://localhost:8000/api/events/create",
        formData,
        {
          withCredentials: true,
        }
      );

      const eoId = res.data.event.eventOrganizerId;

      router.push(`/organizer/dashboard`);
      alert("Event created successfully");
      console.log(res.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-auto flex flex-col justify-center items-center gap-y-4 pt-8 pb-30">
      <h1 className="text-2xl tracking-wide mb-2 font-semibold">
        Create Your Event
      </h1>

      {/* Upload Event Images */}
      <div className="flex flex-col justify-center items-center gap-y-2">
        <label
          htmlFor="eventImage"
          className="flex flex-col items-center justify-center
             border-2 border-dashed border-gray-300
             bg-gray-100 w-[400px] h-[100px]
             rounded-md cursor-pointer text-gray-500"
        >
          <span>Click or drag images here</span>
          <span className="text-sm">(Max 5 images)</span>

          <input
            id="eventImage"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setEventImage(Array.from(e.target.files || []))}
            className="hidden"
          />
        </label>

        {eventImage.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {eventImage.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                className="w-20 h-20 object-cover rounded border"
                alt={`event-preview-${i}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Insert Event Name */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Event Name</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
          className="border-2 border-gray-200 shadow w-[400px] h-10 rounded-md px-2"
        />
      </div>

      {/* Insert Event Description */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Event Description</h2>
        <textarea
          value={description}
          placeholder="Event Description"
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 border-gray-200 shadow w-[400px] h-[100px] rounded-md px-2 py-1"
        />
      </div>

      {/* Insert Event Category */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Event Category</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-gray-200 shadow w-[400px] h-10 rounded-md px-2 text-black"
        >
          <option value="" disabled hidden>
            Select Category
          </option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="SPORTS_AND_COMPETITION">Sports and Competition</option>
          <option value="EDUCATION_AND_WORKSHOP">Education and Workshop</option>
          <option value="BUSSINESS_AND_NETWORKING">
            Bussiness and Networking
          </option>
          <option value="ART_AND_CULTURE">Art and Culture</option>
        </select>
      </div>

      {/* Insert Event Location */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Event Location</h2>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-2 border-gray-200 shadow w-[400px] h-10 rounded-md text-black px-2"
        >
          <option value="" disabled hidden>
            Select Location
          </option>
          <option value="JAKARTA">Jakarta</option>
          <option value="SURABAYA">Surabaya</option>
          <option value="BANDUNG">Bandung</option>
          <option value="MEDAN">Medan</option>
          <option value="SEMARANG">Semarang</option>
          <option value="YOGYAKARTA">Yogyakarta</option>
          <option value="MAKASSAR">Makassar</option>
          <option value="BALI">Bali</option>
          <option value="PALEMBANG">Palembang</option>
          <option value="BALIKPAPAN">Balikpapan</option>
        </select>
      </div>

      {/* Insert Event Price */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Event Price</h2>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Event Price"
          className="border-2 border-gray-200 shadow w-[400px] h-10 rounded-md px-2"
        />
      </div>

      {/* Insert Event Total Seats */}
      <div className="flex flex-col justify-center items-start gap-y-1">
        <h2 className="text-md">Total Seats</h2>
        <input
          type="number"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          placeholder="Total Seats"
          className="border-2 border-gray-200 shadow w-[400px] h-10 rounded-md px-2"
        />
      </div>

      {/* Insert Event Time */}
      <div className="flex justify-between items-center w-[400px]">
        <div className="flex flex-col justify-center items-start gap-y-1">
          <h2 className="text-md">Start Time</h2>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border-2 border-gray-200 shadow w-[180px] h-10 rounded-md text-gray-500 px-2"
          />
        </div>

        <div className="flex flex-col justify-center items-start gap-y-1">
          <h2 className="text-md">End Time</h2>
          <input
            type="datetime-local"
            value={endTime}
            min={startTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border-2 border-gray-200 shadow w-[180px] h-10 rounded-md text-gray-500 px-2"
          />
        </div>
      </div>

      {/* Button Create */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-[400px] h-10 text-white font-semibold tracking-wide rounded-md mt-4 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
        }`}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </main>
  );
}
