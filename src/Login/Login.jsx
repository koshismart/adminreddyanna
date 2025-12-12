import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { authenticate, getWhiteListData, signIn } from "../Helper/auth";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ImgSkeletonLoader from "../Components/loaders/ImgSkeletonLoader";

const Login = () => {
  document.title = "Login Page";
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["Admin"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [IpAddress, setIpAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  // Dynamically select the URL based on the DEV or PROD environment
  console.log(import.meta.env.MODE);
  console.log(import.meta.env.VITE_DEVELOPMENT_MODE_URL);
  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEVELOPMENT_MODE_URL
      : fullUrl;

  console.log(baseUrl);

  // condition url base par  the baseUrl
  const isJeetKaadda = baseUrl?.includes("jeetkaadda");

  const {
    isLoading: isWhiteListLoading,
    data: whiteListData,
    refetch,
  } = useQuery(["whiteListData", baseUrl], () => getWhiteListData(baseUrl), {
    enabled: !!fullUrl, // Only fetch when fullUrl is truthy
    keepPreviousData: true,
    onSettled: () => {
      // Hide initial page loader when whitelist data is loaded
      setIsPageLoading(false);
    },
  });

  const fetchIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
        console.log("Network Error");
        return;
      }
      const data = await response.json();
      setIpAddress(data?.ip);
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  const getCurrentUrl = () => {
    try {
      setFullUrl(window.location.href);
    } catch (error) {
      console.error("Error capturing URL:", error);
    }
  };

  useEffect(() => {
    // Fetch IP address and current URL when the component mounts
    const initializeData = async () => {
      await Promise.all([fetchIpAddress(), getCurrentUrl()]);
    };

    initializeData();
  }, []);

  // Use the useMutation hook
  const loginMutation = useMutation(signIn, {
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.success === true) {
        return authenticate(
          data,
          () => {
            navigate("/");
          },
          setCookie
        );
      }
      if (data.success === false) {
        return Swal.fire({
          icon: "error",
          title: data?.error || data?.errors || "something went wrong",
          timer: "2000",
          confirmButtonText: "Ok",
          confirmButtonColor: "#33996A",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show",
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide",
          },
        });
      } else {
        return Swal.fire({
          icon: "error",
          title: "something went wrong",
          timer: "2000",
          confirmButtonText: "Ok",
          confirmButtonColor: "#33996A",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show",
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide",
          },
        });
      }
    },
    onError: (error) => {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: error || "something went wrong",
        timer: "2000",
        confirmButtonText: "Ok",
        confirmButtonColor: "#33996A",
        showClass: {
          popup: "swal2-show",
          backdrop: "swal2-backdrop-show",
          icon: "swal2-icon-show",
        },
        hideClass: {
          popup: "swal2-hide",
          backdrop: "swal2-backdrop-hide",
          icon: "swal2-icon-hide",
        },
      });
    },
  });

  //handle login
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    loginMutation.mutate({
      loginId: formData.get("loginId"),
      password: formData.get("password"),
      IpAddress: IpAddress,
      hostUrl: baseUrl,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show initial page loader until everything is ready
  if (isPageLoading) {
    return (
      <div id="loader-full" style={{ display: "flex" }}>
        <div id="load-inner">
          <img
            src="https://sitethemedata.com/sitethemes/d247.com/front/logo.png"
            className="logo-login"
            alt="Loading logo"
          />
          <i className="fa fa-spinner fa-spin" />
        </div>
      </div>
    );
  }

  // Updated design with same classes as your HTML
  return (
    <>
      <div id="loader-full" style={{ display: isLoading ? "flex" : "none" }}>
        <div id="load-inner">
          <img
            src="https://sitethemedata.com/sitethemes/d247.com/front/logo.png"
            className="logo-login"
            alt="Loading logo"
          />
          <i className="fa fa-spinner fa-spin" />
        </div>
      </div>
      <div className="login">
        <section className="login-mn">
          <div className="log-logo m-b-20">
            {isWhiteListLoading ? (
              <ImgSkeletonLoader />
            ) : (
              <img
                src={
                  whiteListData?.whiteListData?.Logo
                  // whiteListData?.success
                  //   ? `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
                  //       import.meta.env.VITE_AWS_REGION
                  //     }.amazonaws.com/${whiteListData?.whiteListData?.Logo}`
                  //   : null
                }
                loading="lazy"
                alt="logo"
              />
            )}
          </div>

          <div className="log-fld">
            <h2 className="text-center">Sign In</h2>

            <form
              autoComplete="off"
              data-vv-scope="form-login"
              action=""
              method="POST"
              className="form-horizontal"
              onSubmit={handleSubmit}
            >
              <div id="input-group-1" role="group" className="form-group">
                <div>
                  <input
                    id="input-1"
                    name="loginId"
                    type="text"
                    placeholder="Enter Username"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div id="input-group-2" role="group" className="form-group">
                <div>
                  <input
                    id="input-2"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="form-control "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {/* {showPassword ? "🙈" : "👁️"} */}
                  </span>
                </div>
              </div>

              <div className="form-group text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-submit btn-login btn-secondary"
                >
                  <span
                    className={`${
                      isLoading ? "block" : " hidden"
                    } loading loading-spinner loading-md`}
                  ></span>
                  Sign In <i className="fas fa-sign-in-alt" />
                </button>
              </div>
            </form>
          </div>

          <div className="log-copy">
            <p>
              <a href="mailto:info@d247.com" className="mail-link">
                info@d247.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
