import Header from "../Header";
import Overview from "../Overview";
import ServiceSummary from "../ServiceSummary";
import ShareReferral from "../ShareReferral";
import AllReferrals from "../AllReferrals";
import Footer from "../Footer";
import "./index.css";

const Dashboard = () => {
  return (
    <div className="container">
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-container">
          <h1 className="main-head">Referral Dashboard</h1>
          <p className="main-p">
            Track your referrals, earnings, and partner activity in one place.
          </p>
          <Overview />
          <ServiceSummary />
          <ShareReferral />
          <AllReferrals />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
