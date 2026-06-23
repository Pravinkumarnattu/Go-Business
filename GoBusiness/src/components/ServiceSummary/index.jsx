import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import "./index.css";

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ServiceSummary = () => {
  const [summary, setSummary] = useState({});
  const [view, setView] = useState(views.initial);
  useEffect(() => {
    const fetchServiceSummary = async () => {
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
          const serviceSummaryData = await res.json();
          const { data } = serviceSummaryData;
          const { serviceSummary } = data;
          setSummary(serviceSummary);
          setView(views.success);
        }
      } catch (e) {
        setView(views.failure);
        console.error(e);
      }
    };
    fetchServiceSummary();
  }, []);

  const failureView = () => (
    <div className="error-view">
      <p>404 Not Found</p>
    </div>
  );

  const serviceSummaryDetails = () => {
    const { activeReferrals, service, totalRefEarnings, yourReferrals } =
      summary;
    return (
      <div className="service-sub-container">
        <h1 className="service-summary-heading">Service summary</h1>
        <div className="service-summary-grid">
          <div className="service-summary-item">
            <p className="service-summary-label">SERVICE</p>
            <h3 className="service-summary-value service-summary-link">
              {service}
            </h3>
          </div>
          <div className="service-summary-item">
            <p className="service-summary-label">YOUR REFERRALS</p>
            <h3 className="service-summary-value">{yourReferrals}</h3>
          </div>
          <div className="service-summary-item">
            <p className="service-summary-label">ACTIVE REFERRALS</p>
            <h3 className="service-summary-value">{activeReferrals}</h3>
          </div>
          <div className="service-summary-item">
            <p className="service-summary-label">TOTAL REF. EARNINGS</p>
            <h3 className="service-summary-value">{totalRefEarnings}</h3>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceSummary = () => {
    switch (view) {
      case views.success:
        return serviceSummaryDetails();
      case views.failure:
        return failureView();
      default:
        return null;
    }
  };

  return (
    <div className="service-summary-container" aria-label="Service summary">
      {renderServiceSummary()}
    </div>
  );
};

export default ServiceSummary;
