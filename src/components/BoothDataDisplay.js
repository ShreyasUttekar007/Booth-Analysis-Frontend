import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/boothDataDisplay.css";

const BoothDataDisplay = ({ booth }) => {
  const [boothDetails, setBoothDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://43.205.136.100:5000/api/booths/bybooth/${booth}`
        );
        // Sort boothDetails array by timeSlot in ascending order
        const sortedData = Array.isArray(response.data)
          ? response.data.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
          : [response.data];
        setBoothDetails(sortedData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching booth data");
      }
    };

    if (booth) {
      fetchData();
    } else {
      setBoothDetails([]);
    }
  }, [booth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Booth Data Display</h2>
      <table>
        <thead>
          <tr>
            <th>Constituency</th>
            <th>Booth</th>
            <th>Time Slot</th>
            <th>Total Votes</th>
            <th>Polled Votes</th>
            <th>Polled Votes %</th>
            <th>Shivsena Votes</th>
            <th>Shivsena Votes %</th>
          </tr>
        </thead>
        <tbody>
          {boothDetails.length > 0 ? (
            boothDetails.map((details, index) => (
              <tr key={index}>
                <td>{details.constituency}</td>
                <td>{details.booth}</td>
                <td>{details.timeSlot}</td>
                <td>{details.totalVotes}</td>
                <td>{details.polledVotes}</td>
                <td>
                  {details.totalVotes && details.polledVotes
                    ? ((details.polledVotes / details.totalVotes) * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
                <td>{details.favVotes}</td>
                <td>
                  {details.polledVotes && details.favVotes
                    ? ((details.favVotes / details.totalVotes) * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BoothDataDisplay;
