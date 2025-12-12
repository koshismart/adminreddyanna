import React from "react";

const VipCasino = () => {
  return (
    <div data-v-b00d14ae="">
      <div data-v-b00d14ae="">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Our Casino</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Our Casino</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="card">
          <div className="casino-tabs-admin p-2">
            <div className="casino-tabs-menu w-100">
              <a href="" className="arrow-tabs arrow-left">
                <i className="mdi mdi-chevron-left" />
              </a>{" "}
              <ul className="nav nav-tabs nav-tabs-custom">
                <li className="nav-item">
                  <a href="javascript:void(0)" className="nav-link active">
                    All Casino
                  </a>
                </li>
                <li className="nav-item">
                  <a href="" className="nav-link">
                    Teenpatti
                  </a>
                </li>
              </ul>{" "}
              <a href="" className="arrow-tabs arrow-right">
                <i className="mdi mdi-chevron-right" />
              </a>
            </div>
          </div>{" "}
          <div className="casino-banners">
            <div className="casino-banner-item">
              <a href="/admin/casino/vip/teenpattit20" className="">
                <img
                  className="img-fluid"
                  data-src="https://sitethemedata.com/casino_icons/lc/teen20v1_admin.gif"
                  src="https://sitethemedata.com/casino_icons/lc/teen20v1_admin.gif"
                  lazy="loaded"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipCasino;
