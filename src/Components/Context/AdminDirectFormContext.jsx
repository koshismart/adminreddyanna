import React, { createContext, useState } from "react";
export const AdminDirectContext = createContext();

const AdminDirectFormContext = (props) => {
  const [adminDirectForm, setAdminDirectForm] = useState(false);
  const [profile, setProfile] = useState(false);
  const [socialContacts, setSocialContacts] = useState(false);
  const [accountSetting, setAccountSetting] = useState(false);
  const [refundSetting, setRefundSetting] = useState(false);
  const [refetch, setRefetch] = useState(false);
  return (
    <AdminDirectContext.Provider
      value={{
        adminDirectForm,
        setAdminDirectForm,
        refetch: { refetch, setRefetch },
        profileBtn: { profile, setProfile },
        socialContactsBtn: { socialContacts, setSocialContacts },
        accountBtn: { accountSetting, setAccountSetting },
        refundBtn: { refundSetting, setRefundSetting },
      }}
    >
      {props.children}
    </AdminDirectContext.Provider>
  );
};

export default AdminDirectFormContext;
