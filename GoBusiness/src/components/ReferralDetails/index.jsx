import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import Header from "../Header";
import "./index.css";

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ReferralDetails = () => {
  const [view, setView] = useState(views.initial);
  const [details, setDetails] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDetails = async () => {
      if (isNaN(id) && id.trim() !== "") {
        setView(views.failure);
        return;
      }
      setView(views.inProgress);
      try {
        const jwtToken = Cookies.get("jwt_token");
        const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };
        const res = await fetch(url, options);
        if (res.ok) {
          const referralsDetails = await res.json();
          const { data } = referralsDetails;
          const { referrals } = data;
          console.log(referrals);
          setDetails(referrals[0]);
          setView(views.success);
        } else {
          setView(views.failure);
        }
      } catch (e) {
        setView(views.failure);
        console.error(e);
      }
    };
    fetchDetails();
  }, []);

  const loadingView = () => (
    <div className="loading-view">
      <p>Loading Details...</p>
    </div>
  );

  const failureView = () => (
    <div className="error-view">
      <p>Referral not found</p>
    </div>
  );

  const getReferralsDetails = () => {
    const { id, name, serviceName, date, profit } = details;
    return (
      <div className="referrals-details-sub-container">
        <p onClick={() => navigate("/")}>
          <GoArrowLeft />
          Back to Dashboard
        </p>
        <h1 className="referral-head">Referral Details </h1>
        <p className="referral-p">Full Information for this referral partner</p>
        <div className="person-details">
          <div className="headline">
            <h1>{name}</h1>
            <div>{serviceName}</div>
          </div>
          <hr />
          <div className="referral-id">
            <p>REFERRAL ID</p>
            <p>{id}</p>
          </div>
          <hr />
          <div className="person-name">
            <p>NAME</p>
            <p>{name}</p>
          </div>
          <hr />
          <div className="person-service-name">
            <p>SERVICE NAME</p>
            <p>{serviceName}</p>
          </div>
          <hr />
          <div className="person-date">
            <p>DATE</p>
            <p>{date}</p>
          </div>
          <hr />
          <div className="person-profit">
            <p>PROFIT</p>
            <p>{profit}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderReferrals = () => {
    switch (view) {
      case views.inProgress:
        return loadingView();
      case views.success:
        return getReferralsDetails();
      case views.failure:
        return failureView();
      default:
        return null;
    }
  };

  return (
    <div className="referrals-details-container">
      <Header />
      {renderReferrals()}
    </div>
  );
};

export default ReferralDetails;
