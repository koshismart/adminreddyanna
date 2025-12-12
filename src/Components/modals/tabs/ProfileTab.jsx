// import React from "react";

// const ProfileTab = ({ account }) => {
//   return (
//     <div className="row">
//       <div className="col-xl-6">
//         <div className="card text-center">
//           <div className="card-body p-2">
//             <div className="avatar-sm mx-auto mb-1">
//               <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-16 text-uppercase">
//                 {account.username.charAt(0)}
//               </span>
//             </div>
//             <h5 className="font-size-15">
//               <a href="#" className="text-dark">
//                 {account.username}
//               </a>
//             </h5>
//             <p className="text-muted mb-1">{account.fullName}</p>
//           </div>
//           <div className="card-footer bg-transparent border-top">
//             <div className="contact-links d-flex font-size-20">
//               <div className="flex-fill">
//                 <a href="#">
//                   <i className="bx bx-phone-call" />
//                 </a>
//               </div>
//               <div className="flex-fill">
//                 <a title={`City: ${account.city}`} href="#">
//                   <i className="bx bxs-city" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="card personalinfo-card">
//           <div className="card-body">
//             <h4 className="card-title mb-4">Partnership Information</h4>
//             <div className="table-responsive mb-0">
//               <table className="table">
//                 <tbody>
//                   <tr>
//                     <th scope="row" className="br-0">Partnership Name:</th>
//                     <td className="br-0">{account.partnershipName}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">User Part:</th>
//                     <td className="br-0">{account.userPart}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Our Part:</th>
//                     <td className="br-0">{account.ourPart}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="col-xl-6">
//         <div className="card">
//           <div className="card-body">
//             <h4 className="card-title mb-4">Additional Information</h4>
//             <div className="table-responsive mb-0">
//               <table className="table">
//                 <tbody>
//                   <tr>
//                     <th scope="row" className="br-0">User Name:</th>
//                     <td className="br-0">{account.username}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Full Name:</th>
//                     <td className="br-0">{account.fullName}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Mobile Number:</th>
//                     <td className="br-0">{account.mobileNumber}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">City:</th>
//                     <td className="br-0">{account.city}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Credit Pts:</th>
//                     <td className="br-0">{account.creditPts}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Pts:</th>
//                     <td className="br-0"><span>{account.pts}</span></td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Client P/L:</th>
//                     <td className="br-0">{account.clientPL}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Exposure:</th>
//                     <td className="br-0">{account.exposure}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Casino Pts:</th>
//                     <td className="br-0">{account.casinoPts}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Sports Pts:</th>
//                     <td className="br-0">{account.sportsPts}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Third Party Pts:</th>
//                     <td className="br-0">{account.thirdPartyPts}</td>
//                   </tr>
//                   <tr>
//                     <th scope="row" className="br-0">Created Date :</th>
//                     <td className="br-0"><span>{account.createdDate}</span></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileTab;

import React from "react";

const ProfileTab = ({ account }) => {
  // Format account data for display
  const formattedAccount = {
    username: account.PersonalDetails?.userName || "N/A",
    fullName: account.PersonalDetails?.userName || "N/A",
    mobileNumber: account.PersonalDetails?.mobile || "N/A",
    city: "N/A",
    creditPts: account.AccountDetails?.Balance?.toFixed(2) || "0.00",
    pts: account.AccountDetails?.Balance?.toFixed(2) || "0.00",
    clientPL: account.AccountDetails?.profitLoss?.toFixed(2) || "0.00",
    exposure: account.AccountDetails?.Exposure?.toFixed(2) || "0.00",
    casinoPts: "0.00",
    sportsPts: "0.00",
    thirdPartyPts: "0.00",
    createdDate: account.createdAt
      ? new Date(account.createdAt).toLocaleString("en-GB")
      : "N/A",
    partnershipName: "Partnership With No Return",
    userPart: "0",
    ourPart: "100",
  };

  return (
    <div className="row">
      <div className="col-xl-6">
        <div className="card text-center">
          <div className="card-body p-2">
            <div className="avatar-sm mx-auto mb-1">
              <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-16 text-uppercase">
                {formattedAccount.username.charAt(0)}
              </span>
            </div>
            <h5 className="font-size-15">
              <a href="#" className="text-dark">
                {formattedAccount.username}
              </a>
            </h5>
            <p className="text-muted mb-1">{formattedAccount.fullName}</p>
          </div>
          <div className="card-footer bg-transparent border-top">
            <div className="contact-links d-flex font-size-20">
              <div className="flex-fill">
                <a href="#">
                  <i className="bx bx-phone-call" />
                </a>
              </div>
              <div className="flex-fill">
                <a title={`City: ${formattedAccount.city}`} href="#">
                  <i className="bx bxs-city" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card personalinfo-card">
          <div className="card-body">
            <h4 className="card-title mb-4">Partnership Information</h4>
            <div className="table-responsive mb-0">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row" className="br-0">
                      Partnership Name:
                    </th>
                    <td className="br-0">{formattedAccount.partnershipName}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      User Part:
                    </th>
                    <td className="br-0">{formattedAccount.userPart}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Our Part:
                    </th>
                    <td className="br-0">{formattedAccount.ourPart}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Additional Information</h4>
            <div className="table-responsive mb-0">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row" className="br-0">
                      User Name:
                    </th>
                    <td className="br-0">{formattedAccount.username}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Full Name:
                    </th>
                    <td className="br-0">{formattedAccount.fullName}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Mobile Number:
                    </th>
                    <td className="br-0">{formattedAccount.mobileNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      City:
                    </th>
                    <td className="br-0">{formattedAccount.city}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Credit Pts:
                    </th>
                    <td className="br-0">{formattedAccount.creditPts}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Pts:
                    </th>
                    <td className="br-0">
                      <span>{formattedAccount.pts}</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Client P/L:
                    </th>
                    <td className="br-0">{formattedAccount.clientPL}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Exposure:
                    </th>
                    <td className="br-0">{formattedAccount.exposure}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Casino Pts:
                    </th>
                    <td className="br-0">{formattedAccount.casinoPts}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Sports Pts:
                    </th>
                    <td className="br-0">{formattedAccount.sportsPts}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Third Party Pts:
                    </th>
                    <td className="br-0">{formattedAccount.thirdPartyPts}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="br-0">
                      Created Date :
                    </th>
                    <td className="br-0">
                      <span>{formattedAccount.createdDate}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
