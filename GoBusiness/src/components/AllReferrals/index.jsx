import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Referral from "../Referral";
import "./index.css";

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const AllReferrals = () => {
  const [allReferrals, setAllReferrals] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [view, setView] = useState(views.initial);
  const [sortBy, setSortBy] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const updatedList = allReferrals.slice(currPage * 10 - 10, currPage * 10);
  const totalPages = Math.ceil(allReferrals.length / 10);

  useEffect(() => {
    const fetchAllReferrals = async () => {
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
          const allReferralsData = await res.json();
          const { data } = allReferralsData;
          const { referrals } = data;
          setAllReferrals(referrals);
          setView(views.success);
        }
      } catch (e) {
        setView(views.failure);
        console.error(e);
      }
    };
    fetchAllReferrals();
  }, []);

  const pages = () => {
    const pagesButton = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesButton.push(
        <button
          type="button"
          key={i}
          onClick={() => setCurrPage(i)}
          className={currPage === i ? "active-page" : ""}
        >
          {i}
        </button>,
      );
    }
    return pagesButton;
  };

  const nextPage = () => {
    if (currPage < totalPages) {
      setCurrPage(currPage + 1);
    }
  };

  const previousPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  const sortReferrals = async (e) => {
    const currSort = e.target.value;
    setSortBy(currSort);
    try {
      const jwtToken = Cookies.get("jwt_token");
      const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?sort=${currSort}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const res = await fetch(url, options);
      if (res.ok) {
        const sortAllReferralsData = await res.json();
        const { data } = sortAllReferralsData;
        const { referrals } = data;
        console.log(referrals);
        setAllReferrals(referrals);
        setCurrPage(1);
      }
    } catch (e) {
      setView(views.failure);
      console.error(e);
    }
  };

  const onSearchInput = async (e) => {
    const value = e.target.value;
    try {
      const jwtToken = Cookies.get("jwt_token");
      const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?search=${value}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const res = await fetch(url, options);
      if (res.ok) {
        const searchAllReferralsData = await res.json();
        const { data } = searchAllReferralsData;
        const { referrals } = data;
        setAllReferrals(referrals);
        setCurrPage(1);
      }
    } catch (e) {
      setView(views.failure);
      console.error(e);
    }
  };

  const shareReferralDetails = () => {
    const startIndex = allReferrals.length > 0 ? currPage * 10 - 10 + 1 : 0;
    const endIndex = Math.min(currPage * 10, allReferrals.length);
    return (
      <div className="all-referral-sub-container">
        <h1 className="all-referral-main-head">All referrals</h1>
        <div className="filter-container">
          <div className="search-container">
            <label htmlFor="search" className="search-label"></label>
            <input
              type="text"
              id="search"
              onChange={onSearchInput}
              placeholder="Name or service..."
              aria-label="Search referrals"
            />
          </div>
          <div className="sort-container">
            <label htmlFor="sort">Sort by date</label>
            <select id="sort" value={sortBy} onChange={sortReferrals}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
        <div className="referral-container">
          <table className="referral-table">
            <thead className="table-head">
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {updatedList.map((curr, ind) => {
                return <Referral key={curr.id} ind={ind} referral={curr} />;
              })}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <p>
            Showing {startIndex} - {endIndex} of {allReferrals.length} entries
          </p>
          <div>
            <button
              type="button"
              onClick={previousPage}
              className="previous-button"
            >
              Previous
            </button>
            {pages()}
            <button
              type="button"
              onClick={nextPage}
              className="previous-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAllReferrals = () => {
    switch (view) {
      case views.success:
        return shareReferralDetails();
      case views.failure:
        return failureView();
      default:
        return null;
    }
  };
  return <div className="all-referral-container">{renderAllReferrals()}</div>
};

export default AllReferrals;
