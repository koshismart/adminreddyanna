import React from "react";

const AccountStatementTab = ({ account }) => {
  const formattedDate = account.createdAt 
    ? new Date(account.createdAt).toLocaleString("en-GB")
    : "N/A";

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive mb-0">
              <div className="table no-footer table-hover table-responsive-sm">
                <table
                  id="accStmtTable"
                  role="table"
                  aria-busy="false"
                  aria-colcount={7}
                  className="table b-table table-bordered"
                >
                  <colgroup>
                    <col style={{ width: 120 }} />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 350 }} />
                    <col style={{ width: 120 }} />
                  </colgroup>
                  <thead role="rowgroup">
                    <tr role="row" style={{ border: "1px solid rgb(214, 214, 214)" }}>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={1} aria-sort="none" className="position-relative">
                        <div>Date</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={2} aria-sort="none" className="position-relative text-right">
                        <div>Sr No</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={3} aria-sort="none" className="position-relative text-right">
                        <div>Credit</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={4} aria-sort="none" className="position-relative text-right">
                        <div>Debit</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={5} aria-sort="none" className="position-relative text-right">
                        <div>Pts</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={6} aria-sort="none" className="position-relative">
                        <div>Remark</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                      <th role="columnheader" scope="col" tabIndex={0} aria-colindex={7} aria-sort="none" className="position-relative">
                        <div>Fromto</div>
                        <span className="sr-only"> (Click to sort ascending)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    <tr role="row" tabIndex={0} aria-rowindex={1} className="nocursor" style={{ border: "1px solid rgb(214, 214, 214)" }}>
                      <td aria-colindex={1} role="cell">{formattedDate}</td>
                      <td aria-colindex={2} role="cell">
                        <div className="text-right">1</div>
                      </td>
                      <td className="text-right">
                        <small>
                          <span className="text-success">10,000</span>
                        </small>
                      </td>
                      <td className="text-right">
                        <small />
                      </td>
                      <td aria-colindex={5} role="cell">
                        <div className="text-right text-success">
                          <span>10,000</span>
                        </div>
                      </td>
                      <td className="dec-cell" role="cell" aria-colindex={6}>
                        User Creation by: RAJTECH
                      </td>
                      <td aria-colindex={7} role="cell">
                        <span>{account.PersonalDetails?.userName || "N/A"}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col">
                <div className="dataTables_paginate paging_simple_numbers float-right">
                  <ul className="pagination pagination-rounded mb-0">
                    <li className="page-item disabled">
                      <span className="page-link">«</span>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link">‹</span>
                    </li>
                    <li className="page-item active">
                      <button className="page-link">1</button>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link">›</span>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link">»</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatementTab;