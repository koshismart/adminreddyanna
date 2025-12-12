// src/components/common/Timer.jsx
// Timer.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";

// const FlipDigit = ({ digit }) => {
//   const prevDigitRef = useRef(digit);
//   const ulRef = useRef(null);

//   const shouldFlip = useMemo(()=>prevDigitRef.current !== digit,[digit,prevDigitRef]);

//   useEffect(() => {
//     if (shouldFlip && ulRef.current) {
//       // Remove class to reset animation
//       ulRef.current.classList.remove("play");

//       // Trigger reflow (critical for CSS animation restart)
//       void ulRef.current.offsetHeight;

//       // Add class back → animation plays
//       ulRef.current.classList.add("play");
//     }

//     // Update previous value for next tick
//     prevDigitRef.current = digit;
//   }, [digit, shouldFlip]);

//   return (
//     <ul ref={ulRef} className={`flip${shouldFlip ? " play" : ""}`}>
//       <li className="flip-clock-before">
//         <a href="#">
//           <div className="up">
//             <div className="shadow"></div>
//             <div className="inn">{prevDigitRef.current}</div>
//           </div>
//           <div className="down">
//             <div className="shadow"></div>
//             <div className="inn">{prevDigitRef.current}</div>
//           </div>
//         </a>
//       </li>
//       <li className="flip-clock-active">
//         <a href="#">
//           <div className="up">
//             <div className="shadow"></div>
//             <div className="inn">{digit}</div>
//           </div>
//           <div className="down">
//             <div className="shadow"></div>
//             <div className="inn">{digit}</div>
//           </div>
//         </a>
//       </li>
//     </ul>
//   );
// };

// const Timer = ({ time }) => {
//   const remainingSeconds = Math.max(0, Math.floor((time - Date.now()) / 1000));
//   const seconds = remainingSeconds % 60;
//   const display = seconds.toString().padStart(2, "0");

//   const tens = display[0];
//   const units = display[1];

//   return (
//     <>
//       {/* Desktop */}
//       <div className="hidden md:block">
//         <div className="flip-clock-wrapper">
//         <FlipDigit digit={tens} />
//         <FlipDigit digit={units} />
//       </div>
//       </div>

//       {/* Mobile */}
//       <div className="block md:hidden">
//         <div
//           className="flip-clock-wrapper"
//           style={{ transform: "scale(0.75)", transformOrigin: "bottom right" }}
//         >
//           <FlipDigit digit={tens} />
//           <FlipDigit digit={units} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Timer;




import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";

import React from "react";
import { useMediaQuery } from "react-responsive";

const Timer = ({ time }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return (<>
  
  
    {!isMobile && <div className="md:block hidden">
      <FlipClockCountdown
        to={time}
        labels={["", "", "", ""]}
        showLabels={false}
        digitBlockStyle={{
          height: "55px",
          fontSize: "43px",
          width: "32px",
          background: "linear-gradient(to right, var(--secondary-background), var(--primary-background))",
        }}
        showSeparators={false}
        renderMap={[false, false, false, true]}
        hideOnComplete={false}
      />
    </div>}
    {isMobile && <div className="md:hidden block">
      <FlipClockCountdown
        to={time}
        labels={["", "", "", ""]}
        showLabels={false}
        digitBlockStyle={{
          height: "30px",
          fontSize: "26px",
          width: "20px",
          background: "linear-gradient(to right, var(--secondary-background), var(--primary-background))",
          fontWeight:"bold"
        }}
        showSeparators={false}
        renderMap={[false, false, false, true]}
        hideOnComplete={false}
      />
    </div>}
  </>
  );
};

export default Timer;
