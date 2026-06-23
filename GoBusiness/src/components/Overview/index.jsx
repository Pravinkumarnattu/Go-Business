import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import OverviewCard from "../OverviewCard";
import "./index.css";

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Overview = () => {
  const [metrics, setMetric] = useState([]);
  const [view, setView] = useState(views.initial);
  useEffect(() => {
    const fetchMetrics = async () => {
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
          const metricsData = await res.json();
          const { data } = metricsData;
          const { metrics } = data;
          setMetric(metrics);
          setView(views.success);
        }
      } catch (e) {
        setView(views.failure);
        console.error(e);
      }
    };
    fetchMetrics();
  }, []);

  const overviewList = () => {
    return (
      <div className="overview-section">
        <h1 className="overview-heading">Overview</h1>
        <div className="overview-grid">
          {metrics.map((metric) => (
            <OverviewCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    );
  };

  const loadingView = () => (
    <div className="loading-view">
      <p>Loading Dashboard...</p>
    </div>
  );

  const failureView = () => (
    <div className="error-view">
      <p>404 Not Found</p>
    </div>
  );

  const renderOverview = () => {
    switch (view) {
      case views.inProgress:
        return loadingView();
      case views.success:
        return overviewList();
      case views.failure:
        return failureView();
      default:
        return null;
    }
  };
  return (
    <div
      className="overview-container"
      role="region"
      aria-label="Overview metrics"
    >
      {renderOverview()}
    </div>
  );
};
export default Overview;
