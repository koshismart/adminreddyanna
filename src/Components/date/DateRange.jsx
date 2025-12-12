import React, { useState, useRef, useEffect } from "react";

const DateRange = ({ onDateRangeChange, value }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: value?.startDate || null,
    endDate: value?.endDate || null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  });
  const datePickerRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDateSelect = (date) => {
    let newDateRange;

    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      newDateRange = { startDate: date, endDate: null };
    } else {
      if (date < dateRange.startDate) {
        newDateRange = { startDate: date, endDate: dateRange.startDate };
      } else {
        newDateRange = { startDate: dateRange.startDate, endDate: date };
      }
    }

    setDateRange(newDateRange);

    if (newDateRange.startDate && newDateRange.endDate) {
      onDateRangeChange?.(newDateRange);
    }
  };

  const isDateInRange = (date) => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return date >= dateRange.startDate && date <= dateRange.endDate;
  };

  const isStartDate = (date) =>
    dateRange.startDate && date.getTime() === dateRange.startDate.getTime();

  const isEndDate = (date) =>
    dateRange.endDate && date.getTime() === dateRange.endDate.getTime();

  const generateCalendar = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks = [];
    let currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);
        const isCurrentMonth = date.getMonth() === month;
        const isSelected = isDateInRange(date);
        const isStart = isStartDate(date);
        const isEnd = isEndDate(date);

        days.push(
          <td
            key={date.toISOString()}
            className={`cell ${!isCurrentMonth ? "not-current-month" : ""} ${
              isSelected ? "selected" : ""
            } ${isStart ? "start-date" : ""} ${isEnd ? "end-date" : ""}`}
            onClick={() => handleDateSelect(date)}
          >
            <div>{date.getDate()}</div>
          </td>
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(
        <tr key={week} className="mx-date-row">
          {days}
        </tr>
      );
    }

    return weeks;
  };

  const navigateMonth = (calendarIndex, direction) => {
    if (calendarIndex === 0) {
      const newDate = new Date(currentMonth);
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      setCurrentMonth(newDate);

      const newNextDate = new Date(newDate);
      newNextDate.setMonth(newNextDate.getMonth() + 1);
      setNextMonth(newNextDate);
    } else {
      const newDate = new Date(nextMonth);
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      setNextMonth(newDate);

      const newCurrentDate = new Date(newDate);
      newCurrentDate.setMonth(newCurrentDate.getMonth() - 1);
      setCurrentMonth(newCurrentDate);
    }
  };

  const navigateYear = (calendarIndex, direction) => {
    if (calendarIndex === 0) {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "prev" ? -1 : 1)
      );
      setCurrentMonth(newDate);

      const newNextDate = new Date(newDate);
      newNextDate.setMonth(newNextDate.getMonth() + 1);
      setNextMonth(newNextDate);
    } else {
      const newDate = new Date(nextMonth);
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "prev" ? -1 : 1)
      );
      setNextMonth(newDate);

      const newCurrentDate = new Date(newDate);
      newCurrentDate.setMonth(newCurrentDate.getMonth() - 1);
      setCurrentMonth(newCurrentDate);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const applyDateRange = () => {
    setShowDatePicker(false);
    onDateRangeChange?.(dateRange);
  };

  const clearDateRange = () => {
    const newDateRange = { startDate: null, endDate: null };
    setDateRange(newDateRange);
    onDateRangeChange?.(newDateRange);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setDateRange(value);
    }
  }, [value]);

  const dateInputValue =
    dateRange.startDate && dateRange.endDate
      ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
      : "";

  return (
    <div
      className="date-range-container"
      style={{ position: "relative" }}
      ref={datePickerRef}
    >
      <div className="mx-input-wrapper">
        <input
          name="date"
          type="text"
          autoComplete="off"
          placeholder="Select date range"
          className="mx-input"
          value={dateInputValue}
          readOnly
          onClick={toggleDatePicker}
          style={{ cursor: "pointer" }}
        />
        <i
          className="mx-icon-calendar"
          onClick={toggleDatePicker}
          style={{ cursor: "pointer" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
          >
            <path d="M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z" />
          </svg>
        </i>
      </div>

      {showDatePicker && (
        <div className="mx-datepicker-body">
          <div className="mx-range-wrapper">
            {/* FIRST CALENDAR */}
            <div className="mx-calendar mx-calendar-panel-date">
              <div className="mx-calendar-header">
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-double-left"
                  onClick={() => navigateYear(0, "prev")}
                >
                  <i className="mx-icon-double-left" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-left"
                  onClick={() => navigateMonth(0, "prev")}
                >
                  <i className="mx-icon-left" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-double-right"
                  onClick={() => navigateYear(0, "next")}
                >
                  <i className="mx-icon-double-right" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-right"
                  onClick={() => navigateMonth(0, "next")}
                >
                  <i className="mx-icon-right" />
                </button>

                <span className="mx-calendar-header-label">
                  <button type="button" className="mx-btn mx-btn-text">
                    {currentMonth.toLocaleString("default", { month: "short" })}
                  </button>
                  <button type="button" className="mx-btn mx-btn-text">
                    {currentMonth.getFullYear()}
                  </button>
                </span>
              </div>

              <div className="mx-calendar-content">
                <table className="mx-table mx-table-date">
                  <thead>
                    <tr>
                      <th>Su</th>
                      <th>Mo</th>
                      <th>Tu</th>
                      <th>We</th>
                      <th>Th</th>
                      <th>Fr</th>
                      <th>Sa</th>
                    </tr>
                  </thead>
                  <tbody>{generateCalendar(currentMonth)}</tbody>
                </table>
              </div>
            </div>

            {/* SECOND CALENDAR */}
            <div className="mx-calendar mx-calendar-panel-date">
              <div className="mx-calendar-header">
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-double-left"
                  onClick={() => navigateYear(1, "prev")}
                >
                  <i className="mx-icon-double-left" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-left"
                  onClick={() => navigateMonth(1, "prev")}
                >
                  <i className="mx-icon-left" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-double-right"
                  onClick={() => navigateYear(1, "next")}
                >
                  <i className="mx-icon-double-right" />
                </button>
                <button
                  type="button"
                  className="mx-btn mx-btn-text mx-btn-icon-right"
                  onClick={() => navigateMonth(1, "next")}
                >
                  <i className="mx-icon-right" />
                </button>

                <span className="mx-calendar-header-label">
                  <button type="button" className="mx-btn mx-btn-text">
                    {nextMonth.toLocaleString("default", { month: "short" })}
                  </button>
                  <button type="button" className="mx-btn mx-btn-text">
                    {nextMonth.getFullYear()}
                  </button>
                </span>
              </div>

              <div className="mx-calendar-content">
                <table className="mx-table mx-table-date">
                  <thead>
                    <tr>
                      <th>Su</th>
                      <th>Mo</th>
                      <th>Tu</th>
                      <th>We</th>
                      <th>Th</th>
                      <th>Fr</th>
                      <th>Sa</th>
                    </tr>
                  </thead>
                  <tbody>{generateCalendar(nextMonth)}</tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "8px",
              textAlign: "center",
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>
              <strong>Start:</strong>{" "}
              {dateRange.startDate
                ? formatDate(dateRange.startDate)
                : "Not selected"}
              {" | "}
              <strong>End:</strong>{" "}
              {dateRange.endDate
                ? formatDate(dateRange.endDate)
                : "Not selected"}
            </div>

            <div>
              <button
                type="button"
                className="btn btn-light btn-sm mr-2"
                onClick={clearDateRange}
              >
                Clear
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={applyDateRange}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✔ FIXED — NO `jsx` attribute */}
      <style>{`
        .mx-datepicker-body {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: 500px;
        }

        .mx-range-wrapper {
          display: flex;
        }

        .mx-calendar {
          width: 250px;
          padding: 8px;
        }

        .mx-calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .mx-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .mx-btn:hover {
          background: #f5f5f5;
        }

        .mx-calendar-header-label {
          display: flex;
          gap: 4px;
        }

        .mx-table {
          width: 100%;
          border-collapse: collapse;
        }

        .mx-table th {
          padding: 4px;
          font-size: 12px;
          text-align: center;
        }

        .cell {
          padding: 4px;
          text-align: center;
          cursor: pointer;
        }

        .cell:hover {
          background: #f0f8ff;
        }

        .selected {
          background: #e6f7ff;
        }

        .start-date,
        .end-date {
          background: #1890ff !important;
          color: white;
        }

        .not-current-month {
          color: #ccc;
        }

        .cell div {
          width: 24px;
          height: 24px;
          line-height: 24px;
          border-radius: 4px;
        }

        .mx-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .mx-icon-calendar {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};

export default DateRange;
