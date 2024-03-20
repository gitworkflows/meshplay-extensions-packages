import React, { useState, useEffect, useRef } from "react";
import { Header } from "./Navigation.styles";
import { Toggle } from "../Toggle";
import axios from "axios";
import DefaultAvatar from "./DefaultAvatar";
import CloudIcon from "./CloudIcon";
import MeshMapIcon from "./MeshMapIcon";
import LogoutIcon from "./LogoutIcon";
function Navigation({ theme, toggleTheme, showSignUpButton, logo }) {
  const [openNav, setOpenNav] = useState(false);

  const [userData, setUserData] = useState(null);
  const [scroll, setScroll] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  function getCookieValue(cookieName) {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim(); // Remove whitespace
      if (cookie.indexOf(cookieName + "=") === 0) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  }
  function removeCookie(cookieName) {
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  useEffect(() => {
    window.addEventListener("scroll", () =>
      window.pageYOffset > 50 ? setScroll(true) : setScroll(false)
    );
  }, []);
  useEffect(() => {
    const CLOUD_USER_API =
      "https://meshplay.khulnasoft.com/api/identity/users/profile";
    const fetchData = async () => {
      try {
        const token = getCookieValue("provider_token");
        const response = await axios.get(CLOUD_USER_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const data = response.data;
        // setUserData(data);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData();
  }, []);
  const handleNavOpen = () => {
    setOpenNav(!openNav);
  };

  return (
    <Header>
      <nav className={scroll ? "scrolled" : ""}>
        <img className="logo" src={logo} alt="KhulnaSoft Logo" />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <div className="btn-container">
            <Toggle theme={theme} toggleTheme={toggleTheme} />
            {showSignUpButton && !userData && (
              <a
                href="https://meshplay.khulnasoft.com"
                className="signup-btn"
                role="button"
              >
                Login
              </a>
            )}
          </div>
          <div className="dropdown_btn" onClick={handleNavOpen}>
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="hamburger-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="hamburger-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            )}
          </div>
          {userData && (
            <div className="dropDown">
              <button
                className="avatar-container"
                style={{
                  backgroundImage: `url(${userData.avatar_url})`,
                  backgroundSize: "cover",
                }}
                onClick={() => setDropDown((prev) => !prev)}
              >
                {!userData.avatar_url && (
                  <DefaultAvatar className="default_avatar" />
                )}
              </button>
              <div
                className={"dropDown-content"}
                style={{ display: `${dropDown ? "block" : "none"}` }}
              >
                <a
                  rel="noreferrer"
                  target="_blank"
                  className="drop-item"
                  href={`https://meshplay.khulnasoft.com/user/${userData.id}`}
                >
                  <div className="drop-item-icon">
                    <CloudIcon />
                  </div>
                  Cloud
                </a>
                <a
                  rel="noreferrer"
                  className="drop-item"
                  href="https://playground.meshplay.io"
                  target="_blank"
                >
                  <div className="drop-item-icon">
                    <MeshMapIcon />
                  </div>
                  Playground
                </a>
                <a
                  onClick={() => {
                    removeCookie("provider_token");
                    // Open logout API link in a new tab
                    window.open("https://meshplay.khulnasoft.com/logout", "_blank");

                    // Refresh the current page
                    window.location.reload();
                  }}
                  rel="noreferrer"
                  className="drop-item"
                >
                  <div className="drop-item-icon">
                    <LogoutIcon />
                  </div>
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div
        className={openNav ? "dropdown_menu_opened" : "dropdown_menu_closed"}
      >
        <div className="mode-btn">
          <Toggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        {!userData && (
          <div className="action-btns">
            <a
              href="https://meshplay.khulnasoft.com"
              className="signup-btn"
              role="button"
            >
              Login
            </a>
            {/* <a href="https://demo.meshplay.io" className="login-btn" role="button">Login</a> */}
          </div>
        )}
      </div>
    </Header>
  );
}

export default Navigation;
