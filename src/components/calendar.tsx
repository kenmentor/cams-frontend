"use client";

import React from "react";
import dayjs from "dayjs";

interface EventCalendarProps {
  eventDate: string;
  title: string; // ISO date string
}

const EventCalendar: React.FC<EventCalendarProps> = ({ eventDate, title }) => {
  const today = dayjs();
  const eventDay = dayjs(eventDate);

  // Generate month grid
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");
  const daysInMonth = endOfMonth.date();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );

  return (
    <div className="bg-[#1C1C1E] p-6 rounded-3xl shadow-xl max-w-lg mx-auto text-white w-full">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        {today.format("MMMM YYYY")}
      </h2>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm md:text-base">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Empty leading days */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startOfMonth.day() }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {/* Days */}
        {daysArray.map((day) => {
          const isEvent = day.isSame(eventDay, "day");
          const isToday = day.isSame(today, "day");
          return (
            <div
              key={day.toString()}
              className={`p-3 rounded-lg cursor-pointer text-sm sm:text-base md:text-lg
                flex justify-center items-center
                transition-all duration-300 transform
                ${
                  isEvent
                    ? "bg-[#0A84FF] text-white shadow-lg scale-105 animate-pulse"
                    : ""
                }
                ${
                  isToday && !isEvent
                    ? "bg-gray-700 text-white font-semibold shadow-md"
                    : "text-gray-300"
                }
                hover:scale-105 hover:shadow-xl hover:bg-gray-600`}
            >
              {day.date()}
            </div>
          );
        })}
      </div>

      {/* Event info */}
      <div className="mt-6 p-4 bg-[#2C2C2E] rounded-2xl shadow-inner text-center transition-transform transform hover:scale-[1.02] hover:shadow-lg">
        <p className="font-semibold text-lg sm:text-xl">
          Event: <span className="text-[#0A84FF]">{title}</span>
        </p>
        <p className="text-gray-300 mt-1 sm:text-base">
          Date: {eventDay.format("dddd, MMMM D, YYYY")}
        </p>
      </div>
    </div>
  );
};

export default EventCalendar;
