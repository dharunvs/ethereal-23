import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import eventImg from "../../Assets/Images/event.jpeg";
import { posterImg, posterImgArr } from "../../Assets/Images/posters";
import { events } from "../../data";

function Events() {
  const [loading, setLoading] = useState(true);
  const Loader = () => <div className="Loader">Loading...</div>;

  useEffect(() => {
    let assetsToPreload = [];

    assetsToPreload = assetsToPreload.concat(posterImgArr);

    const preloadAsset = (asset) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = asset;
        img.onload = resolve;
        img.onerror = reject;
      });
    };

    const preloadAssetsSequentially = async () => {
      try {
        for (const asset of assetsToPreload) {
          await preloadAsset(asset);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error preloading assets:", error);
      }
    };

    preloadAssetsSequentially();
  }, []);

  function scrollToId(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }
  useEffect(() => {
    scrollToId("root");
  }, []);

  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState(events);

  const handleSearch = (searchTerm) => {
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const Event = ({ event }) => {
    return (
      <div
        className="Event"
        onClick={() => {
          navigate("/event/" + event.eventId);
        }}
      >
        <img src={posterImg[event.eventId]} alt="eventImg" />

        <h1>{event.name}</h1>
      </div>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className="Events">
        <div className="EventsScreen">
          <div className="esControls">
            <div className="SearchBar">
              <p>S</p>
              <input
                type="text"
                placeholder="Search events"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="events">
            {filteredEvents.map((event, key) => (
              <Event event={event} key={key} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Events;
