/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";

const Frame = ({ item }) => {
  return (
    <div className="video-box-container">
      <div className="casino-video-box">
        <iframe
          src={`${item?.gameTvLink || "#"}`}
          // src={`https://jeetkaadda.com/casino-video/?gameTvLink=${item?.gameTvLink}`}
          height="100%"
          width="100%"
          scrolling="no"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Frame;
