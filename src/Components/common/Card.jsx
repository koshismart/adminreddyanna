/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useRef } from "react";
import cardsData from "../../assets/cards/data";
import Slider from "react-slick";

// Function to find card by code, return a default if not found
const findCardImage = (cardCode) => {
    const card = cardsData.find((i) => i.code === cardCode);
    return card ? card.image : "https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/1.jpg";
  };

const DefaultCardDragonTiger = ({ cardData }) => {
    return (
    <div className="flip-card-container">

    {/* Card 1 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
    </div>
    </div>
    </div>

    {/* Card 2 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
    </div>
    </div>
    </div>

    </div>
    );
};

const DefaultCardDragonTigerLion = ({ cardData }) => {
    return (
    <div className="flip-card-container">

    {/* Card 1 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
    </div>
    </div>
    </div>

    {/* Card 2 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
    </div>
    </div>
    </div>

    {/* Card 3 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
    </div>
    </div>
    </div>

    </div>
    );
};


const lucky5 = ({ cardData }) => {
    return (
    <div className="flip-card-container">

    {/* Card 1 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
    </div>
    </div>
    </div>
    </div>
    );
};
const btable2 = ({ cardData }) => {
  console.log("bollywood table 2 ka card",cardData)
    return (
    <div className="flip-card-container">

    {/* Card 1 */}
    <div className="flip-card">
    <div className="flip-card-inner">
    <div className="flip-card-front">
        <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
    </div>
    </div>
    </div>
    </div>
    );
};

const poison = ({ cardData }) => {
    return (
      <>
      
  <div className="joker-card">
    <h5 className="text-playerb">Poison</h5>
    <div className="flip-card-container">
      <div className="flip-card">
      <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const poison20 = ({ cardData }) => {
    return (
      <>
  <div className="joker-card">
    <h5 className="text-playerb">Poison</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const joker20 = ({ cardData }) => {
    return (
      <>
  <div className="joker-card">
    <h5 className="text-playerb">Joker</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const joker1 = ({ cardData }) => {
    return (
      <>
  <div className="joker-card">
  <h4 className="text-playerb">JOKER</h4>
  <span>
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/joker1/14.png" style={{height:"70px",width:"50px"}}/>
  </span>
</div>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};

 const ab4 = () => {
  const sliderRefAndar = useRef(null);
  const sliderRefBahar = useRef(null);

  // STATIC DATA – Bilkul real jaisa
  const staticAndarCards = [
    "4SS", "9CC", "5SS", "JCC", "5HH", "2HH", "7CC", "8CC", "6DD", "7HH",
    "4HH", "8HH", "KCC", "3HH", "JCC", "6SS", "5HH", "QDD", "KDD", "3DD",
    "7SS", "10HH", "7HH", "6HH", "ADD", "3DD", "10DD", "8HH", "KSS", "10SS",
    "QSS", "JDD", "JHH", "JSS", "4DD", "ACC", "7DD", "QSS", "ASS", "8CC",
    "6CC", "5CC", "2SS", "QHH", "9CC", "9HH", "9DD", "6DD", "2CC", "5HH",
    "4DD", "9DD"
  ].reverse(); // Latest card right pe dikhega

  const staticBaharCards = [
    "9CC", "10CC", "KCC", "6HH", "7CC", "JHH", "7DD", "6HH", "QCC", "10HH",
    "8CC", "3SS", "9HH", "8SS", "9SS", "2CC", "2DD", "7SS", "ACC", "9DD",
    "7HH", "8HH", "QHH", "ADD", "KHH", "8SS", "6HH", "2DD", "4DD", "3CC",
    "4SS", "QCC", "10CC", "KCC"
  ].reverse();

  // Total cards count
  const totalAndar = staticAndarCards.length;
  const totalBahar = staticBaharCards.length;
  const nextIsAndar = totalAndar === totalBahar;

  // Auto scroll to latest card on load
  useEffect(() => {
    setTimeout(() => {
      sliderRefAndar.current?.slickGoTo(Math.max(0, totalAndar - 8));
      sliderRefBahar.current?.slickGoTo(Math.max(0, totalBahar - 8));
    }, 100);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <button className="slick-prev">Previous</button>,
    nextArrow: <button className="slick-next">Next</button>,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 5, slidesToScroll: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 4, slidesToScroll: 2 } }
    ]
  };

  const getCardImage = (code) => {
    return `https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${code}.jpg`;
  };

  return (
    <>
     <span className="text-white">
    Next Card Count: <span className="text-warning">115 / Andar</span>
  </span>
     <div className="ab-cards-container">
        <h5>Andar</h5>
        <div className="ms-4">
          <Slider ref={sliderRefAndar} {...settings}>
            {staticAndarCards.map((code, i) => (
              <div key={i} className="slick-slide">
                <img
                  src={getCardImage(code)}
                  alt={code}
                  style={{ width: "100%", display: "inline-block" }}
                />
              </div>
            ))}
          </Slider>
          </div>
        <h5>Bahar</h5>
        <div className="ms-4">
          <Slider ref={sliderRefBahar} {...settings}>
            {staticBaharCards.map((code, i) => (
              <div key={i} className="slick-slide">
                <img
                  src={getCardImage(code)}
                  alt={code}
                   style={{ width: "100%", display: "inline-block" }}
                />
              </div>
            ))}
          </Slider>
          </div>
        </div>
    </>
  );
};


const abj = ({ cardData }) => {

  return (
<div className="">
<div className="absolute top-2 left-2 bg-#000">
  <div className="flex items-center gap-2">
    <div className="flex flex-col items-center justify-center gap-1">
      <h1 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
        A
      </h1>
      <h1 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
        B
      </h1>
    </div>
    <div className="flex items-center gap-4">
      {/* first card */}
      <div>
      <img
        src={cardsData.find(c => c.code === cardData?.cards?.split(",")[0])?.image}
        style={{ height: "40px", width: "28px" }}  // YEH CHANGE KAR DE
        alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[0])?.name}
      />
    </div>
      {/* other cards */}
      <div className="flex flex-col gap-4">
        <div className="flex md:gap-8 gap-4 text-white">
          <div className="casino-odds text-center">
            <div>
            <img
              src={cardsData.find(c => c.code === cardData?.cards?.split(",")[2])?.image}
              style={{ height: "40px", width: "28px" }}  // YEH CHANGE KAR DE
              alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[2])?.name}
            />
          </div>
          </div>
              {/* ye slider me aayega  */}
          <div className="flex gap-2 md:w-28 w-18 overflow-auto no-scrollbar items-center">
            {cardData?.cards
              ?.split(",")
              .slice(3, 51)
              .filter((_, index) => index % 2 !== 0)
              .map((value) => {
                let card;
                if (value != "1") {
                  card = cardsData.find((c) => c.code === value);
                } else {
                  null;
                }

                return card ? (
                  <img
                    key={value}
                    src={card.image}
                    style={{ height: "40px", width: "28px" }}
                    alt={card.name}
                  />
                ) : null;
              })}
          </div>

        </div>
        <div className="flex md:gap-8 gap-4 text-white">
          <div>
            <img
              src={cardsData.find(c => c.code === cardData?.cards?.split(",")[1])?.image}
              style={{ height: "40px", width: "28px" }}  // YEH CHANGE KAR DE
              alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[1])?.name}
            />
          </div>
          {/* and ye slider hoga */}
          <div className="flex gap-2 md:w-28 w-18 overflow-auto no-scrollbar items-center">
            {cardData?.cards
              ?.split(",")
              .slice(3, 51)
              .filter((_, index) => index % 2 === 0)
              .map((value) => {
                let card;
                if (value != "1") {
                  card = cardsData.find((c) => c.code === value);
                } else {
                  null;
                }

                return card ? (
                  <img
                    key={value}
                    src={card.image}
                    style={{ height: "40px", width: "28px" }}
                    alt={card.name}
                  />
                ) : null;
              })}
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</div>
  );
};

const cmeter = ({ cardData }) => {

  return (
<div className="cmeter-video-cards-box">
<div className="cmeter-low">
<div>
    <span className="text-fancy">Low</span>
    <span className="ms-2 text-success">
    <b> 25</b>
    </span>
</div>
<div className="cmeter-low-cards">
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/8DD.jpg" />
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/7DD.jpg" />
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/3HH.jpg" />
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/7CC.jpg" />
</div>
</div>
<div className="cmeter-high">
<div>
    <span className="text-fancy">High</span>
    <span className="ms-2 text-success">
    <b> 26</b>
    </span>
</div>
<div className="cmeter-high-cards">
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/KCC.jpg" />
    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/KSS.jpg" />
</div>
</div>
</div>
  );
};
const kbc = ( {cardData})  => {
    return (
      <>
      
  <div>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
            <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
        </div>
      </div>
    </div>
    <div className="flip-card-container mt-1">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
        </div>
      </div>
    </div>
    <div className="flip-card-container mt-1">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
        </div>
      </div>
    </div>
    <div className="flip-card-container mt-1">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
        </div>
      </div>
    </div>
    <div className="flip-card-container mt-1">
      <div className="flip-card">
        <div className="flip-card-inner ">
           <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
        </div>
      </div>
    </div>
  </div>



</>

    );
};
const teen41 = ({ cardData }) => {
    return (
      <>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen42 = ({ cardData }) => {
    return (
      <>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen33 = ({ cardData }) => {
    return (
      <>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen32 = ({ cardData }) => {
    return (
      <>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teenpattioneday = ({ cardData }) => {

    return (
      <>
      
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen20 = ({ cardData }) => {

    return (
      <>
  <div className="mt-1">
    <h5>Player A</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Player B</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen9 = ({ cardData }) => {

    return (
      <>
  <div className="mt-1">
    <h5>TIGER</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>LION</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
    <div className="mt-1">
    <h5>DRAGON</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C8)} alt={`Card ${cardData?.C8}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C9)} alt={`Card ${cardData?.C9}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const teen8 = ({ cardData }) => {
    return (
      <>
  <div className="mt-1">
    <h5>DEALER</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             {getCard("card", cardData).map((item) => (
              <img
                className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                src={cardsData.find((v) => v.code == item)?.image}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
            <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    );
};
const poker = ({ cardData }) => {
    return (
      <>

  <div className="d-flex flex-wrap justify-content-between">
    <div>
      <h5>Player A</h5>
      <div className="flip-card-container">
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
          </div>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner ">
            <div className="flip-card-front">
             <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h5>Player B</h5>
      <div className="flip-card-container justify-content-end">
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
          </div>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Board</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
         <div className="flip-card-front">
             <img src={findCardImage(cardData?.C8)} alt={`Card ${cardData?.C8}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
         <div className="flip-card-front">
             <img src={findCardImage(cardData?.C9)} alt={`Card ${cardData?.C9}`} />
          </div>
        </div>
      </div>
    </div>
  </div>


</>

    );
};
const poker20 = ({ cardData }) => {
    return (
      <>

  <div className="d-flex flex-wrap justify-content-between">
    <div>
      <h5>Player A</h5>
      <div className="flip-card-container">
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C1)} alt={`Card ${cardData?.C1}`} />
          </div>
          </div>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner ">
            <div className="flip-card-front">
             <img src={findCardImage(cardData?.C2)} alt={`Card ${cardData?.C2}`} />
          </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h5>Player B</h5>
      <div className="flip-card-container justify-content-end">
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C3)} alt={`Card ${cardData?.C3}`} />
          </div>
          </div>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner ">
           <div className="flip-card-front">
             <img src={findCardImage(cardData?.C4)} alt={`Card ${cardData?.C4}`} />
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-1">
    <h5>Board</h5>
    <div className="flip-card-container">
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C5)} alt={`Card ${cardData?.C5}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C6)} alt={`Card ${cardData?.C6}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
          <div className="flip-card-front">
             <img src={findCardImage(cardData?.C7)} alt={`Card ${cardData?.C7}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
         <div className="flip-card-front">
             <img src={findCardImage(cardData?.C8)} alt={`Card ${cardData?.C8}`} />
          </div>
        </div>
      </div>
      <div className="flip-card">
        <div className="flip-card-inner ">
         <div className="flip-card-front">
             <img src={findCardImage(cardData?.C9)} alt={`Card ${cardData?.C9}`} />
          </div>
        </div>
      </div>
    </div>
  </div>


</>

    );
};
const cardsOperations = {
  dt6:DefaultCardDragonTiger,
  dt20:DefaultCardDragonTiger,
  dt202:DefaultCardDragonTiger,
  dtl20:DefaultCardDragonTigerLion,
  lucky5,
  poison,
  poison20,
  joker20,
  joker1,
  ab4,
  abj,
  cmeter,
  kbc,
  btable2,
  teen41,
  teen42,
  teen33,
  Teen:teenpattioneday,
  teen32,
  teen20,
  teen9,
  teen8,
  poker,
  poker20
};
const Card = ({ slug, cardData }) => {
  const Component = cardsOperations[slug];
  if (!Component) {
    return null;  
  }

  return (<div className="casino-video-cards"><Component cardData={cardData} /> </div>);
};

export default Card;
