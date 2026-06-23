import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import "./index.css";

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ShareReferral = () => {
  const [shareRefferral, setShareReferral] = useState({});
  const [view, setView] = useState(views.initial);
  useEffect(() => {
    const fetchShareReferral = async () => {
      setView(views.inProgress);
      try {
        const jwtToken = Cookies.get("jwt_token");
        const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`;
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };
        const res = await fetch(url, options);
        if (res.ok) {
          const shareReferralData = await res.json();
          const { data } = shareReferralData;
          const { referral } = data;
          setShareReferral(referral);
          setView(views.success);
        }
      } catch (e) {
        setView(views.failure);
        console.error(e);
      }
    };
    fetchShareReferral();
  }, []);

  const failureView = () => (
    <div className="error-view">
      <p>404 Not Found</p>
    </div>
  );

  const shareReferralDetails = () => {
    const { code, link } = shareRefferral;
    return (
      <div className="share-referral-sub-container">
        <h1 className="share-referral-heading">Refer friends and earn more</h1>
        <div className="referrals-container">
          <div className="card">
            <div className="referral-input-group">
              <label htmlFor="link" className="referral-label">
                YOUR REFERRAL LINK
              </label>
              <input
                type="text"
                id="link"
                className="referral-input"
                readOnly
                value="https://gobusiness.com/?referral=ABCXYZ"
              />
            </div>
            <button type="button" className="copy-button">
              Copy
            </button>
          </div>
          <div className="card">
            <div className="referral-input-group">
              <label htmlFor="code" className="referral-label">
                YOUR REFERRAL CODE
              </label>
              <input
                type="text"
                id="code"
                className="referral-input"
                readOnly
                value="ABCXYZ"
              />
            </div>
            <button type="button" className="copy-button">
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderShareReferral = () => {
    switch (view) {
      case views.success:
        return shareReferralDetails();
      case views.failure:
        return failureView();
      default:
        return null;
    }
  };
  return (
    <div className="share-referral-container" aria-label="Share referral">
      {renderShareReferral()}
    </div>
  );
};

export default ShareReferral;
