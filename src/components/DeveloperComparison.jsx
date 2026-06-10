import { useState } from "react";
import "../styles/DeveloperComparison.css";

import {
  buildDeveloperProfile,
} from "../utils/buildDeveloperProfile";

import ComparisonRadarChart from "./ComparisonRadarChart";
import ComparisonResult from "./ComparisonResult";

function DeveloperComparison({
  username,
}) {
  const [
    compareUsername,
    setCompareUsername,
  ] = useState("");

  const [profile1, setProfile1] =
    useState(null);

  const [profile2, setProfile2] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  async function handleCompare() {
    try {
      setLoading(true);
      setError(null);

      if (!compareUsername.trim()) {
        setError(
          "Enter a profile to compare."
        );
        return;
      }

      const currentProfile =
        await buildDeveloperProfile(
          username
        );

      const comparedProfile =
        await buildDeveloperProfile(
          compareUsername.trim()
        );

      if (
        !currentProfile ||
        !comparedProfile
      ) {
        setError(
          "Unable to compare profiles."
        );
        return;
      }

      setProfile1(currentProfile);
      setProfile2(comparedProfile);
    } catch (error) {
      console.error(error);

      setError(
        "Comparison failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="comparison-container">
      <div className="comparison-search">
        <input
          className="comparison-search-input"
          placeholder="SEARCH PROFILE HERE"
          value={compareUsername}
          onChange={(e) =>
            setCompareUsername(
              e.target.value
            )
          }
        />
        <br></br>
        <br></br>

        <button
          className="comparison-search-btn"
          onClick={handleCompare}
        >
          Compare
        </button>
      </div>
      <br></br>

      {loading && (
        <p>Loading comparison...</p>
      )}

      {error && <p>{error}</p>}

      

      {profile1 &&
        profile2 && (
          <>
            <div className="comparison-header">
              <div className="comparison-user">
                <img
                  src={profile1.avatar}
                  alt={profile1.username}
                  className="comparison-user-avatar"
                />

                <h3>
                  {profile1.username}
                </h3>
              </div>

              <div className="comparison-vs">
                VS
              </div>

              <div className="comparison-user">
                <img
                  src={profile2.avatar}
                  alt={profile2.username}
                  className="comparison-user-avatar"
                />

                <h3>
                  {profile2.username}
                </h3>
              </div>
              
            </div>
            <hr></hr>

            <ComparisonRadarChart
              profile1={profile1}
              profile2={profile2}
            />

            <hr></hr>

            <ComparisonResult
              profile1={profile1}
              profile2={profile2}
            />
          </>
        )}
    </div>
  );
}

export default DeveloperComparison;