import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CampaignCard from "../../components/campaignCard/CampaignCard";
import Spinner from "../../components/spinner/Spinner"; // Import the Spinner component
import newRequest from "../../utils/newRequest";
import "./Campaigns.scss";

// Component to display all campaigns with filtering and sorting options
function Campaigns() {
  const [sort, setSort] = useState("sales"); // State to manage sorting option
  const [open, setOpen] = useState(false); // State to manage dropdown menu visibility
  const minRef = useRef(); // Ref for minimum price input
  const maxRef = useRef();// Ref for maximum price input

  const { search } = useLocation(); // Get the current URL search parameters

   // Fetch campaigns with filters
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [
      "campaigns",
      search,
      sort,
      minRef.current?.value,
      maxRef.current?.value,
    ],
    queryFn: () => {
      const params = new URLSearchParams(search);
      if (minRef.current?.value) params.set("min", minRef.current.value);
      if (maxRef.current?.value) params.set("max", maxRef.current.value);
      params.set("sort", sort);

      return newRequest.get(`/campaigns?${params.toString()}`).then((res) => {
        return res.data;
      });
    },
  });

  // Function to change sorting type
  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

   // Refetch campaigns when sorting or search parameters change
  useEffect(() => {
    refetch();
  }, [sort, search, minRef.current?.value, maxRef.current?.value]);

    // Apply filter based on price range
  const apply = () => {
    refetch();
  };

  return (
    <div className="campaigns">
      <div className="container">
        <h1>All Campaigns</h1>
        <p>
          Discover creative & unique collaborations from TuniCreatives top
          social media influencers.
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading ? (
            <Spinner /> // Use Spinner component here
          ) : error ? (
            "Something went wrong!"
          ) : data.length === 0 ? (
            <div className="no-results">
              <p>
                No campaigns found for your search criteria. Please try again
                with different keywords.
              </p>
            </div>
          ) : (
            data.map((campaign) => (
              <CampaignCard key={campaign._id} item={campaign} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
