import React, { useState } from "react";

const RuleModal = ({ onClose }) => {
  const [accepted, setAccepted] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [openSubSections, setOpenSubSections] = useState({});

  const handleAccept = () => {
    setAccepted(true);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleSubSection = (subSectionId) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [subSectionId]: !prev[subSectionId],
    }));
  };

  const isSectionOpen = (sectionId) => openSections[sectionId];
  const isSubSectionOpen = (subSectionId) => openSubSections[subSectionId];

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
        overflow: "auto",
      }}
      onClick={handleBackdropClick}
    >
      <div
        id="rules-modal"
        role="dialog"
        aria-labelledby="rules-modal-title"
        aria-describedby="rules-modal-body"
        className="modal fade show d-block"
        aria-modal="true"
        style={{ display: "block" }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h5 id="rules-modal-title" className="modal-title">
                Rules
              </h5>
              <div
                className="close"
                onClick={onClose}
                style={{ cursor: "pointer" }}
              >
                ×
              </div>
            </header>
            <div id="rules-modal-body" className="modal-body">
              <div className="main-rules-container">
                <div className="dropdown rules-language-container">
                  <div
                    className="dropdown-toggle"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="https://g1ver.sprintstaticdata.com/v79/static/admin/img/flag_english.png"
                      alt="English flag"
                    />
                    English
                    <i className="fas fa-angle-down ml-1" />
                  </div>
                  <div className="dropdown-menu rules-language">
                    <div>
                      <img
                        src="https://g1ver.sprintstaticdata.com/v79/static/admin/img/flag_english.png"
                        alt="English flag"
                      />
                      <span>English</span>
                    </div>
                  </div>
                </div>
                <div className="menu-box">
                  <div id="accordion">
                    {/* Football */}
                    <div className="card">
                      <div
                        id="eventhead0"
                        className="card-header"
                        onClick={() => toggleSection("event0")}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`${
                            openSections["event0"] ? "" : "collapsed"
                          }`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          Football
                        </div>
                      </div>
                      <div
                        id="event0"
                        aria-labelledby="eventhead0"
                        className={`collapse ${
                          openSections["event0"] ? "show" : ""
                        }`}
                      >
                        <div id="eventaccordion0" className="card-body">
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event0game0")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event0game0"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                bookmaker
                              </div>
                            </div>
                            <div
                              id="event0game0"
                              className={`card-body collapse ${
                                openSubSections["event0game0"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text">
                                If the match will not take place within 48 hours
                                of the original kick-off time bets will be void.
                              </div>
                              <div className="rule-text text-danger">
                                If the selection is in a multiple bet or
                                accumulator any refund must be requested before
                                kick-off of the first leg of the multiple bet.
                              </div>
                              <div className="rule-text text-danger">
                                Where a confirmed postponed match features as
                                part of a multiple bet, the bet will stand on
                                the remaining selections in the multiple.
                              </div>
                              <div className="rule-text">
                                Please note that games which have their kick-off
                                altered well in advance to accommodate live TV,
                                or to ease fixture congestion will not be
                                classed as postponed.
                              </div>
                              <div className="rule-text text-danger">
                                If a match is forfeited or a team is given a
                                walkover victory without the match having kicked
                                off, then all bets will be void. Any
                                subsequently awarded scoreline will not count
                                for settlement purposes.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event0game1")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event0game1"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                fancy
                              </div>
                            </div>
                            <div
                              id="event0game1"
                              className={`card-body collapse ${
                                openSubSections["event0game1"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                Tournament Total Goals, Team Total Goals goals.
                                scored in 90 minutes or in extra-time will
                                count.Goals scored in penalty shootouts do not
                                count.
                              </div>
                              <div className="rule-text text-danger">
                                Tournament Corners - Only corners taken in 90
                                minutes count.
                              </div>
                              <div className="rule-text text-danger">
                                Tournament Penalties Missed/Converted -
                                Penalties taken in 90 minutes, extra-time and
                                penalty shootouts all count. If a penalty has to
                                be re-taken the previous disallowed penalty(ies)
                                do not count.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cricket - Complete Section */}
                    <div className="card">
                      <div
                        id="eventhead18"
                        className="card-header"
                        onClick={() => toggleSection("event18")}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`${
                            openSections["event18"] ? "" : "collapsed"
                          }`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          Cricket
                        </div>
                      </div>
                      <div
                        id="event18"
                        aria-labelledby="eventhead18"
                        className={`collapse ${
                          openSections["event18"] ? "show" : ""
                        }`}
                      >
                        <div id="eventaccordion18" className="card-body">
                          {/* Cricket Bookmaker */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game0")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game0"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                bookmaker
                              </div>
                            </div>
                            <div
                              id="event18game0"
                              className={`card-body collapse ${
                                openSubSections["event18game0"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                1. Due to any reason any team will be getting
                                advantage or disadvantage we are not concerned.
                              </div>
                              <div className="rule-text text-danger">
                                2. We will simply compare both teams 25 overs
                                score higher score team will be declared winner
                                in ODI (If both teams same score means, low
                                wickets team will be declared winner. In case,
                                both teams same score &amp; same wickets means
                                highest boundaries team will be declared
                                winner.If all same then will be declared No
                                result)
                              </div>
                              <div className="rule-text text-danger">
                                3. We will simply compare both teams 10 overs
                                higher score team will be declared winner in T20
                                matches (If both teams same score means, low
                                wickets team will be declared winner. In case,
                                both teams same score &amp; same wickets means
                                highest boundaries team will be declared
                                winner.If all same then will be declared No
                                result)
                              </div>
                              <div className="rule-text text-danger">
                                4. Any query about the result or rates should be
                                contacted within 7 days of the specific event,
                                the same will not be considered valid post 7
                                days from the event.
                              </div>
                              <div className="rule-text text-danger">
                                5. Company reserves the right to suspend/void
                                any id/bets if the same is found to be
                                illegitimate. For example incase of
                                vpn/robot-use/multiple entry from same IP/
                                multiple bets at the same time (Punching) and
                                others. Note : only winning bets will be voided.
                              </div>
                            </div>
                          </div>

                          {/* Cricket Fancy */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game1")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game1"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                fancy
                              </div>
                            </div>
                            <div
                              id="event18game1"
                              className={`card-body collapse ${
                                openSubSections["event18game1"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                1. All fancy bets will be validated when match
                                has been tied.
                              </div>
                              <div className="rule-text text-danger">
                                2. All advance fancy will be suspended before
                                toss or weather condition. All advance fancy
                                will be voided if over reduced before match
                                start.
                              </div>
                              <div className="rule-text text-danger">
                                3. In case technical error or any circumstances
                                any fancy is suspended and does not resume
                                result will be given all previous bets will be
                                valid (based on haar/jeet).
                              </div>
                            </div>
                          </div>

                          {/* Cricket Fancy1 */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game2")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game2"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                fancy1
                              </div>
                            </div>
                            <div
                              id="event18game2"
                              className={`card-body collapse ${
                                openSubSections["event18game2"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                1. Odd/Even Rules. (W.e.f 5th January 2024)
                              </div>
                              <div className="rule-text">
                                1.3 In case of all out or the target chased
                                down, particular session will be considered as a
                                completed session.
                              </div>
                              <div className="rule-text">
                                For Example : IN ODI - IND got all out at 12.3
                                over then 15 over session will be considered as
                                a completed session or AUS get chase down the
                                target in 12.3 over then 15 over session will be
                                considered as a completed&nbsp;session.
                              </div>
                            </div>
                          </div>

                          {/* Cricket Casino */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game3")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game3"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                cricket casino
                              </div>
                            </div>
                            <div
                              id="event18game3"
                              className={`card-body collapse ${
                                openSubSections["event18game3"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                1. Completed game is valid , In case match
                                abandoned due to rain particular game will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                1.2 If a team got all out in 17 over although
                                Innings Lambi run valid. (w.e.f. 15th June 2024)
                              </div>
                              <div className="rule-text text-danger">
                                2. Penalty runs will be counted in our exchange.
                                (This rule applicable from 15th June 2024)
                              </div>
                            </div>
                          </div>

                          {/* Cricket Match */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game4")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game4"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                match
                              </div>
                            </div>
                            <div
                              id="event18game4"
                              className={`card-body collapse ${
                                openSubSections["event18game4"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text text-danger">
                                Indian Premier League (IPL)
                              </div>
                              <div className="rule-text text-danger">
                                If IPL fixture of 74 matches gets reduced due to
                                any reason, then all the special fancies will be
                                voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                            </div>
                          </div>

                          {/* Cricket Khado */}
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event18game5")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event18game5"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                khado
                              </div>
                            </div>
                            <div
                              id="event18game5"
                              className={`card-body collapse ${
                                openSubSections["event18game5"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text">
                                Only First inning valid for T20 and one day
                                matches.
                              </div>
                              <div className="rule-text">
                                Same will be work like Lambi. If match abandoned
                                or over reduced, all bets will be deleted.
                              </div>
                              <div className="rule-text">
                                You can choose your own value in this event.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Politics */}
                    <div className="card">
                      <div
                        id="eventhead19"
                        className="card-header"
                        onClick={() => toggleSection("event19")}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`${
                            openSections["event19"] ? "" : "collapsed"
                          }`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          Politics
                        </div>
                      </div>
                      <div
                        id="event19"
                        aria-labelledby="eventhead19"
                        className={`collapse ${
                          openSections["event19"] ? "show" : ""
                        }`}
                      >
                        <div id="eventaccordion19" className="card-body">
                          <div className="card">
                            <div
                              className="card-header"
                              onClick={() => toggleSubSection("event19game0")}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`${
                                  openSubSections["event19game0"]
                                    ? ""
                                    : "collapsed"
                                }`}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                fancy
                              </div>
                            </div>
                            <div
                              id="event19game0"
                              className={`card-body collapse ${
                                openSubSections["event19game0"] ? "show" : ""
                              }`}
                            >
                              <div className="rule-text">
                                1. This event is to decide the winner of various
                                legislative assemblies of india.
                              </div>
                              <div className="rule-text">
                                2. The final result declared by election
                                commission of india for assembly elections of
                                various states of india for a particular year
                                will be valid in our exchange ,The customers are
                                entirely responsible for their bets at all
                                times.
                              </div>
                              <div className="rule-text">
                                3. All bets will be voided if the election
                                doesn't take place in given time by election
                                commission or as per our exchange management
                                decision.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add other sports sections as needed */}

                    <div className="card">
                      <div id="eventhead15" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event15"
                          aria-controls="event15"
                          className="collapsed"
                        >
                          Sumo
                        </a>
                      </div>{" "}
                      <div
                        id="event15"
                        aria-labelledby="eventhead15"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion15" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event15game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion15"
                              id="event15game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead16" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event16"
                          aria-controls="event16"
                          className="collapsed"
                        >
                          Virtual sports
                        </a>
                      </div>{" "}
                      <div
                        id="event16"
                        aria-labelledby="eventhead16"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion16" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event16game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion16"
                              id="event16game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead17" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event17"
                          aria-controls="event17"
                          className="collapsed"
                        >
                          Handball
                        </a>
                      </div>{" "}
                      <div
                        id="event17"
                        aria-labelledby="eventhead17"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion17" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event17game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion17"
                              id="event17game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                Match Odds:- Predict which team will be the
                                winner. Bets will be void if the match is not
                                completed.
                              </div>
                              <div className="rule-text">
                                Next Goal:- Predict which team will score the
                                X-th goal.
                              </div>
                              <div className="rule-text">
                                Highest Scoring Half:- Predict which half will
                                have the most goals scored (1st, 2nd or Draw).
                                Bet will be settled on regulation time only and
                                exclude overtime if played:
                              </div>
                              <div className="rule-text">
                                Halftime/Fulltime:- Predict the result of a
                                match at halftime and at the end of regular
                                time. If a game is abandoned, bets will be void.
                                Example: If you choose 1/X, you bet on the home
                                team to lead in the first half and the match to
                                end in a draw. Extra time doesn’t count.
                              </div>
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead18" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event18"
                          aria-controls="event18"
                          className="collapsed"
                        >
                          Cricket
                        </a>
                      </div>{" "}
                      <div
                        id="event18"
                        aria-labelledby="eventhead18"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion18" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game0"
                                className="collapsed"
                              >
                                bookmaker
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                1. Due to any reason any team will be getting
                                advantage or disadvantage we are not concerned.
                              </div>
                              <div className="rule-text text-danger">
                                2. We will simply compare both teams 25 overs
                                score higher score team will be declared winner
                                in ODI (If both teams same score means, low
                                wickets team will be declared winner. In case,
                                both teams same score &amp; same wickets means
                                highest boundaries team will be declared
                                winner.If all same then will be declared No
                                result)
                              </div>
                              <div className="rule-text text-danger">
                                3. We will simply compare both teams 10 overs
                                higher score team will be declared winner in T20
                                matches (If both teams same score means, low
                                wickets team will be declared winner. In case,
                                both teams same score &amp; same wickets means
                                highest boundaries team will be declared
                                winner.If all same then will be declared No
                                result)
                              </div>
                              <div className="rule-text text-danger">
                                4. Any query about the result or rates should be
                                contacted within 7 days of the specific event,
                                the same will not be considered valid post 7
                                days from the event.
                              </div>
                              <div className="rule-text text-danger">
                                5. Company reserves the right to suspend/void
                                any id/bets if the same is found to be
                                illegitimate. For example incase of
                                vpn/robot-use/multiple entry from same IP/
                                multiple bets at the same time (Punching) and
                                others. Note : only winning bets will be voided.
                              </div>
                              <div className="rule-text text-danger">
                                6. In case, company will find Ground bets, Group
                                betting, Punching bets, Multiple entries with
                                same IP or any fraud or unusual activities are
                                detected then Company will be void winning bets
                                and charge penalty of 2X (Two times) from
                                winning amount.
                              </div>
                              <div className="rule-text text-danger">
                                7. If two team ends up with equal points, then
                                result will be given based on the official point
                                table
                              </div>
                              <div className="rule-text text-danger">
                                8. Super Over Bookmaker: If the scores are level
                                at the end of both innings in the Super Over,
                                the same market will continue into subsequent
                                Super Overs until a winner is declared. (This
                                rule applicable from 19th July 2025)
                              </div>
                              <div className="rule-text text-danger">
                                9. In case technical error or any circumstances
                                any bookmaker is suspended and does not resume
                                result will be given all previous bets will be
                                valid (based on haar/jeet).
                              </div>
                              <div className="rule-text text-danger">
                                10. If a Match, Series, or League is postponed
                                or rescheduled before any ball is bowled, all
                                bets for that event will be voided. However, if
                                play has already started and the match continues
                                on a reserve day, then all bets will remain
                                valid.
                              </div>
                              <div className="rule-text text-danger">
                                11. If, for any reason, the trophy is shared
                                between both teams, then all related bets will
                                be voided.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game1"
                                className="collapsed"
                              >
                                fancy
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game1"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                1. All fancy bets will be validated when match
                                has been tied.
                              </div>
                              <div className="rule-text text-danger">
                                2. All advance fancy will be suspended before
                                toss or weather condition. All advance fancy
                                will be voided if over reduced before match
                                start.
                              </div>
                              <div className="rule-text text-danger">
                                3. In case technical error or any circumstances
                                any fancy is suspended and does not resume
                                result will be given all previous bets will be
                                valid (based on haar/jeet).
                              </div>
                              <div className="rule-text text-danger">
                                4. If any case wrong rate has been given in
                                fancy that particular bets will be cancelled.
                              </div>
                              <div className="rule-text text-danger">
                                5. In any circumstances management decision will
                                be final related to all exchange items. Our
                                scorecard will be considered as valid if there
                                is any mismatch in online portal.
                              </div>
                              <div className="rule-text text-danger">
                                6. In case customer make bets in wrong fancy we
                                are not liable to delete. No changes will be
                                made and bets will be consider as confirm bet.
                              </div>
                              <div className="rule-text text-danger">
                                7. Due to any technical error market is open and
                                result has came all bets after result will be
                                deleted.
                              </div>
                              <div className="rule-text text-danger">
                                8. Manual bets are not accepted in our exchange.
                              </div>
                              <div className="rule-text text-danger">
                                9.Our exchange will provide 5 second delay in
                                our TV.
                              </div>
                              <div className="rule-text text-danger">
                                10. Company reserves the right to suspend/void
                                any id/bets if the same is found to be
                                illegitimate. For example incase of
                                VPN/robot-use/multiple entry from same IP and
                                others. Note : only winning bets will be voided.
                              </div>
                              <div className="rule-text text-danger">
                                11. Company reserves the right to void any bets
                                (only winning bets) of any event at any point of
                                the match if the company believes there is any
                                cheating/wrong doing in that particular event by
                                the players (either batsman/bowler)
                              </div>
                              <div className="rule-text text-danger">
                                12. Once our exchange give username and password
                                it is your responsibility to change a password.
                              </div>
                              <div className="rule-text text-danger">
                                13. Penalty runs will be counted in all fancy.
                                (This rule applicable from 20th March 2024)
                              </div>
                              <div className="rule-text text-danger">
                                14. Warning:- live scores and other data on this
                                site is sourced from third party feeds and may
                                be subject to time delays and/or be inaccurate.
                                If you rely on this data to place bets, you do
                                so at your own risk. Our exchange does not
                                accept responsibility for loss suffered as a
                                result of reliance on this data.
                              </div>
                              <div className="rule-text text-danger">
                                15. Traders will be block the user ID if find
                                any misinterpret activities, No queries accept
                                regarding.
                              </div>
                              <div className="rule-text text-danger">
                                16. Company will not delete No ball and Short
                                run bets below amount of INR.10k. It's will be
                                delete only INR 10k,PKR 30000,BDT 15000,USD
                                100,HKD 1000,AED 500,SLR 30000,GBP 100 and above
                                amount. Company reserves the right to delete any
                                bets including below 10k also if found to be
                                Ground bets. (This rule applicable from IST
                                19:00 Hours on 1st May 2025)
                              </div>
                              <div className="rule-text text-danger">
                                17. Our exchange is not responsible for misuse
                                of client id.
                              </div>
                              <div className="rule-text text-danger">
                                18.In case, company will find Ground bets, Group
                                betting, Punching bets, Multiple entries with
                                same IP or any fraud or unusual activities are
                                detected then Company will be void winning bets
                                and charge penalty of 2X (Two times) from
                                winning amount.
                              </div>
                              <div className="rule-text text-danger">TEST</div>
                              <div className="rule-text text-danger">
                                1 Session:-
                              </div>
                              <div className="rule-text">
                                1.1 Complete session valid in test.
                              </div>
                              <div className="rule-text">
                                1.2 Middle session and Session is not completed
                                due to Innings declared or all out so that
                                particular over considered as completed and
                                remaining over counted in next team Innings for
                                ex:- In case of Innings declared or all out In
                                131.5th over Considered as 132 over completed
                                remaining 1 over counted for 133 over middle
                                session and 3 over counted for 135 over session
                                from next team Innings and One over session and
                                Only over session is not completed due to
                                innings declared so that Particular over session
                                bets will be deleted and all out considered as
                                valid for ex:- In case of Innings declared In
                                131.5th over so 132 over will be deleted and if
                                all out then 132 over and Only 132 over will be
                                Valid.
                              </div>
                              <div className="rule-text">
                                1.3 1st day 1st session run minimum 25 over will
                                be played then result is given otherwise 1st day
                                1st session will be deleted.
                              </div>
                              <div className="rule-text">
                                1.4 1st day 2nd session run minimum 25 over will
                                be played then result is given otherwise 1st day
                                2nd session will be deleted.
                              </div>
                              <div className="rule-text">
                                1.5 1st day total run minimum 80 over will be
                                played then result is given otherwise 1st day
                                total run will be deleted. If a team get All Out
                                before the day stumps, the other team's 1st day
                                score will be added to 1st day total run event.
                                (i.e. AUSTRALIA got all out at 251 before the
                                day stumps, then ENGLAND hit 100 runs in the
                                remaining overs of 1st day, so the result of 1st
                                day total run event will be 351)
                              </div>
                              <div className="rule-text">
                                1.6 Test match both advance session is valid.
                              </div>
                              <div className="rule-text text-danger">
                                2 Test lambi/ Inning run:-
                              </div>
                              <div className="rule-text">
                                2.1 Mandatory 70 over played in test lambi
                                paari/ Innings run. If any team all-out or
                                declaration lambi paari/ innings run is valid.
                              </div>
                              <div className="rule-text">
                                2.2 In case due to weather situation match has
                                been stopped all lambi trades will be deleted.
                              </div>
                              <div className="rule-text">
                                2.3 In test both lambi paari / inning run is
                                valid in advance fancy.
                              </div>
                              <div className="rule-text text-danger">
                                3 Test batsman:-
                              </div>
                              <div className="rule-text">
                                3.1 In case batsmen is injured he/she is made 34
                                runs the result will be given 34 runs.
                              </div>
                              <div className="rule-text">
                                3.2 Batsman 50/100 run if batsman is injured or
                                declaration the result will be given on
                                particular run.
                              </div>
                              <div className="rule-text">
                                3.3 In next men out fancy if player is injured
                                particular fancy will be deleted.
                              </div>
                              <div className="rule-text">
                                3.4 In advance fancy opening batsmen is only
                                valid if same batsmen came in opening the fancy
                                will be valid in case one batsmen is changed
                                that particular player fancy will be deleted.
                              </div>
                              <div className="rule-text">
                                3.5 Test match both advance fancy batsmen run is
                                valid.
                              </div>
                              <div className="rule-text text-danger">
                                4 Test partnership:-
                              </div>
                              <div className="rule-text">
                                4.1 In partnership one batsman is injured or
                                Retired out means partnership will continued in
                                next batsman.
                              </div>
                              <div className="rule-text">
                                4.2 Partnership and player runs due to weather
                                condition or match abandoned or match completed,
                                then the result will be given as per score.
                              </div>
                              <div className="rule-text">
                                4.3 Advance partnership is valid in case both
                                players are different or same.
                              </div>
                              <div className="rule-text">
                                4.4 Test match both advance fancy partnership is
                                valid.
                              </div>
                              <div className="rule-text text-danger">
                                5 Other fancy advance (test):-
                              </div>
                              <div className="rule-text">
                                5.1 Four, sixes, wide, wicket, extra run, total
                                run, highest over and top batsmen is valid only
                                if 300 overs has been played or the match has
                                been won by any team otherwise all these fancy
                                will be deleted. Additionally all events are
                                valid only for 1st innings( this is applicable
                                to all individual team events also)
                              </div>
                              <div className="rule-text text-danger">
                                2 Odi rule:-
                              </div>
                              <div className="rule-text text-danger">
                                Session:-
                              </div>
                              <div className="rule-text">
                                Match 1st over run advance fancy only 1st
                                innings run will be counted.
                              </div>
                              <div className="rule-text">
                                Complete session is valid in case due to rain or
                                match abandoned particular session will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                For example:- 35 over run team a is playing any
                                case team A is all-out in 33 over team a has
                                made 150 run the session result is validated on
                                particular run.
                              </div>
                              <div className="rule-text">
                                Advance session is valid in only 1st innings.
                              </div>
                              <div className="rule-text text-danger">
                                50 over runs:-
                              </div>
                              <div className="rule-text">
                                In case 50 over is not completed all bet will be
                                deleted due to weather or any condition.
                              </div>
                              <div className="rule-text">
                                Advance 50 over runs is valid in only 1st
                                innings.
                              </div>
                              <div className="rule-text text-danger">
                                Odi batsman runs:-
                              </div>
                              <div className="rule-text">
                                In case batsman is injured he/she is made 34
                                runs the result will be given 34 runs.
                              </div>
                              <div className="rule-text">
                                In next men out fancy if player is injured
                                particular fancy will be deleted.
                              </div>
                              <div className="rule-text">
                                In advance fancy opening batsmen is only valid
                                if same batsmen came in opening the fancy will
                                be valid in case one batsmen is changed that
                                particular player fancy will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Odi partnership runs:-
                              </div>
                              <div className="rule-text">
                                In partnership one batsman is injured or Retired
                                out means partnership will continued in next
                                batsman.
                              </div>
                              <div className="rule-text">
                                Advance partnership is valid in case both
                                players are different or same.
                              </div>
                              <div className="rule-text">
                                Both team advance partnerships are valid in
                                particular match.
                              </div>
                              <div className="rule-text text-danger">
                                Other fancy:-
                              </div>
                              <div className="rule-text">
                                Four, sixes, wide, wicket, extra run, total run,
                                highest over ,top batsman,maiden
                                over,caught-out,no-ball,run-out,fifty and
                                century are valid only match has been completed
                                in case due to rain over has been reduced all
                                other fancy will be deleted.
                              </div>
                              <div className="rule-text text-danger">T20:-</div>
                              <div className="rule-text text-danger">
                                Session:-
                              </div>
                              <div className="rule-text">
                                Match 1st over run advance fancy only 1st
                                innings run will be counted.
                              </div>
                              <div className="rule-text">
                                Complete session is valid in case due to rain or
                                match abandoned particular session will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                For example :- 15 over run team a is playing any
                                case team a is all-out in 13 over team A has
                                made 100 run the session result is validated on
                                particular run.
                              </div>
                              <div className="rule-text">
                                Advance session is valid in only 1st innings.
                              </div>
                              <div className="rule-text text-danger">
                                20 over runs:-
                              </div>
                              <div className="rule-text">
                                Advance 20 over run is valid only in 1st
                                innings. 20 over run will not be considered as
                                valid if 20 overs is not completed due to any
                                situation.
                              </div>
                              <div className="rule-text">
                                3.) No ball free hit ball bets will be voided.
                              </div>
                              <div className="rule-text text-danger">
                                Badla Rule:
                              </div>
                              <div className="rule-text">
                                1.) Our session rate 45/46 means you can chances
                                to bet 5 upper and down badla rate (Ex: Badla
                                Down rate 40,41,42,43,44 and Badla Upper rate
                                47,48,49,50,51).
                              </div>
                              <div className="rule-text">
                                If the result is your chosen badla rate, you
                                will make a profit. If the result is our rate,
                                you will make a loss. If any other results all
                                badla bets will be voided.
                              </div>
                              <div className="rule-text">
                                2.) If session rate 45.110.90 then you can
                                chances to bet only upper badla value. (Ex:
                                Upper badla value is 46,47,48,49,50).
                              </div>
                              <div className="rule-text">
                                If the result is your chosen badla rate, you
                                will get 90% profit. If the result is our rate,
                                you will get 110% loss.
                              </div>
                              <div className="rule-text text-danger">
                                T20 batsman runs:-
                              </div>
                              <div className="rule-text">
                                In case batsman is injured he/she is made 34
                                runs the result will be given 34 runs.
                              </div>
                              <div className="rule-text">
                                In next men out fancy if player is injured
                                particular fancy will be deleted.
                              </div>
                              <div className="rule-text">
                                In advance fancy opening batsmen is only valid
                                if same batsmen came in opening the fancy will
                                be valid in case one batsmen is changed that
                                particular player fancy will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                T20 partnership runs:-
                              </div>
                              <div className="rule-text">
                                In partnership one batsman is injured or Retired
                                out means partnership will continued in next
                                batsman.
                              </div>
                              <div className="rule-text">
                                Advance partnership is valid in case both
                                players are different or same.
                              </div>
                              <div className="rule-text">
                                Both team advance partnerships are valid in
                                particular match.
                              </div>
                              <div className="rule-text text-danger">
                                1st 2 &amp; 3 &amp; 4 Wickets runs:- T20/ODI
                              </div>
                              <div className="rule-text">
                                Advance event is valid in only 1st Innings.
                              </div>
                              <div className="rule-text">
                                If over reduced due to rain or weather condition
                                or match abandoned or match completed, then the
                                result will be given as per score.
                              </div>
                              <div className="rule-text text-danger">
                                Other fancy:-
                              </div>
                              <div className="rule-text">
                                T-20 ,one day and test match in case current
                                innings player and partnership are running in
                                between match has been called off or abandoned
                                that situation all current player and
                                partnership results are valid.
                              </div>
                              <div className="rule-text">
                                Four, sixes, wide, wicket, extra run, total run,
                                highest over and top batsman,maiden
                                over,caught-out,no-ball,run-out,fifty and
                                century are valid only match has been completed
                                in case due to rain over has been reduced all
                                other fancy will be deleted. 1st 6 over dot ball
                                and 20 over dot ball fancy only valid is 1st
                                innings.
                              </div>
                              <div className="rule-text">
                                1st wicket lost to any team balls meaning that
                                any team 1st wicket fall down in how many balls
                                that particular fancy at least minimum one ball
                                have to be played otherwise bets will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                1st wicket lost to any team fancy valid both
                                innings.
                              </div>
                              <div className="rule-text">
                                How many balls for 50 runs any team meaning that
                                any team achieved 50 runs in how many balls that
                                particular fancy at least one ball have to be
                                played otherwise that fancy bets will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                How many balls for 50 runs fancy any team only
                                first inning valid.
                              </div>
                              <div className="rule-text">
                                1st 6 inning boundaries runs any team fancy will
                                be counting only according to run scored fours
                                and sixes at least 6 over must be played
                                otherwise that fancy will be deleted.
                              </div>
                              <div className="rule-text">
                                1st inning 6 over boundaries runs any team run
                                like wide ,no-ball ,leg-byes ,byes and over
                                throw runs are not counted this fancy.
                              </div>
                              <div className="rule-text">
                                How many balls face any batsman meaning that any
                                batsman how many balls he/she played that
                                particular fancy at least one ball have to be
                                played otherwise that fancy bets will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                How many balls face by any batsman both innings
                                valid.
                              </div>
                              <div className="rule-text">
                                Lowest scoring over will be considered valid
                                only if the over is completed fully (all six
                                deliveries has to be bowled)
                              </div>
                              <div className="rule-text">
                                Total Wickets: If a Batsman Retired hurt or
                                Retired out means It will not be Counted in
                                Total Wicket.
                              </div>
                              <div className="rule-text">
                                Most 4s in Single Over: Maximum number of 4s hit
                                in a single over of the Match. No ball 4s will
                                be counted. Byes &amp; Leg byes 4s will not be
                                counted.
                              </div>
                              <div className="rule-text">
                                Most 6s in Single Over : Maximum number of 6s
                                hit in a Single over of the Match. No ball 6s
                                will be counted.
                              </div>
                              <div className="rule-text">
                                Total No Boundaries over’s: Number of over’s
                                where no boundaries (fours or sixes) are scored.
                                If a team all out or Match Resulted in 15.1 then
                                considered as 16 over. Team wise 1st Innings
                                only Considered. Total Match means Both Innings
                                will be considered.
                              </div>
                              <div className="rule-text">
                                Total Impact over’s: Number of over’s scored 10
                                runs or above. If a team all out or Match
                                Resulted in 15.1 then considered as 16 over.
                                Team wise 1st Innings only Considered. Total
                                Match means Both Innings will be considered.
                              </div>
                              <div className="rule-text">
                                Total Reviews Taken in Full Match: Number of
                                Reviews taken in full match. Wickets, Wide &amp;
                                No ball Reviews will be Considered.
                              </div>
                              <div className="rule-text">
                                Total Match Successful Reviews: Number of
                                Reviews are Successful. Successful means
                                Original decision must be changed.
                              </div>
                              <div className="rule-text">
                                Total Match Unsuccessful Reviews: Number of
                                Reviews are Unsuccessful. Unsuccessful means
                                Original decision same after DRS.
                              </div>
                              <div className="rule-text">
                                Total Reviews Resulted Umpire's Call: Number of
                                Reviews Resulted Umpire's Call during the Wicket
                                Review.
                              </div>
                              <div className="rule-text">
                                Total Reviews Taken by Batting Team: Number of
                                Reviews taken by batting team. Both Innings will
                                be Considered.
                              </div>
                              <div className="rule-text">
                                Total Reviews Taken by Bowling Team: Number of
                                Reviews taken by bowling team. Both Innings will
                                be Considered.
                              </div>
                              <div className="rule-text">
                                Total Reviews Taken by Team: Number of Reviews
                                taken by Particular team during Batting and
                                Bowling.
                              </div>
                              <div className="rule-text">
                                Total Match 30s : How many batsman's scored 30
                                to 49 runs in full match. If a Player reached 50
                                means, Not considered in this Event.
                              </div>
                              <div className="rule-text">
                                Total Boundaries in 1st Power play : Number of
                                Boundaries Scored in 1st Power play, 1st Innings
                                only Valid In T20/ODI Both
                              </div>
                              <div className="rule-text">
                                Total Dot balls in 1st Power play : Number of
                                Dot balls coming in 1st Power play, 1st Innings
                                only Valid In T20/ODI Both
                              </div>
                              <div className="rule-text">
                                Total match Wicket keeper's Dismissals: Wicket
                                keepers Caught outs and Stumping Only Considered
                                In T20/ODI Both
                              </div>
                              <div className="rule-text">
                                1st Inn Death Over Runs : Runs Scored, Last Over
                                Only Considered, 1st Innings only Valid
                              </div>
                              <div className="rule-text">
                                Total Match Single Digit Scores By Players :
                                Duck outs Not Considered in this Event. If Not
                                out Batsman/Injured Batsman facing One Legal
                                Delivery and nothing scored ('0') means
                                Considered as Single Digit
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman : Maximum Balls
                                Faced by an Individual Batsman in Match
                              </div>
                              <div className="rule-text">
                                High Pship Boundaries in the Match : Maximum
                                Number of Boundaries Scored during any
                                Partnership
                              </div>
                              <div className="rule-text">
                                Total Impact over’s: Number of over’s scored 10
                                runs or above. If a team all out or Match
                                Resulted in 15.1 then considered as 16 over.
                                Team wise only 1st inning are valid and Match
                                wise both innings are valid.
                              </div>
                              <div className="rule-text">
                                Total Match Four Hitters : Number of Batsman
                                hitting Fours in full match.
                              </div>
                              <div className="rule-text">
                                Total Match Six Hitters : Number of Batsman
                                hitting Sixes in full match.
                              </div>
                              <div className="rule-text">
                                Total Match Wicket Takers : Number of bowlers
                                taking wickets in full match.
                              </div>
                              <div className="rule-text">
                                100 balls Event: The events for 1 to 100 balls
                                will be considered valid only if the number of
                                balls mentioned has been played completely.
                                However if the balls got reduced before the
                                particular event then the same will be voided,
                                if the team batting first get all out prior to
                                100 balls the balance balls will be counted from
                                second innings. For example if team batting
                                first gets all out in 81 balls balance 19 balls
                                will be counted from second innings and that 19
                                balls all events are counted. This same is valid
                                for 1st Innings only.
                              </div>
                              <div className="rule-text text-danger">
                                Concussion in Test:-
                              </div>
                              <div className="rule-text">
                                All bets of one over session will be deleted in
                                test scenario, in case session is incomplete.
                                For example innings declared or match suspended
                                to bad light or any other conditions.
                              </div>
                              <div className="rule-text">
                                1. All bets will be considered as valid if a
                                player has been replaced under concussion
                                substitute, result will be given for the runs
                                scored by the mentioned player. For example DM
                                Bravo gets retired hurt at 23 runs, then result
                                will be given for 23.
                              </div>
                              <div className="rule-text">
                                2. Bets of both the player will be valid under
                                concussion substitute.
                              </div>
                              <div className="rule-text text-danger">
                                Line Market :-
                              </div>
                              <div className="rule-text">
                                The result will be given of the particular Line
                                Market only if the mentioned over is completed
                                or the batting team is bowled out(All Out) or
                                the target is chased down.
                              </div>
                              <div className="rule-text text-danger">
                                Note : Penalty runs will be included in all
                                the&nbsp;Line&nbsp;Markets.
                              </div>
                              <div className="rule-text text-danger">
                                Total Match- Events (test):-
                              </div>
                              <div className="rule-text">
                                Minimum of 300 overs to be bowled in the entire
                                test match, otherwise all bets related to the
                                particular event will get void. For example,
                                Total match caught outs will be valid only if
                                300 overs been bowled in the particular test
                                match
                              </div>
                              <div className="rule-text text-danger">
                                Limited over events-Test:-
                              </div>
                              <div className="rule-text">
                                This event will be considered valid only if the
                                number of overs defined on the particular event
                                has been bowled, otherwise all bets related to
                                this event will get void. For example 0-25 over
                                events will be valid only if 25 overs has been
                                bowled, else the same will not be considered as
                                valid
                              </div>
                              <div className="rule-text">
                                If the team gets all out prior to any of the
                                defined overs, then balance overs will be
                                counted in next innings. For example if the team
                                gets all out in 23.1 over the same will be
                                considered as 24 overs and the balance overs
                                will be counted from next innings.
                              </div>
                              <div className="rule-text text-danger">
                                Bowler Wicket event's- Test:-
                              </div>
                              <div className="rule-text">
                                Minimum of one legal over (one complete over)
                                has to be bowled by the bowler mentioned in the
                                event, else the same will not be considered as
                                valid.
                              </div>
                              <div className="rule-text text-danger">
                                Bowler over events- Test:-
                              </div>
                              <div className="rule-text">
                                The mentioned bowler has to complete the defined
                                number of overs, else the bets related to that
                                particular event will get void. For example if
                                the mentioned bowler has bowled 8 overs, then 5
                                over run of that particular bowler will be
                                considered as valid and the 10 over run will get
                                void.
                              </div>
                              <div className="rule-text text-danger">
                                Player ball event's- Test:-
                              </div>
                              <div className="rule-text">
                                This event will be considered valid only if the
                                defined number of runs made by the mentioned
                                player, else the result will be considered as 0
                                (zero) balls.
                              </div>
                              <div className="rule-text">
                                For example if Root makes 20 runs in 60 balls
                                and gets out on 22 runs, result for 20 runs will
                                be 60 balls and the result for balls required
                                for 25 run Root will be considered as 0 (Zero)
                                and the same will be given as result
                              </div>
                              <div className="rule-text text-danger">
                                Limited over events-ODI:-
                              </div>
                              <div className="rule-text">
                                This event will be considered valid only if the
                                number of overs defined on the particular event
                                has been bowled, otherwise all bets related to
                                this event will get void. 0-50 over events will
                                be valid only if 50 over completed, if the team
                                batting first get all out prior to 50 over the
                                balance over will be counted from second
                                innings. For example if team batting first gets
                                all out in 35 over balance 15 over will be
                                counted from second innings, the same applies
                                for all events if team gets all out before the
                                defined number of overs.
                              </div>
                              <div className="rule-text">
                                The events which remains incomplete will be
                                voided if over gets reduced in the match due to
                                any situation, for example if match interrupted
                                in 15 overs due to rain/badlight and post this
                                over gets reduced. Events for 0-10 will be
                                valid, all other events related to this type
                                will get deleted.
                              </div>
                              <div className="rule-text">
                                This events will be valid only if the defined
                                number of over is completed. For example team
                                batting first gets all out in 29.4 over then the
                                same will be considered as 30 over, the team
                                batting second must complete 20 overs only then
                                0-50 over events will be considered as valid. In
                                case team batting second gets all out in 19.4
                                over then 0-50 over event will not be considered
                                as valid, This same is valid for 1st Innings
                                only.
                              </div>
                              <div className="rule-text text-danger">
                                Bowler event- ODI:-
                              </div>
                              <div className="rule-text">
                                The mentioned bowler has to complete the defined
                                number of overs, else the bets related to that
                                particular event will get void. For example if
                                the mentioned bowler has bowled 8 overs, then 5
                                over run of that particular bowler will be
                                considered as valid and the 10 over run will get
                                void.
                              </div>
                              <div className="rule-text">
                                Both innings are valid
                              </div>
                              <div className="rule-text text-danger">
                                Other event:- T20
                              </div>
                              <div className="rule-text">
                                The events for 1-10 over and 11-20 over will be
                                considered valid only if the number of over
                                mentioned has been played completely. However if
                                the over got reduced before the particular event
                                then the same will be voided, if the team
                                batting first get all out prior to 20 over the
                                balance over will be counted from second
                                innings. For example if team batting first gets
                                all out in 17 over balance 3 over will be
                                counted from second innings and that 3 over all
                                events are counted. This same is valid for 1st
                                Innings only.
                              </div>
                              <div className="rule-text">
                                If over got reduced in between any running
                                event, then the same will be considered valid
                                and the rest will be voided. For example..,
                                match started and due to rain/bad light or any
                                other situation match got interrupted at 4 over
                                and later over got reduced. Then events for 1-10
                                is valid rest all will be voided
                              </div>
                              <div className="rule-text">
                                Bowler Session: Bowler session advance events
                                only valid for 1st inning. This event is valid
                                only if the bowler has completed his maximum
                                quota of overs, else the same will be voided.
                                However if the match has resulted and the
                                particular bowler has already started bowling
                                his final over then result will be given even if
                                he haven't completed the over. For example B
                                Kumar is bowling his final over and at 3.4 the
                                match has resulted then result will be given for
                                B Kumar over runs
                              </div>
                              <div className="rule-text">
                                Incase of DLS, the over got reduced then the
                                bowler who has already bowled his maximum quota
                                of over that result will be considered as valid
                                and the rest will be voided
                              </div>
                              <div className="rule-text text-danger">
                                Dot ball Event:
                              </div>
                              <div className="rule-text">
                                Only No run will count as dot ball.
                              </div>
                              <div className="rule-text">
                                If wicket means that will not count as dot ball.
                              </div>
                              <div className="rule-text text-danger">
                                Most Dot balls By a Bowler Event:
                              </div>
                              <div className="rule-text">
                                Leg bye run and wickets considered as
                                Dot&nbsp;ball&nbsp;in&nbsp;bowler
                              </div>
                              <div className="rule-text text-danger">
                                Boundary on Match 1st Free hit
                              </div>
                              <div className="rule-text">
                                Both innings are valid
                              </div>
                              <div className="rule-text">
                                Boundary hit on Free hit only be considered as
                                valid
                              </div>
                              <div className="rule-text">
                                Bets will be deleted if there is no Free hit in
                                the mentioned match
                              </div>
                              <div className="rule-text">
                                Boundary by bat will be considered as valid
                              </div>
                              <div className="rule-text text-danger">
                                Boundaries by Player
                              </div>
                              <div className="rule-text">
                                Both Four and six are valid
                              </div>
                              <div className="rule-text text-danger">
                                No Boundaries Event:
                              </div>
                              <div className="rule-text">
                                Both Four and Six are valid
                              </div>
                              <div className="rule-text">
                                Batsman bat boundaries only considered as valid
                              </div>
                              <div className="rule-text">
                                Free hit boundaries also valid
                              </div>
                              <div className="rule-text">
                                Bets will be voided if that particular ball not
                                completed
                              </div>
                              <div className="rule-text">
                                Result will be given 0 or 4 (No or Yes). For
                                Example batsman hit boundary in particular ball
                                means Result is 0 otherwise Result is 4.
                              </div>
                              <div className="rule-text text-danger">
                                Two boundaries bhav in Single over:
                              </div>
                              <div className="rule-text">
                                Both Four and Six are valid
                              </div>
                              <div className="rule-text">
                                Batsman bat boundaries only considered as valid
                              </div>
                              <div className="rule-text">
                                Free hit boundaries also valid
                              </div>
                              <div className="rule-text">
                                Incomplete over bets will be deleted. Incase Two
                                boundaries hit before over completed then valid.
                              </div>
                              <div className="rule-text">
                                Result will be given 2 or 0 (Yes or No). For
                                Example batsman hits two boundaries in
                                particular over Result is 2 otherwise Result is
                                0.
                              </div>
                              <div className="rule-text text-danger">
                                Bowler Session:
                              </div>
                              <div className="rule-text">
                                The mentioned bowler has to complete the defined
                                number of overs, else the bets related to that
                                particular event will get void. For example if
                                the mentioned bowler has bowled 8 overs, then 5
                                over run of that particular bowler will be
                                considered as valid and the 10 over run will get
                                void.
                              </div>
                              <div className="rule-text">
                                Wide &amp; No ball runs will be counted in
                                bowler Session.
                              </div>
                              <div className="rule-text">
                                Byes &amp; Leg byes runs will not be counted in
                                bowler Session.
                              </div>
                              <div className="rule-text text-danger">
                                Inning Run Bhav Event :
                              </div>
                              <div className="rule-text">
                                Inning run bhav bets are valid if over reduced
                                due to rain or weather condition or match
                                abandoned the result will be given as per
                                official result.
                              </div>
                              <div className="rule-text">
                                Settlement occurs once the stipulated conditions
                                are met, which involves either completion of the
                                allotted overs or the batting team's dismissal,
                                including weather disturbances.
                              </div>
                              <div className="rule-text">
                                In the event of a weather-shortened match, all
                                Bhav Bets placed in the Inning Run Bhav market
                                will be settled according to the official
                                result. For limited overs matches, this includes
                                results determined by the Duckworth Lewis
                                method.
                              </div>
                              <div className="rule-text">
                                In case of pitch vandalism, player safety
                                concerns, stadium damage, acts of terrorism, or
                                acts of God, the company holds the authority to
                                nullify all bets, with the exception of those
                                related to markets that have already been
                                conclusively settled.
                              </div>
                              <div className="rule-text">
                                Bets made during instances of incorrect
                                scorecard updates, inaccurate commentary, delays
                                in suspending the Bhav Bets of Total Innings
                                Runs market, or erroneous updates of rates and
                                odds for Bhav Bets in Total Innings Runs will be
                                removed and deleted from user accounts.
                              </div>
                              <div className="rule-text">
                                Ex: 1st inning run bhav(ENG v AUS),2nd Inning
                                run bhav(ENG v AUS) - England vs Australia T20
                                Match
                              </div>
                              <div className="rule-text text-danger">
                                Power Surge Rule in Big Bash
                              </div>
                              <div className="rule-text">
                                Power Play First Four Overs + Power Surge Two
                                Overs-Batters Choice
                              </div>
                              <div className="rule-text">
                                The batting side chooses when to take control
                                with the addition of the Power Surge.
                              </div>
                              <div className="rule-text">
                                There’s still a four-over power play at the
                                start of the innings, but now the batting team
                                can take the other two Power Surge overs any
                                time from the 11th over onwards.
                              </div>
                              <div className="rule-text text-danger">
                                Total Match - Events (Test):-
                              </div>
                              <div className="rule-text text-danger">
                                Total Runs in Match:
                              </div>
                              <div className="rule-text">
                                1. This market is based on how many runs will be
                                scored in the match across both team’s innings
                                combined.
                              </div>
                              <div className="rule-text">
                                2. Penalty runs will be counted.
                              </div>
                              <div className="rule-text">
                                3. Total Runs in Match, bets will be voided if
                                over reduced in 1st inning or 2nd inning due to
                                weather condition.
                              </div>
                              <div className="rule-text">
                                4. The following number of over’s must be bowled
                                otherwise all bets are void. T20-40 over’s /
                                Odi-100 over’s, if team gets all out before the
                                defined number of over’s then valid.
                              </div>
                              <div className="rule-text">
                                5. In case match shortened due to weather
                                condition, a new event will be start of the
                                allotted over’s announced.
                              </div>
                              <div className="rule-text">
                                Total runs: This market is based on how many
                                runs will be scored in the match across both
                                team's innings combined.
                              </div>
                              <div className="rule-text">
                                Total Over’s: This market is based on how many
                                over’s will be played in the match across both
                                team's innings combined. (If an Inning completed
                                in 83.4 over’s then that calculated as 84 over)
                              </div>
                              <div className="rule-text">
                                Total Bowlers Giving 100 runs: Number of Bowlers
                                Giving 100 runs and above per innings. Both
                                innings will be counted.
                              </div>
                              <div className="rule-text text-danger">
                                Any query regarding result or rate has to be
                                contacted within 7 days from the event; query
                                after 7 days from the event will not be
                                considered as valid
                              </div>
                              <div className="rule-text text-danger">
                                Women's Big Bash League
                              </div>
                              <div className="rule-text text-danger">
                                If WBBL fixture of 43 matches gets reduced due
                                to any reason, then all the special fancies will
                                be voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text text-danger">
                                Management decision will be final
                              </div>
                              <div className="rule-text">
                                1. Highest innings run - Only First innings is
                                valid
                              </div>
                              <div className="rule-text">
                                2. Highest Partnership Run: Both Innings are
                                valid
                              </div>
                              <div className="rule-text">
                                3. Highest Run Scorer Runs: Total Runs Scored by
                                An Individual Batsman in Full Tournament. (WBBL
                                Golden Bat).
                              </div>
                              <div className="rule-text">
                                4. Total 4's: Average 30 Fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                5. Total 6's: Average 5 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                6. Total Boundaries: Average 35 Boundaries will
                                be given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                7. Total 30's: Average 2 Thirties will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                8. Total 50's: Average 1 Fifties will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                9. Total Wickets - Average will 13 Wickets be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                10. Total Wides - Average 9 Wides will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                11. Total No balls:- Average 1 No ball will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                12. Total Extras - Average 16 Extras will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                13. Total Caught outs: Average 8 Caught out will
                                be given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                14. Total Bowled:- Average 2 Bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                15. Total LBW:- Average 1 LBW will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                16. Total Run out:- Average 1 Run out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                17. Total Duckouts : Average 1 Duckout will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                18. Total Single Digit Scorers : Average 7
                                Single Digit Scorers will be given in case match
                                abandoned or over reduced. Duck outs Not
                                Considered in this Event. If Not out
                                Batsman/Injured Batsman facing One Legal
                                Delivery and nothing scored ('0') means
                                Considered as Single Digit
                              </div>
                              <div className="rule-text">
                                19. Total Double Digit Scorers: Average 8 Double
                                Digit Scorers will be given in case match
                                abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                20. Total of Impact Overs : Average 10 Impact
                                Overs will be given in case match abandoned or
                                over reduced. Number of over’s scored 10 runs
                                and above. If a team all out or Match Resulted
                                in 15.1 then considered as 16 over.
                              </div>
                              <div className="rule-text">
                                21. Total 50+ Partnerships - Average 2 Fifty
                                plus Partnerships will be given in case match
                                abandoned or over reduced. 50 and 50 Above
                                Partnerships All Counted in this.
                              </div>
                              <div className="rule-text">
                                22. Highest 1st 6 over run: Both Innings are
                                Valid.Will not consider if over reduce before
                                completion&nbsp;6 over.
                              </div>
                              <div className="rule-text">
                                23. Highest 1st 10 over run : Both Innings are
                                Valid.Will not consider if over reduce before
                                completion&nbsp;10 over.
                              </div>
                              <div className="rule-text">
                                24. Highest
                                4s,6s,30s,50s,Wickets,Wides,Extras,Caught
                                Outs,Bowled,Lbw, Runouts, Duckouts,Single Digit
                                Scorers,Double Digit Scorers, 50+ Pships and
                                Imapact Overs in individual match: All Both
                                innings are Counted.
                              </div>
                              <div className="rule-text">
                                25. Highest Scoring Over Runs : Maximum Runs
                                Scored in any Single Over in Full Tournament.
                              </div>
                              <div className="rule-text">
                                26. Most 4s,6s,Boundaries,30s,50s,Wides,
                                Extras,Caught Outs,Bowled,Duckouts and Impact
                                Overs in an Innings Of the Match : Considered
                                For Any Innings.All Both Innings Considered as
                                Valid
                              </div>
                              <div className="rule-text">
                                27. Most 4's by individual batsman in a Match :
                                Maximum 4s Hitted by an Individual Batsman in
                                any Single Match
                              </div>
                              <div className="rule-text">
                                28. Most 6's by individual batsman in a Match :
                                Maximum 6s Hitted by an Individual Batsman in
                                any Single Match
                              </div>
                              <div className="rule-text">
                                29. Most Balls Faced By a Batsman : Maximum
                                balls Faced by an Individual Batsman in the
                                Single Match.
                              </div>
                              <div className="rule-text">
                                30. Most runs given by Bowler in an Inning :
                                Maximum Runs conceded by a individual Bowler in
                                an Innings.
                              </div>
                              <div className="rule-text">
                                31. Most wickets by Bowler in an inning :
                                Maximum Wickets taken by a individual Bowler in
                                an Innings
                              </div>
                              <div className="rule-text">
                                32. "If the match starts as a 20 Over game,
                                after the balls are reduced due to rain
                                interrupting means comparison Events like
                                Highest 4s,6s, boundaries,30s,50s,
                                Wickets,Wides,Extras,Caughtouts,Bowled,Lbw,Runout,Duckout,Single
                                Digit Scorers, Double Digit Scorers and Most
                                4s,6s,boundaries,30s,50s, Caught
                                outs,Bowled,Duckout, wicket Keeper Dismissals
                                all are considered&nbsp;for&nbsp;Result. Example
                                : If a match started as 20 Overs game after rain
                                Overs reduced to 16 Overs match, in that match
                                Maximum 6s reached means that Value considered
                                for Result of Highest 6s in
                                Individual&nbsp;Match."
                              </div>
                              <div className="rule-text">
                                33. "Due to Rain match started as Overs reduced
                                match all the comparison Events not considered
                                for Result. Example: Due to Rain match only 8
                                Overs both side Means Maximum Single Digit
                                Scorers reached maximum in that match means Not
                                considered&nbsp;for&nbsp;Result."
                              </div>
                              <div className="rule-text">
                                34. Super over will not be included.
                              </div>
                              <div className="rule-text">
                                35. Lowest innings run (1st Inn) - Only First
                                innings is valid. 1st Inning playing team must
                                be Played 20 Overs or If team get all out means
                                Only considered.
                              </div>
                              <div className="rule-text">
                                36. Lowest innings run (Both Inn) - Both
                                innings&nbsp;are&nbsp;valid.
                              </div>
                              <div className="rule-text text-danger">
                                World Cup:-
                              </div>
                              <div className="rule-text text-danger">
                                In case of any circumstances, management
                                decision will be final for all the fancies under
                                world cup.
                              </div>
                              <div className="rule-text text-danger">
                                WC:-WORLD CUP
                              </div>
                              <div className="rule-text text-danger">
                                MOM:-MAN OF THE MATCH.
                              </div>
                              <div className="rule-text text-danger">
                                If World Cup fixture of 48 matches gets reduced
                                due to any reason, then all the special fancies
                                will be voided (Match abandoned due to rain/bad
                                light will not be considered in this)
                              </div>
                              <div className="rule-text text-danger">
                                Super over will not be included
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text">
                                Total Match 1st over runs : Average 4 runs will
                                be given in case match abandoned or over reduced
                                (Only First Innings is Valid)
                              </div>
                              <div className="rule-text">
                                Total Match 1st over Dot Ball : Average 4 runs
                                will be given in case match abandoned or over
                                reduced (Only First Innings is Valid)
                              </div>
                              <div className="rule-text">
                                Total Match 1st 10 over run:- Average 50 runs
                                will be given in case match abandoned or over
                                reduced (Only First Innings is Valid)
                              </div>
                              <div className="rule-text">
                                Total fours: Average 45 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total sixes: Average 11 sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 15 Wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wides - Average 16 Wides will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total No balls:- Average 2 No ball will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 26 extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Caught outs: Average 9 caught out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Bowled:- Average 3 Bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total LBW:- Average 2 LBW will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run out:- Average 1 Run out will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Fifties - Average 3 fifties will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 100s - Average 1 Hundred will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Ducks - Average 1 Duck out will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Maidens - Average 4 Maidens will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 50+ Partnerships - Average 3 Fifty plus
                                Partnerships will be given in case match
                                abandoned or over reduced. 50 and 50 Above
                                Partnerships All Counted in this.
                              </div>
                              <div className="rule-text">
                                Highest 1st over run in individual match: Only
                                First Innings is Valid
                              </div>
                              <div className="rule-text">
                                Highest 1st 10 over run in individual match:
                                Only First Innings is Valid
                              </div>
                              <div className="rule-text">
                                Highest Fours in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Sixes in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Wicket in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Extras in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Scoring runs in Over: Both innings are
                                valid
                              </div>
                              <div className="rule-text">
                                Highest Run Scorer : Total Runs Scored by An
                                Individual Batsman in Full Tournament
                              </div>
                              <div className="rule-text">
                                Highest Wicket Taker : Total Wickets Taken by a
                                Bowler in Full Tournament
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman in the Match :
                                Maximum Balls Faced by an Individual Batsman in
                                any Single Match
                              </div>
                              <div className="rule-text">
                                Most 4s by a Batsman in the Match : Maximum 4s
                                Hitted by an Individual Batsman in any Single
                                Match
                              </div>
                              <div className="rule-text">
                                Most 6s by a Batsman in the Match : Maximum 6s
                                Hitted by an Individual Batsman in any Single
                                Match
                              </div>
                              <div className="rule-text">
                                Most Boundaries Given by a Bowler : Maximum
                                Boundaries Given by an Individual Bowler in his
                                Quota of any Single Match
                              </div>
                              <div className="rule-text">
                                Most Runs Given by a Bowler in the Match :
                                Maximum Runs Given by an Individual Bowler in
                                his Quota of any Single Match
                              </div>
                              <div className="rule-text">
                                Most Dotballs By a Bowler in the Match : Maximum
                                Dotballs Bowled by an Individual Bowler in his
                                Quota of any Single Match
                              </div>
                              <div className="rule-text">
                                Most Wides Given by a Bowler in the Match :
                                Maximum Wides Given by an Individual Bowler in
                                his Quota of any Single Match
                              </div>
                              <div className="rule-text">
                                Most Wickets by a Bowler in the Match : Maximum
                                Wickets Given by an Individual Bowler in his
                                Quota of any Single Match
                              </div>
                              <div className="rule-text text-danger">
                                Special Events:
                              </div>
                              <div className="rule-text text-danger">
                                Pakistan Super League (PSL)
                              </div>
                              <div className="rule-text text-danger">
                                If PSL fixture of 34 matches gets reduced due to
                                any reason, then all the special fancies will be
                                voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text">
                                Total Matches 1st over runs : Average 6 runs
                                will be given in case match abandoned or over
                                reduced (only 1st innings valid)
                              </div>
                              <div className="rule-text">
                                Total Matches 1st 6 over runs : Average 50 runs
                                will be given in case match abandoned or over
                                reduced (Only 1st Innings valid)
                              </div>
                              <div className="rule-text">
                                Total fours: Average 32 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total sixes: Average 13 sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 30's: Average 2 Thirties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Fifties - Average 2 Fifties will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 13 Wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wides - Average 11 Wides will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 18 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Caught outs: Average 8 Caught out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Bowled:- Average 2 Bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total LBW:- Average 1 LBW will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run out:- Average 1 Run out will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text">
                                Highest innings run - Both innings are valid
                              </div>
                              <div className="rule-text">
                                Lowest innings run - Only first innings is valid
                              </div>
                              <div className="rule-text">
                                Highest Match 1st over runs in the match: Only
                                first innings is valid
                              </div>
                              <div className="rule-text">
                                Highest 1st 6 over runs: - Only first innings is
                                valid
                              </div>
                              <div className="rule-text">
                                Highest 4's in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest 6's in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Wickets in individual match: Both
                                innings are valid
                              </div>
                              <div className="rule-text">
                                Highest Extras in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest over runs: Both innings are valid
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman : Maximum Balls
                                Faced by a batsman in one Innings
                              </div>
                              <div className="rule-text">
                                Most 4's by individual batsman in an Inning :
                                Maximum Number of Fours Hit By A Batsman in one
                                Innings
                              </div>
                              <div className="rule-text">
                                Most 6's by individual batsman in an Inning :
                                Maximum Number of Sixes Hit By A Batsman in one
                                Innings
                              </div>
                              <div className="rule-text">
                                Most Dot balls By a Bowler in an Inning :
                                Maximum Dot balls Bowled by a Bowler in his
                                Quota of Innings
                              </div>
                              <div className="rule-text">
                                Most runs given by Bowler in an Inning : Maximum
                                Runs conceded by a individual Bowler in an
                                Innings
                              </div>
                              <div className="rule-text">
                                Most wickets by Bowler in an inning : Maximum
                                Wickets taken by a individual Bowler in an
                                Innings
                              </div>
                              <div className="rule-text">
                                Total 50 Plus Partnership runs- 50 and above 50
                                runs partnership will be counted in this event.
                              </div>
                              <div className="rule-text">
                                In fastest fifty always the first 50 runs will
                                be considered, for example of R Sharma scores
                                1st fifty in 17 balls and scores 100 in next 14
                                balls, fastest 50 will be given based on the
                                balls for the 1st fifty runs
                              </div>
                              <div className="rule-text">
                                Super over will not be included
                              </div>
                              <div className="rule-text text-danger">
                                Women's Premier League (WPL)
                              </div>
                              <div className="rule-text text-danger">
                                If WPL fixture of 22 matches gets reduced due to
                                any reason, then all the special fancies will be
                                voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text">
                                Total matches 1st over runs : Average 5 runs
                                will be given in case match abandoned or over
                                reduced (only 1st innings valid)
                              </div>
                              <div className="rule-text">
                                Total matches 1st 6 over runs:- Average 40 runs
                                will be given in case match abandoned or over
                                reduced (Only 1st Innings valid)
                              </div>
                              <div className="rule-text">
                                Total 4's : Average 32 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 30's: Average 2 sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 50's - Average 1 fifties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average will 12 Wickets be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text">
                                Highest innings run - Both innings are valid
                              </div>
                              <div className="rule-text">
                                Lowest innings run - Only first innings is valid
                              </div>
                              <div className="rule-text">
                                Highest Match 1st over runs in the match: Only
                                first innings is valid
                              </div>
                              <div className="rule-text">
                                Highest 1st 6 over runs: - Only first innings is
                                valid
                              </div>
                              <div className="rule-text">
                                Highest 4's in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Wickets in individual match: Both
                                innings are valid
                              </div>
                              <div className="rule-text">
                                Highest over runs: Both innings are valid
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman : Maximum Balls
                                Faced by a batsman in one Innings
                              </div>
                              <div className="rule-text">
                                Most 4's by individual batsman in an Inning :
                                Maximum Number of Fours Hit By A Batsman in one
                                Innings
                              </div>
                              <div className="rule-text">
                                Most Dot balls By a Bowler in an Inning :
                                Maximum Dot balls Bowled by a Bowler in his
                                Quota of Innings
                              </div>
                              <div className="rule-text">
                                Most runs given by Bowler in an Inning : Maximum
                                Runs conceded by a individual Bowler in an
                                Innings
                              </div>
                              <div className="rule-text">
                                Most wickets by Bowler in an inning : Maximum
                                Wickets taken by a individual Bowler in an
                                Innings
                              </div>
                              <div className="rule-text">
                                In fastest fifty always the first 50 runs will
                                be considered, for example of S Mandhana scores
                                1st fifty in 17 balls and scores 100 in next 14
                                balls, fastest 50 will be given based on the
                                balls for the 1st fifty runs
                              </div>
                              <div className="rule-text">
                                Super over will not be included
                              </div>
                              <div className="rule-text text-danger">
                                Ashes Special 2025-2026
                              </div>
                              <div className="rule-text text-danger">
                                If Ashes fixture of 5 Matches gets Reduced Due
                                to Any Reason, Then all the Special Fancies will
                                be Voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text text-danger">
                                Management decision will be final
                              </div>
                              <div className="rule-text">
                                Total 1st Over Runs of Ashes: Total of All Five
                                Match 1st Over Runs will be Counted in this
                                Event. Match 1st Innings Only Valid. If Aus
                                First Batting Start Means Aus 1st Over Only
                                Considered. In Case Match Abandoned Means 3 Runs
                                Average will be Given.
                              </div>
                              <div className="rule-text">
                                Total 1st 5 Over Runs of Ashes: Total of All
                                Five Match 1st 5 Over Runs will be Counted in
                                this Event. Match 1st Innings Only Valid. If Aus
                                First Batting Start Means Aus 1st 5 Over Only
                                Considered. In Case Match Abandoned Means 17
                                Runs Average will be Given.
                              </div>
                              <div className="rule-text">
                                Total 1st 10 Over Runs of Ashes : Total of All
                                Five Match 1st 10 Over Runs will be Counted in
                                this Event. Match 1st Innings Only Valid. If Aus
                                First Batting Start Means Aus 1st 10 Over Only
                                Considered. In Case Match Abandoned Means 35
                                Runs Average will be Given.
                              </div>
                              <div className="rule-text">
                                Highest Single Innings Score of Ashes: Maximum
                                Runs Scored by any Team in their any Single
                                Innings
                              </div>
                              <div className="rule-text">
                                Highest Total Runs of Ashes: Maximum Runs Scored
                                in any Single Match of Series. All Innings
                                Counted.
                              </div>
                              <div className="rule-text">
                                High Partnership Runs of Ashes: Highest
                                Partnership Runs Scored by Players in any
                                Innings
                              </div>
                              <div className="rule-text">
                                High Partnership Balls of Ashes: Highest
                                Partnership Balls Faced by Players in any
                                Innings
                              </div>
                              <div className="rule-text">
                                Top Batsman Runs in an Inn of Ashes: Maximum
                                Runs Scored by a Batsman in Single Innings
                              </div>
                              <div className="rule-text">
                                Highest Run Scorer Runs of Ashes: Maximum Runs
                                Scored by Any Individual Batsman in Full
                                Tournament
                              </div>
                              <div className="rule-text">
                                Highest Wicket Taker Wickets of Ashes: Maximum
                                Wickets Taken by Any Individual Bowler in Full
                                Tournament
                              </div>
                              <div className="rule-text text-danger">
                                Events Based in Total Counts of Full Match All
                                Valid Only Match will be 300 Overs has been
                                Played with Draw or Match has been won by Any
                                team. Otherwise Mentioned Average will be Given.
                                (Total Events Considered for Full
                                Ashes&nbsp;Tournament)
                              </div>
                              <div className="rule-text">
                                Total 4s of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 115 Fours will be
                                Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Wkts of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 34 Wickets will
                                be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Wides of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 9 Wides will be
                                Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Noballs of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 14 Noballs
                                will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Extras of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 55 Extras will
                                be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Caught Outs of Ashes: In Case Match
                                Abandoned or Draw with Below 300 Over Means 22
                                Caught outs will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Bowled of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 6 Bowled will
                                be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total LBW of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 4 LBW will be
                                Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Runout of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 1 Runout will
                                be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total 30s of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 5 30s will be
                                Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total 50s of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 5 50s will be
                                Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total 100s of Ashes: In Case Match Abandoned or
                                Draw with Below 300 Over Means 2 100s will be
                                Counted as Average. 100 Above all Scores Counted
                                in this.
                              </div>
                              <div className="rule-text">
                                Total 150s of Ashes: 150 above all Score Counted
                                in this
                              </div>
                              <div className="rule-text">
                                Total Maidens of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 55 Maidens
                                will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Duckouts of Ashes: In Case Match Abandoned
                                or Draw with Below 300 Over Means 4 Duckouts
                                will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Single Digit Scorers of Ashes: In Case
                                Match Abandoned or Draw with Below 300 Over
                                Means 12 Single Digit Scorers will be Counted as
                                Average.
                              </div>
                              <div className="rule-text">
                                Total Double Digit Scorers of Ashes: In Case
                                Match Abandoned or Draw with Below 300 Over
                                Means 20 Double Digit Scorers will be Counted as
                                Average.
                              </div>
                              <div className="rule-text">
                                Total Wicketkeeper's Dismissal in Ashes: In Case
                                Match Abandoned or Draw with Below 300 Over
                                Means 8 Wicketkeeper's Dismissal will be Counted
                                as Average.
                              </div>
                              <div className="rule-text">
                                Total Players facing 50plus Balls in Ashes: In
                                Case Match Abandoned or Draw with Below 300 Over
                                Means 13 Players 50plus Balls will be Counted as
                                Average.
                              </div>
                              <div className="rule-text">
                                Total Four Hitters of Ashes: In Case Match
                                Abandoned or Draw with Below 300 Over Means 28
                                Four Hitters will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Wicket Takers of Ashes: In Case Match
                                Abandoned or Draw with Below 300 Over Means 16
                                Wicket Takers will be Counted as Average.
                              </div>
                              <div className="rule-text">
                                Total Bowlers Giving 100 Plus Runs of Ashes: In
                                Case Match Abandoned or Draw with Below 300 Over
                                Means 2 Bowler 100plus run will be Counted as
                                Average.
                              </div>
                              <div className="rule-text">
                                Highest Match 1st Over in a Match of Ashes :
                                Maximum Runs Scored in Match 1st Over. Match 1st
                                Innings Only Valid. If Aus First Batting Start
                                Means Aus 1st Over Only Considered.
                              </div>
                              <div className="rule-text">
                                Highest Match 1st 5 Over in a Match of Ashes :
                                Maximum Runs Scored in Match 1st 5 Over. Match
                                1st Innings Only Valid. If Aus First Batting
                                Start Means Aus 1st 5 Over Only Considered.
                              </div>
                              <div className="rule-text">
                                Highest Match 1st 10 Over in a Match of Ashes :
                                Maximum Runs Scored in Match 1st 10 Over. Match
                                1st Innings Only Valid. If Aus First Batting
                                Start Means Aus 1st 10 Over Only Considered.
                              </div>
                              <div className="rule-text">
                                Highest 4s in Individual Match of Ashes :
                                Maximum Fours Hitted in any Full Test Match. All
                                Innings Fours are Counted
                              </div>
                              <div className="rule-text">
                                Highest Wides in Individual Match of Ashes :
                                Maximum Wides Coming in any Full Test Match. All
                                Innings Wides are Counted
                              </div>
                              <div className="rule-text">
                                Highest Noballs in Individual Match of Ashes :
                                Maximum Noballs coming in any Full Test Match.
                                All Innings Noballs are Counted
                              </div>
                              <div className="rule-text">
                                Highest Extras in Individual Match of Ashes :
                                Maximum Extras Coming in any Full Test Match.
                                All Innings Extras are Counted. Maximum Extras
                                Coming in any Full Test Match. All Innings
                                Extras are Counted
                              </div>
                              <div className="rule-text">
                                Highest Caught Outs in Individual Match of Ashes
                                : Maximum Caught Outs Coming in any Full Test
                                Match. All Innings Caught Outs are Counted
                              </div>
                              <div className="rule-text">
                                Highest Bowled in Individual Match of Ashes :
                                Maximum Bowled Coming in any Full Test Match.
                                All Innings Bowled are Counted
                              </div>
                              <div className="rule-text">
                                Highest LBW in Individual Match of Ashes :
                                Maximum LBW Coming in any Full Test Match. All
                                Innings LBW are Counted
                              </div>
                              <div className="rule-text">
                                Highest Runout in Individual Match of Ashes :
                                Maximum Runout Coming in any Full Test Match.
                                All Innings Runout are Counted
                              </div>
                              <div className="rule-text">
                                Highest 30s in Individual Match of Ashes :
                                Maximum 30s Coming in any Full Test Match. All
                                Innings 30s are Counted
                              </div>
                              <div className="rule-text">
                                Highest 50s in Individual Match of Ashes :
                                Maximum 50s Coming in any Full Test Match. All
                                Innings 50s are Counted
                              </div>
                              <div className="rule-text">
                                Highest 100s in Individual Match of Ashes :
                                Maximum 100s Coming in any Full Test Match. All
                                Innings 100s are Counted
                              </div>
                              <div className="rule-text">
                                Highest Maidens in Individual Match of Ashes :
                                Maximum Maidens Coming in any Full Test Match.
                                All Innings Maidens are Counted
                              </div>
                              <div className="rule-text">
                                Highest Duckouts in Individual Match of Ashes :
                                Maximum Duckouts Coming in any Full Test Match.
                                All Innings Duckouts are Counted
                              </div>
                              <div className="rule-text">
                                Highest Single Digit Scorers in Individual Match
                                of Ashes : Maximum Single Digit Scorers Coming
                                in any Full Test Match. All Innings Single Digit
                                Scorers are Counted
                              </div>
                              <div className="rule-text">
                                Highest Double Digit Scorers in Individual Match
                                of Ashes : Maximum Double Digit Scorers Coming
                                in any Full Test Match. All Innings Double Digit
                                Scorers are Counted
                              </div>
                              <div className="rule-text">
                                Highest Wicketkeeper's Dismissal in Ashes :
                                Maximum Wicketkeeper's Dismissal Coming in any
                                Full Test Match. All Innings Wicketkeeper's
                                Dismissal are Counted. Caught Outs and Stumpings
                                only Considered in this Event.
                              </div>
                              <div className="rule-text">
                                Highest Players facing 50plus Balls in Ashes :
                                Maximum Player Facing 50+ Balls Coming in any
                                Full Test Match. All Innings Player Facing 50+
                                Balls are Counted
                              </div>
                              <div className="rule-text">
                                Highest Four Hitters in Individual Match of
                                Ashes : Maximum Four Hitters Coming in any Full
                                Test Match. All Innings Four Hitters are Counted
                              </div>
                              <div className="rule-text">
                                Highest Wicket Takers in Individual Match of
                                Ashes : Maximum Wicket Takers Coming in any Full
                                Test Match. All Innings Wicket Takers are
                                Counted
                              </div>
                              <div className="rule-text">
                                Highest Bowlers Giving 100 Plus Runs in
                                Individual Match of Ashes : Maximum Bowler
                                Giving 100+ Runs Coming in any Full Test Match.
                                All Innings Bowler Giving 100+ Runs are Counted
                              </div>
                              <div className="rule-text">
                                Highest Scoring Over Runs in Ashes : Maximum
                                Runs Scored in Single Over of any Match
                              </div>
                              <div className="rule-text">
                                Most Balls faced by a Batsman in an Inn of Ashes
                                : Maximum Balls Faced by a Batsman in Single
                                Innings of any Match
                              </div>
                              <div className="rule-text">
                                Most 4s Hitted by a Batsman in Ashes : Maximum
                                4s Hitted by Any Individual Batsman in Full
                                Tournament
                              </div>
                              <div className="rule-text">
                                Most 50s Scored by a Batsman in Ashes : Maximum
                                50s Scored by Any Individual Batsman in Full
                                Tournament
                              </div>
                              <div className="rule-text">
                                Most 4s by a Batsman in Inn of Ashes Maximum
                                Fours Hitted by Any Batsman in Single Innings
                              </div>
                              <div className="rule-text">
                                Most Runs given by a Bowler in an Inn of Ashes :
                                Maximum Runs Conceded by any Bowler in Single
                                Innings
                              </div>
                              <div className="rule-text">
                                Most Wickets Taken by a Bowler in an Inn of
                                Ashes : Maximum Wickets Taken by Any Bowler in
                                Single Innings
                              </div>
                              <div className="rule-text">
                                Most Wickets Taken by a Bowler in a Match of
                                Ashes : Maximum Wickets Taken by Any Bowler in
                                Full Match. Both Innings Wickets Counted.
                              </div>
                              <div className="rule-text text-danger">
                                Indoor Cricket T10 League
                              </div>
                              <div className="rule-text">
                                9 Players squad with 7 players a side Over Arm
                                Box Cricket Championship
                              </div>
                              <div className="rule-text text-danger">
                                Scoring Rules :
                              </div>
                              <div className="rule-text">
                                Hitting the ball in Zone A (the front net, i.e.,
                                the net behind the wicket keeper) won't get you
                                any bonus runs.
                              </div>
                              <div className="rule-text">
                                If the ball hits the net in Zone B (side nets
                                between the striker's end and halfway down the
                                pitch), you get 1 bonus run.
                              </div>
                              <div className="rule-text">
                                If the ball hits the net in Zone C (side nets
                                between the bowler's end and halfway), you score
                                2 bonus runs.
                              </div>
                              <div className="rule-text">
                                Hitting the ball in Zone D (the back net, i.e.,
                                the net behind the bowler) allows you to score 4
                                or 6 bonus runs depending on how the ball hits
                                the back net. If the ball hits the net after
                                bouncing, you get 4 bonus runs. If the ball hits
                                the net without bouncing on the ground, you
                                score 6 bonus runs.
                              </div>
                              <div className="rule-text">
                                If the ball hits Zone B or C onto Zone D, you
                                score 3 bonus runs.
                              </div>
                              <div className="rule-text">
                                Remember that at least one physical run must be
                                taken for any bonus runs to be scored. Whatever
                                bonus runs you get will be added to the physical
                                runs. For example, if you strike the ball into
                                the front net for 1 bonus run and take 2
                                physical runs, you score a total of 3 runs off
                                the ball.
                              </div>
                              <div className="rule-text text-danger">
                                Game Format :
                              </div>
                              <div className="rule-text">
                                10 over a-side innings
                              </div>
                              <div className="rule-text">
                                Power Play for the 1st 3 overs. Only 1 player
                                allowed beyond the Inner box marking. After the
                                end of power play over, only 2 players can be
                                outside the Inner Box.
                              </div>
                              <div className="rule-text">
                                No Ball &amp; Wide balls as per normal
                                cricketing rules.
                              </div>
                              <div className="rule-text">
                                If the ball touches the upper net and if any
                                player catches the ball, the batsman is
                                considered out.
                              </div>
                              <div className="rule-text">
                                If the Ball Touches the Upper Net and lands
                                safely on the field, then the batsman have to
                                take a physical run if they want, if no physical
                                run is taken there will be no runs.
                              </div>
                              <div className="rule-text">
                                Zone A shall concede 0 runs.
                              </div>
                              <div className="rule-text">
                                If the player hits the net after the middle line
                                (Zone C) its 2 bonus runs. (only taken into
                                consideration if the players take a physical
                                run)
                              </div>
                              <div className="rule-text">
                                If the player hits the net before the middle
                                line (Zone B) its 1 bonus run. (only taken into
                                consideration if the players take a physical
                                run)
                              </div>
                              <div className="rule-text">
                                If the ball goes straight to the boundary (Zone
                                D) without a bounce, it’s a SIX.
                              </div>
                              <div className="rule-text">
                                If the ball bounces and goes to the boundary
                                (Zone D) it’s a FOUR
                              </div>
                              <div className="rule-text">
                                If the ball hits the upper net and goes straight
                                to the boundary (Zone D) it’s a 6.
                              </div>
                              <div className="rule-text">
                                If the ball hits the upper net and bounces and
                                goes straight to the boundary (Zone D) it’s a 4.
                              </div>
                              <div className="rule-text">
                                Note: Bonus Runs are only applied if the ball
                                hits or touches the Side Nets of that particular
                                zone (B&amp;C) and taken into consideration if
                                the players take a physical Run.
                              </div>
                              <div className="rule-text">
                                The bowler is not allowed to touch the front
                                line or the side line of the Crease, in case
                                they do so it will be counted as a no ball and 2
                                runs will be given to the batting team and the
                                ball will not be counted.
                              </div>
                              <div className="rule-text">
                                If a bowler bowls a no or a wide ball, the
                                delivery will not be counted and each wide or no
                                ball will be given 2 runs to the batting team
                                total.
                              </div>
                              <div className="rule-text">
                                If the batsman is a right hander and if the ball
                                goes out of the white wide line it will be given
                                as a wide ball &amp; if the ball is going leg
                                side and is inside the Leg Side line the ball is
                                counted.
                              </div>
                              <div className="rule-text">
                                Dismissals in Indoor Cricket are as followed:
                                Bowled, Run Out, Catch Out, Stumping and
                                Handling the Ball.
                              </div>
                              <div className="rule-text">
                                If the bowler is bowling directly above waist
                                and one bounce above shoulder level it is
                                counted as a no ball, but the batter has to play
                                the ball from the crease, in case the batter is
                                outside the crease and plays the ball it will be
                                termed as a good ball.
                              </div>
                              <div className="rule-text">
                                Incomplete action or throwing the ball to the
                                stump will be termed as a no ball and 2 runs
                                will be given to the batting team.
                              </div>
                              <div className="rule-text">
                                If the batsman does not hit the ball after it is
                                bowled it is considered as a Dot Ball, the
                                batsman gets 0 runs.
                              </div>
                              <div className="rule-text">
                                If the batsman hits the ball and the fielders or
                                the wicket-keeper catch it without it touching
                                the floor, the batsman will be dismissed as
                                Catch Out.
                              </div>
                              <div className="rule-text">
                                If the ball touches a fielder and then hits the
                                nets (zones), the bonus runs will be counted, if
                                the physical runs are taken by the batter.
                              </div>
                              <div className="rule-text">
                                No runs for overthrow.
                              </div>
                              <div className="rule-text">
                                If the ball is caught directly after touching
                                the zones (B/C), it will be treated as NOT OUT
                                and bonus runs are applicable if physical run is
                                taken.
                              </div>
                              <div className="rule-text">
                                If the ball touches the bonus run zones and the
                                fielder accomplishes a run out, the batter will
                                be OUT and no bonus runs will be counted.
                                Physical run will be counted if 1 run is taken
                                and run out happens during the second run.
                              </div>
                              <div className="rule-text">
                                When a batter gets out, the next player coming
                                in will take the strike.
                              </div>
                              <div className="rule-text">
                                Run out will ONLY be at the batter’s end.
                              </div>
                              <div className="rule-text">
                                When 6 wickets of a team fall, the last batter
                                will be allowed to bat. The team will send a
                                runner at non-striker’s end. After every
                                physical run taken, the last batsman will have
                                to go back to strike to face the next ball. Run
                                out for the runner will mean dismissal for the
                                last batsman.
                              </div>
                              <div className="rule-text text-danger">
                                The Hundred Men's Special 2025
                              </div>
                              <div className="rule-text">
                                If Hundred fixture of 34 matches gets reduced
                                due to any reason, then all the special fancies
                                will be voided (Match abandoned due to rain/bad
                                light will not be considered in this)
                              </div>
                              <div className="rule-text">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text">
                                Management decision will be final
                              </div>
                              <div className="rule-text">
                                Highest innings run - Only First innings is
                                valid
                              </div>
                              <div className="rule-text">
                                Lowest innings run - Only First innings is
                                valid. 1st Inning playing team must be facing
                                100 balls or If team get all out means
                                considered.
                              </div>
                              <div className="rule-text">
                                Highest Partnership Runs in Hundred: Both
                                Innings are valid
                              </div>
                              <div className="rule-text">
                                Highest Partnership Balls in Hundred: Both
                                Innings are valid
                              </div>
                              <div className="rule-text">
                                Highest Run Scorer : Total Runs Scored by An
                                Individual Batsman in Full Tournament
                              </div>
                              <div className="rule-text">
                                Highest Wicket Taker : Total Wickets Taken by a
                                Bowler in Full Tournament
                              </div>
                              <div className="rule-text">
                                Total 4's: Average 22 Fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 6's: Average 11 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Boundaries: Average 34 Boundaries will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 30's: Average 2 Thirties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 50's: Average 1 Fifties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average will 13 Wickets be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wides - Average 8 Wides will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 17 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Caught outs: Average 8 Caught out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Bowled:- Average 2 Bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total LBW:- Average 1 LBW will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run out:- Average 1 Run out will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Duckouts in Hundred : Average 1 Duckout
                                will be given in case match abandoned or over
                                reduced
                              </div>
                              <div className="rule-text">
                                Total Single Digit Scorers in Hundred : Average
                                6 Single Digit Scorers will be given in case
                                match abandoned or over reduced. Duck outs Not
                                Considered in this Event. If Not out
                                Batsman/Injured Batsman facing One Legal
                                Delivery and nothing scored ('0') means
                                Considered as Single Digit
                              </div>
                              <div className="rule-text">
                                Total Double Digit Scorers in Hundred : Average
                                9 Double Digit Scorers will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Highest
                                4s,6s,Boundaries,30s,50s,Wickets,Wides,Extras,Caught
                                Outs,Bowled,Lbw, Runouts, Duckouts,Single Digit
                                Scorers and Double Digit Scorers in individual
                                match: All Both innings are Counted.
                              </div>
                              <div className="rule-text">
                                Most 4s,6s,Boundaries,30s,50s,Caught
                                Outs,Bowled,Duckouts and Wicketkeeper Dismissals
                                in an Innings Of the Match : Considered For Any
                                Innings.All Both Innings Considered as Valid
                              </div>
                              <div className="rule-text">
                                Most 4s by a Batsman in the Match : Maximum 4s
                                Hitted by an Individual Batsman in any Single
                                Match
                              </div>
                              <div className="rule-text">
                                Most 6s by a Batsman in the Match : Maximum 6s
                                Hitted by an Individual Batsman in any Single
                                Match
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman of Hundred :
                                Maximum balls Faced by an Individual Batsman in
                                the Single Match.
                              </div>
                              <div className="rule-text">
                                Most runs given by Bowler in an Inning of
                                Hundred : Maximum Runs conceded by a individual
                                Bowler in an Innings.
                              </div>
                              <div className="rule-text">
                                Most wickets by Bowler in an inning : Maximum
                                Wickets taken by a individual Bowler in an
                                Innings
                              </div>
                              <div className="rule-text text-danger">
                                "If the match starts as a 100 ball game, after
                                the balls are reduced due to rain interrupting
                                means comparison Events like Highest 4s,6s,
                                boundaries,30s,50s,
                                Wickets,Wides,Extras,Caughtouts,Bowled,Lbw,Runout,Duckout,Single
                                Digit Scorers, Double Digit Scorers and Most
                                4s,6s,boundaries,30s,50s, Caught
                                outs,Bowled,Duckout, wicket Keeper Dismissals
                                all are considered&nbsp;for&nbsp;Result. Example
                                : If a match started as 100 balls game after
                                rain balls reduced to 80 balls match, in that
                                match Maximum 6s reached means that Value
                                considered for Result of Highest 6s in
                                Individual&nbsp;Match."
                              </div>
                              <div className="rule-text text-danger">
                                "Due to Rain match started as Balls reduced
                                match all the comparison Events not considered
                                for Result. Example: Due to Rain match only 30
                                ball both side Means Maximum Single Digit
                                Scorers reached maximum in that match means Not
                                considered&nbsp;for&nbsp;Result."
                              </div>
                              <div className="rule-text text-danger">
                                Super over (Super 5) will not be included.
                              </div>
                              <div className="rule-text">
                                Most Wicket keeper Dismissals in an Inn of
                                Hundred : Number of Dismissal by A Wicket Keeper
                                in any Single Innings. Caught outs and Stumping
                                are only Considering in this Event.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game2"
                                className="collapsed"
                              >
                                fancy1
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game2"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                1. Odd/Even Rules. (W.e.f 5th January 2024)
                              </div>
                              <div className="rule-text">
                                1.3 In case of all out or the target chased
                                down, particular session will be considered as a
                                completed session.
                              </div>
                              <div className="rule-text">
                                For Example : IN ODI - IND got all out at 12.3
                                over then 15 over session will be considered as
                                a completed session or AUS get chase down the
                                target in 12.3 over then 15 over session will be
                                considered as a completed&nbsp;session.
                              </div>
                              <div className="rule-text">
                                IN TEST - IND got all out at 12.3 over then 20
                                over session will be considered as a completed
                                session or AUS get chase down the target in 12.3
                                over then 20 over session will be considered as
                                a completed&nbsp;session.
                              </div>
                              <div className="rule-text">
                                IN T10/T20 - IND got all out at 8.3 over then 9
                                over session will be considered as a completed
                                session or AUS get chase down the target in 8.3
                                over then 9 over session will be considered as a
                                completed&nbsp;session.
                              </div>
                              <div className="rule-text">
                                1.2 All bets regarding Odd/Even sessions will be
                                deleted if the particular session is incomplete.
                              </div>
                              <div className="rule-text">
                                1.1 Advance events will be valid if over reduced
                                before match start. For Ex: - In T20, If over
                                reduced to 16 over so up to 16 over valid
                                remaining over will be deleted.
                              </div>
                              <div className="rule-text">
                                1.5 Innings run Odd/Even session will be valid
                                if over reduced due to weather condition.
                              </div>
                              <div className="rule-text">
                                1.4 All bets regarding to ODD/EVEN
                                player/partnership are valid if one legal
                                delivery is being played, else the bets will be
                                deleted. Player odd/even all advance bets will
                                be valid if one legal delivery is being played
                                in match otherwise voided.
                              </div>
                              <div className="rule-text">
                                1.6 In any circumstances management decision
                                will be final.
                              </div>
                              <div className="rule-text">
                                1.7 Penalty runs will be counted in all Events.
                                (This rule applicable from 20th March 2024)
                              </div>
                              <div className="rule-text text-danger">
                                2 Top batsman rules:-
                              </div>
                              <div className="rule-text text-danger">
                                2.1 If any player does not come as per playing
                                eleven then all bets will be get deleted for the
                                particular player.
                              </div>
                              <div className="rule-text">
                                2.2 two players done the same run in a single
                                match (M Agarwal 30 runs and A Rayudu 30 runs,
                                whole inning top batsmen score also 30 run) then
                                both player settlement to be get done 50 percent
                                (50% , 50%)rate on their original value which
                                given by our exchange.
                              </div>
                              <div className="rule-text">
                                Suppose we have opened value of M Agarwal 3.75
                                back and customer place bets on 10000 @ 3.75
                                rates and A Rayudu 3.0 back and customer place
                                bets on 10000 @ 3.0 rates.
                              </div>
                              <div className="rule-text">
                                Whole inning result announces 30 run by both
                                player then
                              </div>
                              <div className="rule-text text-danger">
                                Rule of top batsman:-if you bet on M Agarwal you
                                will be get half amount of this rate
                                (10000*3.75/2=18750 you will get)
                              </div>
                              <div className="rule-text text-danger">
                                Rule of top batsman:-if you bet on A Rayudu you
                                will be get half amount of this rate
                                (10000*3.00/2=15000 you will get)
                              </div>
                              <div className="rule-text">
                                Top batsman only 1st inning valid.
                              </div>
                              <div className="rule-text">
                                For one day 50 over and for t-20 match 20 over
                                must be played for top batsmen otherwise all
                                bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Man of the Match Rules
                              </div>
                              <div className="rule-text">
                                1. All bets will be deleted in case the match is
                                abandoned or over reduced.
                              </div>
                              <div className="rule-text">
                                2. All bets will be deleted if the mentioned
                                player is not included in playing 11.
                              </div>
                              <div className="rule-text">
                                3. In case Man of the Match is shared between
                                two players then Dead heat rule will be
                                applicable, For example K Perera and T Iqbal
                                shares the Man of the Match, then the settlement
                                will be done 50% of the rates accordingly.
                              </div>
                              <div className="rule-text">
                                4. Rules similar to our Top Batsman rules.
                              </div>
                              <div className="rule-text text-danger">
                                Maximum Sixes by Team
                              </div>
                              <div className="rule-text">
                                1. All bets will be deleted if match abandoned
                                or over reduced
                              </div>
                              <div className="rule-text">
                                2. All bets will be deleted if both the teams
                                hits same number of sixes.
                              </div>
                              <div className="rule-text">
                                3. Super over will not be considered.
                              </div>
                              <div className="rule-text text-danger">
                                Maximum 6 or 10 over runs
                              </div>
                              <div className="rule-text">
                                1. All bets will be deleted if match abandoned
                                or over reduced.
                              </div>
                              <div className="rule-text">
                                2. All the bets will be deleted if both the
                                teams score is same (Runs scored in 6 or 10
                                overs)
                              </div>
                              <div className="rule-text">
                                3. 6 overs for T20 and 10 overs for ODI
                              </div>
                              <div className="rule-text">
                                4. Both the innings are valid.
                              </div>
                              <div className="rule-text">
                                5. This fancy will be valid for 1st 6 overs of
                                both innings for T20 and 1st 10 overs of both
                                innings for ODI
                              </div>
                              <div className="rule-text text-danger">
                                Batsman Match
                              </div>
                              <div className="rule-text">
                                Batsman Match:- Bets for Favourite batsman from
                                the two batsman matched.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if any one of the
                                mentioned player is not included in playing 11.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted unless one ball being
                                played by both the mentioned players.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if over reduced or
                                Match abandoned.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if both the player
                                scored same run. For example H Amla and J
                                Bairstow are the batsman matched, H Amla and J
                                Bairstow both scored 38 runs then all bets will
                                be deleted.
                              </div>
                              <div className="rule-text">
                                Both innings will be valid
                              </div>
                              <div className="rule-text text-danger">
                                Opening Pair
                              </div>
                              <div className="rule-text">
                                1. Bets for Favourite opening pair from the two
                                mentioned opening pair.
                              </div>
                              <div className="rule-text">
                                2. Runs made by both the opening player will be
                                added. For example:- J Roy scored 20 runs and J
                                Bairstow scored 30 runs result will be 50 runs.
                              </div>
                              <div className="rule-text">
                                3. Highest run made by the pair will be declared
                                as winner. For example: Opening pair ENG total
                                is 70 runs and Opening pair SA is 90 runs, then
                                SA 90 runs will be declared as winner.
                              </div>
                              <div className="rule-text">
                                Both innings will be valid
                              </div>
                              <div className="rule-text text-danger">
                                Our exchange Special
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if the mentioned player
                                is not included in playing 11.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if match abandoned or
                                over reduced.
                              </div>
                              <div className="rule-text">
                                Both innings will be valid
                              </div>
                              <div className="rule-text text-danger">
                                Direction of First Boundary
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if the mentioned
                                batsman is not included in playing 11.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if match abandoned or
                                over reduced.
                              </div>
                              <div className="rule-text">
                                The boundary hit through off side of the stump
                                will be considered as off side four.
                              </div>
                              <div className="rule-text">
                                The boundary hit through leg side of the stump
                                will be considered as leg side four.
                              </div>
                              <div className="rule-text">
                                Boundaries through extras (byes,leg
                                byes,wide,overthrow) will not be considered as
                                valid.
                              </div>
                              <div className="rule-text">
                                Only 1st Inning will be considered
                              </div>
                              <div className="rule-text text-danger">
                                Fifty &amp; Century by Batsman
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if match abandoned or
                                over reduced.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted if the mentioned
                                batsman is not included in playing 11.
                              </div>
                              <div className="rule-text">
                                All bets will be deleted unless the batsman
                                faces one legal ball.
                              </div>
                              <div className="rule-text">
                                Both Innings will be valid.
                              </div>
                              <div className="rule-text text-danger">
                                1st over Fancy
                              </div>
                              <div className="rule-text">
                                Boundaries through extras (byes,leg
                                byes,wide,overthrow) will not be considered.
                              </div>
                              <div className="rule-text">
                                Only 1st inning will be valid
                              </div>
                              <div className="rule-text text-danger">
                                Odd Even Fancy
                              </div>
                              <div className="rule-text">
                                Incompleted games will be deleted. Over reduced
                                or abandoned all bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                For example:-275 run SL bhav must be played 50
                                over if rain comes or any condition otherwise
                                275 run SL bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Next Man out
                              </div>
                              <div className="rule-text">
                                Next man out fancy advance &amp; in regular.
                                Both inning will be valid. If any player does
                                not come in opening then all bets will be
                                deleted. If over reduced or abandoned then all
                                bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Caught out
                              </div>
                              <div className="rule-text">
                                Caught out fancy in advance &amp; in regular.
                                Both inning will be valid. If over reduced or
                                match abandoned then all bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Wkt &amp; All out Fancy
                              </div>
                              <div className="rule-text">
                                5 wkt in 10 over &amp; All out in 20 over fancy
                                is valid for both inning. If match abandoned or
                                over reduced all bets will be deleted.
                              </div>
                              <div className="rule-text text-danger">
                                Test Match: Game Completed Fancy
                              </div>
                              <div className="rule-text">
                                1. This is the fancy for match to be won/
                                completed in which day &amp; session (Completed:
                                Game has to be completed)
                              </div>
                              <div className="rule-text">
                                2. If match drawn then all the sessions will be
                                considered as lost.
                              </div>
                              <div className="rule-text text-danger">
                                Meter Fancy
                              </div>
                              <div className="rule-text">
                                In case match abandoned or over reduced mid
                                point rule will be applicable
                              </div>
                              <div className="rule-text">
                                For example: If Dhoni meter is 75 / 77 and the
                                match abandoned or over reduced, then the result
                                will be 76
                              </div>
                              <div className="rule-text">
                                In case of single difference result will be
                                given for the higher rate of the final rate (eg
                                53/54) and match gets abandoned then the result
                                will be given as 54
                              </div>
                              <div className="rule-text">
                                Midpoint rule is applicable for test match also.
                                However for lambi meter/ inning meter 70 overs
                                has to be played only then the same will be
                                considered as valid
                              </div>
                              <div className="rule-text text-danger">
                                Maximum Boundaries:-
                              </div>
                              <div className="rule-text">
                                If the number of fours or sixes of both the team
                                is equal, then all bets of the respective event
                                will get voided
                              </div>
                              <div className="rule-text text-danger">
                                Khado:- Test
                              </div>
                              <div className="rule-text">
                                Minimum 70 over has to be played by the
                                particular team only then the Khado of the team
                                will be considered as valid, else the same will
                                be voided
                              </div>
                              <div className="rule-text text-danger">
                                Lunch Favourite
                              </div>
                              <div className="rule-text text-danger">
                                1. The team which is favourite at lunch will be
                                considered as lunch favourite or the team which
                                is favourite after first inning last ball will
                                be considered as lunch favourite in our
                                exchange.
                              </div>
                              <div className="rule-text text-danger">
                                2. In any circumstances management decision will
                                be final.
                              </div>
                              <div className="rule-text text-danger">
                                3. In case of tie in T20 or one day in lunch
                                favourite game , all bets will be deleted in our
                                exchange.
                              </div>
                              <div className="rule-text text-danger">
                                4. In case overs are reduced in a match, the
                                team which favourite at lunch will be considered
                                as lunch favourite.
                              </div>
                              <div className="rule-text">
                                4.1 For example :- if match is reduced to 18
                                over per side in t20 or Oneday then after 18
                                over the team which is favourite at lunch will
                                be considered as lunch favourite.
                              </div>
                              <div className="rule-text text-danger">
                                5. In case of weather, 1st innings match overs
                                are reduced and direct target is given to team
                                which will bat in 2nd inning then lunch
                                favourite will be considered after target is
                                given at lunch.
                              </div>
                              <div className="rule-text">
                                5.1 For example :- in T20 match rain comes at 14
                                over and match is interrupted due to rain and
                                direct target is given to 2nd batting team, then
                                team which is favourite in match odds after
                                target is given in match, will be considered as
                                lunch favourite.
                              </div>
                              <div className="rule-text text-danger">
                                Common Market:-
                              </div>
                              <div className="rule-text">
                                In future, due to any circumstances if any
                                Match/Series/League is postponed or rescheduled
                                to another date, all related bets will be
                                voided.
                              </div>
                              <div className="rule-text">
                                Due to any reasons company has rights to take
                                final decisions.
                              </div>
                              <div className="rule-text text-danger">
                                Hundred Men's
                              </div>
                              <div className="rule-text">
                                5 Consecutive Sixes in 5 Balls Given by a Bowler
                                : Any Single Bowler Conceding 5 Consecutive
                                Sixes in his 5 Consecutive Balls If 10 Balls
                                Consecutively putting means Any 5 Balls Receive
                                Consecutively 5 Sixes Received Means Considered
                                as valid.
                              </div>
                              <div className="rule-text">
                                Example : 41 to 45 Balls Narine Concede 5 Sixes
                                means considered as Result. 41 to 50 Narine Over
                                43 to 47 Balls Concede 5 Sixes Means Valid
                              </div>
                              <div className="rule-text">
                                5 Consecutive Fours in 5 Balls Given by a Bowler
                                : Any Single Bowler Conceding 5 Consecutive
                                Fours in his 5 Consecutive Balls.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game3"
                                className="collapsed"
                              >
                                cricket casino
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game3"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                1. Completed game is valid , In case match
                                abandoned due to rain particular game will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                1.2 If a team got all out in 17 over although
                                Innings Lambi run valid. (w.e.f. 15th June 2024)
                              </div>
                              <div className="rule-text">
                                1.3 In case of all out or the target chased
                                down, particular session will be considered as a
                                completed session (For Example : IND got all out
                                at 12.3 over then 15 over session will be
                                considered as a completed session or AUS get
                                chase down the target in 12.3 over then 15 over
                                session will be considered as a
                                completed&nbsp;session)
                              </div>
                              <div className="rule-text">
                                1.1 If over are reduced to 17 over instead of 20
                                due to rain or weather conditions, Innings Lambi
                                run valid. (w.e.f. 15th June 2024)
                              </div>
                              <div className="rule-text text-danger">
                                2. Penalty runs will be counted in our exchange.
                                (This rule applicable from 15th June 2024)
                              </div>
                              <div className="rule-text text-danger">
                                3. In any circumstances management decision will
                                be final.
                              </div>
                              <div className="rule-text text-danger">
                                4. The last digit of run in all game will be
                                valid in our exchange.
                              </div>
                              <div className="rule-text text-danger">
                                5. Single last digit game :-
                              </div>
                              <div className="rule-text">
                                5.1 For example:- 6 over run Ind : 47 run , so
                                the result will be given as 7 for single last
                                digit game in our exchange.
                              </div>
                              <div className="rule-text text-danger">
                                6. Double last digit game :-
                              </div>
                              <div className="rule-text">
                                6.1 For example:- 6 over run &amp; 10 over run
                                Ind : 45 run &amp; 83 run respectively , so the
                                result will be given as 53 for double last digit
                                game in our exchange.
                              </div>
                              <div className="rule-text text-danger">
                                7. Triple last digit game :-
                              </div>
                              <div className="rule-text">
                                7.1 For example:- 6 over run, 10 over run &amp;
                                15 over run Ind : 43 run ,80 run and 125
                                respectively so the result will be given as 305
                                for triple last digit game in our exchange.
                              </div>
                              <div className="rule-text">
                                7.2 For example:- 6 over run, 10 over run &amp;
                                Lambi run Ind : 43 run ,80 run and 187
                                respectively so the result will be given as 307
                                for triple last digit game in our exchange.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game4"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game4"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Indian Premier League (IPL)
                              </div>
                              <div className="rule-text text-danger">
                                If IPL fixture of 74 matches gets reduced due to
                                any reason, then all the special fancies will be
                                voided (Match abandoned due to rain/bad light
                                will not be considered in this)
                              </div>
                              <div className="rule-text text-danger">
                                At any situation if result is given for any
                                particular event based on the rates given for
                                the same, then the particular result will be
                                considered valid, similarly if the tournament
                                gets canceled due to any reason the previously
                                given result will be considered valid
                              </div>
                              <div className="rule-text text-danger">
                                Management decision will be final
                              </div>
                              <div className="rule-text">
                                Highest innings run - Only First innings is
                                valid
                              </div>
                              <div className="rule-text">
                                Lowest innings run - Only First innings is
                                valid. 1st Inning playing team must be facing 20
                                overs or If team get all out means considered.
                              </div>
                              <div className="rule-text">
                                Highest Partnership Runs in IPL: Both Innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Run Scorer : Total Runs Scored by An
                                Individual Batsman in Full Tournament
                              </div>
                              <div className="rule-text">
                                Highest Wicket Taker : Total Wickets Taken by a
                                Bowler in Full Tournament
                              </div>
                              <div className="rule-text">
                                How Many time 5 or More Wickets taken by Bowlers
                                : Number of time 5 or More Wickets taken by
                                Bowlers. In Case Same Bowler 2 time 5 or More
                                Wickets taken means Result Counted as 2.
                              </div>
                              <div className="rule-text">
                                Total 4's: Average 29 Fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 6's: Average 16 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 30's: Average 2 Thirties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 50's: Average 2 Fifties will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total No balls:- Average 1 No ball will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average will 12 Wickets be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wides - Average 11 Wides will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 18 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Caught outs: Average 9 Caught out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Bowled:- Average 2 Bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total LBW:- Average 1 LBW will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run out:- Average 1 Run out will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Duckouts in IPL : Average 1 Duckout will
                                be given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 50+ Partnerships - Average 2 Fifty plus
                                Partnerships will be given in case match
                                abandoned or over reduced. 50 and 50 Above
                                Partnerships All Counted in this.
                              </div>
                              <div className="rule-text">
                                Total Highest Scoring Over Runs in IPL: Total of
                                Every Match Highest Scoring Over Runs. Average
                                20 Runs will be given in case match abandoned or
                                over reduced.
                              </div>
                              <div className="rule-text">
                                Total Runs Scored in IPL : Total Runs Scored in
                                Full Tournament. Average 350 Runs will be
                                Counted in case match abandoned or over reduced.
                                Both Innings Counted.
                              </div>
                              <div className="rule-text">
                                Highest Match 1st Over Run of IPL :Only First
                                Innings is Valid.
                              </div>
                              <div className="rule-text">
                                Highest 1st 6 over run: Only First Innings is
                                Valid. Will not consider if over reduce before
                                completion&nbsp;6 over.
                              </div>
                              <div className="rule-text">
                                Highest 1st 10 over run : Only First Innings is
                                Valid. Will not consider if over reduce before
                                completion&nbsp;10 over.
                              </div>
                              <div className="rule-text">
                                Highest 4s,6s,30s,50s Single Digit Scorers,
                                Double Digit Scorers,Wickets,Caught
                                Outs,Bowled,Lbw, Runouts, Stumpings,
                                Duckouts,Wides and Extras in individual match:
                                All Both innings are Counted.
                              </div>
                              <div className="rule-text">
                                Highest Scoring Over Runs in IPL: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Single Digit Scorers : Duck outs Not Considered
                                in this Event. If Not out Batsman/Injured
                                Batsman facing One Legal Delivery and nothing
                                scored ('0') means Considered as Single Digit
                              </div>
                              <div className="rule-text">
                                Most 6's by individual batsman of IPL : Maximum
                                Number of Sixes Hit By A Batsman in full
                                Tournament. Ex. Last Season (2021) KL Rahul Hit
                                30 Sixes in 13 Matches. So, 30 was the Result
                                for last season.
                              </div>
                              <div className="rule-text">
                                Most Balls Faced By a Batsman of IPL : Maximum
                                balls Faced by an Individual Batsman in the
                                Single Match.
                              </div>
                              <div className="rule-text">
                                Most runs given by Bowler in an Inning of IPL :
                                Maximum Runs conceded by a individual Bowler in
                                an Innings.
                              </div>
                              <div className="rule-text">
                                Most Wide, Noball,Extras,4s,6s,30s,50s,50+
                                Pships,Caught Outs,LBWs, Runouts and Duckouts in
                                an Innings Of the Match : Considered For Any
                                Innings.All Both Innings Considered as Valid
                              </div>
                              <div className="rule-text">
                                In fastest fifty always the first 50 runs will
                                be considered, for example of R Sharma scores
                                1st fifty in 17 balls and scores 100 in next 14
                                balls, fastest 50 will be given based on the
                                balls for the 1st fifty runs
                              </div>
                              <div className="rule-text">
                                If a match started to 20 over and later over
                                reduced due to weather condition then all the
                                comparison events will be considered.
                              </div>
                              <div className="rule-text">
                                If over reduced to before match start due to
                                weather condition then all the comparison events
                                will not be considered.
                              </div>
                              <div className="rule-text text-danger">
                                Super over will not be included.
                              </div>
                              <div className="rule-text text-danger">
                                Big Bash League
                              </div>
                              <div className="rule-text">
                                Total match 1st over run:- Average 6 runs will
                                be given if total 20 overs is not played, only
                                1st innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Highest innings run - Only first innings is
                                valid
                              </div>
                              <div className="rule-text">
                                Lowest innings run - Only first innings is valid
                              </div>
                              <div className="rule-text">
                                Total 1st 6 over run:- Average 46 runs will be
                                given if total 20 overs is not played, This
                                event is valid only for the 1st innings
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 25 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average will 12 Wickets be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wides - Average 8 wides will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Fifties - Average 2 fifties will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Caught out - Average 8 catch out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Bowled out - Average 2 bowled out will be
                                given in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Highest 6 over run: Both innings are valid
                              </div>
                              <div className="rule-text">
                                Highest run in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Fours in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest Sixes in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Total LBW:- Average 1 LBW will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Highest Wickets in individual match: Both
                                innings are valid
                              </div>
                              <div className="rule-text">
                                Highest extras in individual match: Both innings
                                are valid
                              </div>
                              <div className="rule-text">
                                Highest match 1st over run in individual match:
                                Only 1st inning will be considered as valid
                                valid
                              </div>
                              <div className="rule-text text-danger">
                                All events related to bowler are valid only for
                                the league stages, both the innings will be
                                considered as valid. A minimum of 32 overs has
                                to be bowled else the same will be voided. If
                                the mentioned bowler has bowled one legal
                                delivery then it will be considered as 1 over
                                even if the over is not completed
                              </div>
                              <div className="rule-text text-danger">
                                All events based on ground are decided based on
                                the initial fixture, in case of any changes in
                                the venue between the series. Then average will
                                be given based on the initial fixture for the
                                number of games reduced, Similarly if any match
                                is added newly to the venue will not be
                                considered
                              </div>
                              <div className="rule-text text-danger">
                                Average for wickets taken will be given in case
                                match abandoned or over reduced or the player
                                has not bowled single legal delivery before the
                                over got reduced
                              </div>
                              <div className="rule-text text-danger">
                                Fancy based on all individual
                                teams/players/ground are valid only for league
                                stage
                              </div>
                              <div className="rule-text text-danger">
                                Management decision will be final
                              </div>
                              <div className="rule-text text-danger">
                                Bellerive Oval:- Hobart
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 46 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 28 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 11 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 330 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Manuka Oval:- Canberra
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 5 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 44 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 24 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 13 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 318 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Bellerive Oval:- Hobart
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Aurora stadium:- Launceston
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 45 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 25 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 320 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                The Gabba:- Brisbane
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 44 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 24 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 9 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 13 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                QUEENSLAND
                              </div>
                              <div className="rule-text">
                                Total Run- Average 310 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 44 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 24 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 315 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Adelaide Oval
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 46 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 27 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 320 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Perth Stadium
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 46 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 26 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 12 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 9 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 16 Extras will be given
                                in case match abandoned or over reducedTotal
                                Extras - Average 16 Extras will be given in case
                                match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 340 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Showground Stadium
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 44 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 25 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 9 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 315 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Docklands Stadium
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 46 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 25 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 11 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 14 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 320 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Melbourne Ground
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 45 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 26 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 10 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 15 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 330 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Sydney Ground
                              </div>
                              <div className="rule-text">
                                Total 1st over run:- Average 6 runs will be
                                given if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total 6 over run:- Average 46 runs will be given
                                if total 20 overs is not played, only 1st
                                innings will be considered as valid
                              </div>
                              <div className="rule-text">
                                Total Fours - Average 26 fours will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes - Average 12 Sixes will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets - Average 12 wickets will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide – Average 8 Wide will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras - Average 15 Extras will be given
                                in case match abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run- Average 335 runs will be given in
                                case match abandoned or over reduced
                              </div>
                              <div className="rule-text text-danger">
                                Average will be given for player if the
                                mentioned player is not included in the playing
                                11
                              </div>
                              <div className="rule-text text-danger">
                                If the mentioned player is not included in
                                playing 11 for 3 consecutive matches and the
                                mentioned player will be deleted
                              </div>
                              <div className="rule-text text-danger">
                                Super over will not be included
                              </div>
                              <div className="rule-text text-danger">
                                World Cup
                              </div>
                              <div className="rule-text text-danger">
                                In case of any circumstances, management
                                decision will be final for all the fancies under
                                world cup.
                              </div>
                              <div className="rule-text text-danger">
                                WC:-WORLD CUP
                              </div>
                              <div className="rule-text text-danger">
                                MOM:-MAN OF THE MATCH.
                              </div>
                              <div className="rule-text">
                                Match 1st over run:- This fancy is valid only
                                for first innings of the match, Average 4 runs
                                will be given in case of match abandoned or the
                                entire 50 over is not played.
                              </div>
                              <div className="rule-text">
                                Highest inning run:- This fancy is valid only
                                for first innings of the match.
                              </div>
                              <div className="rule-text">
                                Lowest innings run:- This fancy is valid only
                                for first innings of the match.
                              </div>
                              <div className="rule-text">
                                Total Fours:- Average 48 Fours will be given if
                                the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Sixes:- Average 10 Sixes will be given if
                                the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wickets:- Average 15 Wickets will be given
                                if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Wide:- Average 14 Wide will be given if
                                the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Extras:- Average 25 Extras will be given
                                if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total No ball:- Average 2 No ball will be given
                                if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Fifties:- Average 3 Fifties will be given
                                if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Centuries:- Average 1 century will be
                                given if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Run outs:- Average 1 Run out will be given
                                if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                Total Ducks:- Average 1 Duck out will be given
                                if the match is abandoned or over reduced. If
                                the player is not out in the score of zero the
                                same will not be considered as Duck out.
                              </div>
                              <div className="rule-text">
                                Total Caught Out:- Average 10 Caught Out will be
                                given if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                All fancy related to Individual teams are valid
                                only for league matches (9 matches played by the
                                teams in league stages)
                              </div>
                              <div className="rule-text">
                                In case any player mentioned in our world cup
                                fancy doesn’t play for the first three
                                consecutive matches all the bets will be
                                deleted.
                              </div>
                              <div className="rule-text">
                                1. In case any player mentioned in our world cup
                                fancy got ruled out or doesn’t play post few
                                matches the bets after the last match played by
                                the above mentioned player will be deleted. For
                                example: U Khawaja played for first three league
                                matches and doesn’t play after that, then bets
                                for the first three matches will be valid. Bets
                                after third match will be deleted.
                              </div>
                              <div className="rule-text">
                                2. First 10 over runs is valid for both innings
                                for all the teams.
                              </div>
                              <div className="rule-text">
                                3. Total runs by team:- Average will be given if
                                the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                4. First 10 over runs by team:- Average will be
                                given if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                5. Fours by team:- Average will be given if the
                                match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                6. Sixes by team:- Average will be given if the
                                match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                7. Opening wicket partnership:- Average will be
                                given if the match is abandoned or over reduced
                              </div>
                              <div className="rule-text">
                                8. Runs by player:- Average will be given if the
                                match is abandoned or over reduced, Average will
                                be given unless one ball is being played after
                                the player enters the crease
                              </div>
                              <div className="rule-text">
                                9. Wickets by player:- Average will be given if
                                the match is abandoned or over reduced, Average
                                will be given unless one legal delivery has been
                                bowled by the mentioned player.
                              </div>
                              <div className="rule-text">
                                10. Sixes by player:- Average will be given if
                                the match is abandoned or over reduced, Average
                                will be given unless one ball is being played
                                after the player enters the crease.
                              </div>
                              <div className="rule-text text-danger">
                                Average of every fancy follows:
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by ENG 295 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of ENG 56 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by ENG 25 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by ENG 7 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of ENG 44 runs
                                per game
                              </div>
                              <div className="rule-text">
                                J Roy runs 38 runs per game
                              </div>
                              <div className="rule-text">
                                J Bairstow runs 43 runs per game
                              </div>
                              <div className="rule-text">
                                J Root runs 43 runs per game
                              </div>
                              <div className="rule-text">
                                J Archer wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                C Woakes wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                A Rashid wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                J Bairstow Sixes 2 sixes per game
                              </div>
                              <div className="rule-text">
                                J Buttler Sixes 2 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by IND 285 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of IND 53 runs per game
                              </div>
                              <div className="rule-text">
                                Total Four by IND 26 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by IND 6 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of IND 41 runs
                                per game
                              </div>
                              <div className="rule-text">
                                S Dhawan runs 38 runs per game
                              </div>
                              <div className="rule-text">
                                R Sharma runs 43 runs per game
                              </div>
                              <div className="rule-text">
                                V Kohli runs 48 runs per game
                              </div>
                              <div className="rule-text">
                                J Bumrah wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                M Shami wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                K Yadav wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                R Sharma Sixes 2 sixes per game
                              </div>
                              <div className="rule-text">
                                H Pandya Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by AUS 280 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of AUS 52 runs per game
                              </div>
                              <div className="rule-text">
                                Total Four by AUS 26 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by AUS 6 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of AUS 40 runs
                                per game
                              </div>
                              <div className="rule-text">
                                D Warner runs 43 runs per game
                              </div>
                              <div className="rule-text">
                                A Finch runs 38 runs per game
                              </div>
                              <div className="rule-text">
                                S Smith runs 42 runs per game
                              </div>
                              <div className="rule-text">
                                M Starc wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                P Cummins wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                A Zampa wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                D Warner Sixes 2 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by SA 270 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of SA 51 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by SA 24 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by SA 5 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of SA 37 runs
                                per game
                              </div>
                              <div className="rule-text">
                                H Amla runs 38 runs per game
                              </div>
                              <div className="rule-text">
                                F Du plessis runs 39 runs per game
                              </div>
                              <div className="rule-text">
                                V Der Dussen runs Runs per game
                              </div>
                              <div className="rule-text">
                                Q De Kock runs 36 Runs per game
                              </div>
                              <div className="rule-text">
                                I Tahir wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                K Rabada wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                D Steyn wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                Q De Kock Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by NZ 275 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of NZ 50 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by NZ 25 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by NZ 5 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of NZ 37 runs
                                per game
                              </div>
                              <div className="rule-text">
                                C Munro runs 32 runs per game
                              </div>
                              <div className="rule-text">
                                M Guptill runs 38 runs per game
                              </div>
                              <div className="rule-text">
                                K Williamson runs 45 runs per game
                              </div>
                              <div className="rule-text">
                                H Nicholls runs Runs per game
                              </div>
                              <div className="rule-text">
                                T Boult wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                T Southee wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                M Santner wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                M Guptill Sixes 2 Sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by WI 270 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of WI 49 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by WI 23 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by WI 7 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of WI 35 runs
                                per game
                              </div>
                              <div className="rule-text">
                                C Gayle runs 37 runs per game
                              </div>
                              <div className="rule-text">
                                E Lewis runs 32 runs per game
                              </div>
                              <div className="rule-text">
                                DM Bravo runs 32 runs per game
                              </div>
                              <div className="rule-text">
                                S Hope runs 37 runs per game
                              </div>
                              <div className="rule-text">
                                K Roach wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                S Cottrell wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                J holder wickets 1 wicket per game
                              </div>
                              <div className="rule-text">
                                A Nurse wickets 1 wickets per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by PAK 270 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of PAK 50 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by PAK 24 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by PAK 5 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of PAK 36 runs
                                per game
                              </div>
                              <div className="rule-text">
                                Imam Ul Haq runs 36 runs per game
                              </div>
                              <div className="rule-text">
                                B Azam runs 44 runs per game
                              </div>
                              <div className="rule-text">
                                F Zaman runs 34 runs per game
                              </div>
                              <div className="rule-text">
                                H Ali wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                Shadab Khan wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                Shaheen Afridi wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                F Zaman Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                C Gayle Sixes 2 Sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                A Russell Sixes 2 Sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by SL 250 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of SL 48 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by SL 22 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by SL 4 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of SL 32 runs
                                per game
                              </div>
                              <div className="rule-text">
                                D Karunaratne runs 31 runs per game
                              </div>
                              <div className="rule-text">
                                L Thirimanne runs 29 runs per game
                              </div>
                              <div className="rule-text">
                                K Mendis runs 33 runs per game
                              </div>
                              <div className="rule-text">
                                L Malinga wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                S Lakmal wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                J Vandersay wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                T Perera Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by BAN 245 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of BAN 48 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by BAN 22 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by BAN 4 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of BAN 32 runs
                                per game
                              </div>
                              <div className="rule-text">
                                T Iqbal runs 34 runs per game
                              </div>
                              <div className="rule-text">
                                S Sarkar runs 29 runs per game
                              </div>
                              <div className="rule-text">
                                M Rahim runs 31 runs per game
                              </div>
                              <div className="rule-text">
                                M Hasan wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                M Rahman wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                M Mortaza wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                T Iqbal Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Total runs by AFG 235 runs per game
                              </div>
                              <div className="rule-text">
                                First 10 over runs of AFG 46 runs per game
                              </div>
                              <div className="rule-text">
                                Total Fours by AFG 20 fours per game
                              </div>
                              <div className="rule-text">
                                Total Sixes by AFG 4 sixes per game
                              </div>
                              <div className="rule-text">
                                Opening wicket partnership runs of AFG 28 runs
                                per game
                              </div>
                              <div className="rule-text">
                                R Shah runs 27 runs per game
                              </div>
                              <div className="rule-text">
                                H Zazai runs 26 runs per game
                              </div>
                              <div className="rule-text">
                                A Afghan runs Runs per game
                              </div>
                              <div className="rule-text">
                                M Shahzad runs 27 runs per game
                              </div>
                              <div className="rule-text">
                                D Zadran wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                Rashid khan wickets 2 wickets per game
                              </div>
                              <div className="rule-text">
                                Mujeeb ur rahman wickets 1 wickets per game
                              </div>
                              <div className="rule-text">
                                H Zazai Sixes 1 sixes per game
                              </div>
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event18game5"
                                className="collapsed"
                              >
                                khado
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion18"
                              id="event18game5"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                Only First inning valid for T20 and one day
                                matches.
                              </div>
                              <div className="rule-text">
                                Same will be work like Lambi. If match abandoned
                                or over reduced, all bets will be deleted.
                              </div>
                              <div className="rule-text">
                                You can choose your own value in this event.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead19" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event19"
                          aria-controls="event19"
                          className="collapsed"
                        >
                          Politics
                        </a>
                      </div>{" "}
                      <div
                        id="event19"
                        aria-labelledby="eventhead19"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion19" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event19game0"
                                className="collapsed"
                              >
                                fancy
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion19"
                              id="event19game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                1. This event is to decide the winner of various
                                legislative assemblies of india.
                              </div>
                              <div className="rule-text">
                                2. The final result declared by election
                                commission of india for assembly elections of
                                various states of india for a particular year
                                will be valid in our exchange ,The customers are
                                entirely responsible for their bets at all
                                times.
                              </div>
                              <div className="rule-text">
                                3. All bets will be voided if the election
                                doesn't take place in given time by election
                                commission or as per our exchange management
                                decision.
                              </div>
                              <div className="rule-text">
                                4. Company reserves the right to suspend/void
                                any bets on this event at any time if we find
                                the same not to be legitimate with the certainty
                                of the outcome.
                              </div>
                              <div className="rule-text">
                                5. Accidental issues during assembly elections
                                will not be counted in our exchange If required
                                Additional candidates may be added on request.
                              </div>
                              <div className="rule-text">
                                6. Kindly be informed no candidates will be
                                partially settled and will remain in the market
                                until it is fully settled. This is to ensure
                                that all customers can continue trading for the
                                candidates that they have positions on, since
                                each candidate is still a valid runner in this
                                market.
                              </div>
                              <div className="rule-text">
                                7. Please be informed that the transmissions
                                described as "live" by few broadcasters may
                                actually be delayed due to multiple scenarios.
                              </div>
                              <div className="rule-text">
                                8. If any candidate withdraws for any reason,
                                including death, all bets on the market will be
                                valid and be settled as per the defined rules.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead20" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event20"
                          aria-controls="event20"
                          className="collapsed"
                        >
                          Golf
                        </a>
                      </div>{" "}
                      <div
                        id="event20"
                        aria-labelledby="eventhead20"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion20" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event20game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion20"
                              id="event20game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead21" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event21"
                          aria-controls="event21"
                          className="collapsed"
                        >
                          Motor Sports
                        </a>
                      </div>{" "}
                      <div
                        id="event21"
                        aria-labelledby="eventhead21"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion21" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event21game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion21"
                              id="event21game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event21game1"
                                className="collapsed"
                              >
                                bookmaker
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion21"
                              id="event21game1"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                All race bets are settled on the official
                                classification from the Federation
                                Internationale de l’Automobile (FIA),the sport’s
                                governing body, at the time of podium
                                presentation.
                              </div>
                              <div className="rule-text">
                                If a race is postponed ( Either before the start
                                or via an interruption mid-race) but is
                                concluded within 72 hours of the original
                                scheduled start time , then all bets will stand.
                              </div>
                              <div className="rule-text">
                                Our exchange management decision will be the
                                final decision.
                              </div>
                              <div className="rule-text">
                                Any query about the result should be contacted
                                within 7 days of the specific event, the same
                                will not be considered valid post 7 days
                                from&nbsp;the&nbsp;event.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead22" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event22"
                          aria-controls="event22"
                          className="collapsed"
                        >
                          Baseball
                        </a>
                      </div>{" "}
                      <div
                        id="event22"
                        aria-labelledby="eventhead22"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion22" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event22game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion22"
                              id="event22game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead23" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event23"
                          aria-controls="event23"
                          className="collapsed"
                        >
                          Rugby Union
                        </a>
                      </div>{" "}
                      <div
                        id="event23"
                        aria-labelledby="eventhead23"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion23" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event23game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion23"
                              id="event23game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead24" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event24"
                          aria-controls="event24"
                          className="collapsed"
                        >
                          Rugby League
                        </a>
                      </div>{" "}
                      <div
                        id="event24"
                        aria-labelledby="eventhead24"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion24" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event24game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion24"
                              id="event24game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead25" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event25"
                          aria-controls="event25"
                          className="collapsed"
                        >
                          Darts
                        </a>
                      </div>{" "}
                      <div
                        id="event25"
                        aria-labelledby="eventhead25"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion25" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event25game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion25"
                              id="event25game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead26" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event26"
                          aria-controls="event26"
                          className="collapsed"
                        >
                          American Football
                        </a>
                      </div>{" "}
                      <div
                        id="event26"
                        aria-labelledby="eventhead26"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion26" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event26game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion26"
                              id="event26game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text text-danger">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div id="eventhead27" className="card-header">
                        <a
                          href="javascript:void(0)"
                          data-toggle="collapse"
                          data-target="#event27"
                          aria-controls="event27"
                          className="collapsed"
                        >
                          Snooker
                        </a>
                      </div>{" "}
                      <div
                        id="event27"
                        aria-labelledby="eventhead27"
                        data-parent="#accordion"
                        className="collapse"
                      >
                        <div id="eventaccordion27" className="card-body">
                          <div className="card">
                            <div className="card-header">
                              <a
                                href="javascript:void(0)"
                                data-toggle="collapse"
                                data-target="#event27game0"
                                className="collapsed"
                              >
                                match
                              </a>
                            </div>{" "}
                            <div
                              data-parent="#eventaccordion27"
                              id="event27game0"
                              className="card-body collapse"
                            >
                              <div className="rule-text">
                                Match Odds:- Predict which player will win the
                                match. In the event of a match starting but not
                                being completed the player progressing to the
                                next round or being awarded the victory will be
                                deemed the winner for settlement purposes. In
                                the event of a match not starting at all, all
                                bets are refunded.
                              </div>
                              <div className="rule-text">
                                Frame Winner :- If the nominated frame is not
                                played bets will be void. Similarly, if the
                                nominated frame is awarded to a player without a
                                shot being played, then all bets will be void.
                              </div>
                              <div className="rule-text text-danger">
                                Company reserves the right to suspend/void any
                                id/bets if the same is found to be illegitimate.
                                For example incase of VPN/robot-use/multiple
                                entry from same or different IP and others. Note
                                : only winning bets will be voided.
                              </div>
                              <div className="rule-text">
                                for live streaming and animation :- Although the
                                current score, time elapsed, video and other
                                data provided on this site is sourced from
                                "live" feeds provided by third parties, you
                                should be aware that this data may be subject to
                                a time delay and/or be inaccurate. Please also
                                be aware that other customers may have access to
                                data that is faster and/or more accurate than
                                the data shown on the site. If you rely on this
                                data to place bets, you do so entirely at your
                                own risk. provides this data AS IS with no
                                warranty as to the accuracy, completeness or
                                timeliness of such data and accepts no
                                responsibility for any loss (direct or indirect)
                                suffered by you as a result of your reliance on
                                it.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row row5 mt-3 align-items-center">
                <div className="col-7">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rulesAccept"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rulesAccept">
                      I have read above rules
                    </label>
                  </div>
                </div>
                <div className="col-5 text-right">
                  <div
                    className="btn btn-secondary mr-2"
                    onClick={onClose}
                    style={{ cursor: "pointer", display: "inline-block" }}
                  >
                    Close
                  </div>
                  <div
                    className={`btn ${
                      accepted ? "btn-success" : "btn-secondary"
                    }`}
                    onClick={accepted ? handleAccept : undefined}
                    style={{
                      cursor: accepted ? "pointer" : "not-allowed",
                      display: "inline-block",
                      opacity: accepted ? 1 : 0.6,
                    }}
                  >
                    Accept
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleModal;
