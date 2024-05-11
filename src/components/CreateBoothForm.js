import React, { useState, useEffect } from "react";
import axios from "axios";
import localforage from "localforage";
import "../css/create.css";
import BoothDataDisplay from "./BoothDataDisplay";

const CreateBoothForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    constituency: "",
    booth: "",
    timeSlot: "",
    polledVotes: "",
    favVotes: "",
  });
  const [acName, setAcName] = useState("");
  const [booths, setBooths] = useState([]);
  const [boothData, setBoothData] = useState([]);
  const [userEmail, setUserEmail] = useState(""); // State to store user email
  const [selectedAc, setSelectedAc] = useState(""); // State to store selected AC
  console.log('selectedAc::: ', selectedAc);
  const [userRoles, setUserRoles] = useState([]); // State to store user roles

  useEffect(() => {
    localforage
      .getItem("role")
      .then((roles) => {
        if (roles) {
          const acName = roles;
          fetchBoothsByConstituency(acName);
        } else {
          console.error("Error: No roles found in local storage.");
        }
      })
      .catch((error) => {
        console.error("Error fetching AC name from local storage:", error);
      });

    // Fetch user email
    localforage.getItem("email").then((email) => {
      setUserEmail(email || "");
    });

    // Fetch AC names
    localforage.getItem("roles").then((roles) => {
      if (roles) {
        setUserRoles(roles); // Set user roles
        setAcName(roles[0]); // Set the first AC name as default
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAcChange = (e) => {
    const { value } = e.target;
    setSelectedAc(value);
    fetchBoothsByConstituency(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = await localforage.getItem("ID");
  
      const response = await axios.post(
        "http://43.205.136.100:5000/api/booths/create",
        {
          ...formData,
          userId: userId,
          constituency: selectedAc, 
        }
      );
      console.log(response.data);
      setFormData({
        userId: "",
        constituency: "",
        booth: "",
        timeSlot: "",
        polledVotes: "",
        favVotes: "",
      });
    } catch (error) {
      console.error("Error creating booth:", error);
    }
  };
  

  const fetchBoothsByConstituency = async (selectedAc) => {
    try {
      const response = await axios.get(
        `http://43.205.136.100:5000/api/booths/get-booth-names-by-constituency/${selectedAc}`
      );
      setBooths(response.data);
    } catch (error) {
      console.error("Error fetching booths by constituency:", error);
    }
  };

  useEffect(() => {
    fetchBoothData();
  }, [formData.booth]);

  const fetchBoothData = async () => {
    if (formData.booth) {
      try {
        const response = await axios.get(
          `http://43.205.136.100:5000/api/ac/get-acdata-by-booth/${formData.booth}`
        );
        setBoothData(response.data);
      } catch (error) {
        console.error("Error fetching booth data:", error);
      }
    }
  };

  const handleTimeSlotChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      timeSlot: value,
    }));
    fetchBoothData();
  };

  const availableSlots2 = [
    "09:00AM",
    "11:00AM",
    "01:00PM",
    "03:00PM",
    "05:00PM",
    "07:00PM",
    "09:00PM",
  ];

  return (
    <div className="main-class">
      <div className="data-container">
        <h2>Booth Dashboard</h2>
        <div className="main-ac-container">
          <h2>
            Welcome!! {userEmail && userEmail.split("@")[0].toUpperCase()}
          </h2>
          <div>
            <select
              name="ac"
              value={selectedAc}
              onChange={handleAcChange}
              className="input-fields"
            >
              <option value="" >Select AC</option>
              {userRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form className="data-form" onSubmit={handleSubmit}>
          <div>
            <select
              name="booth"
              value={formData.booth}
              onChange={handleChange}
              className="input-fields"
            >
              <option value="">Select Booth</option>
              {booths.map((booth, index) => (
                <option key={index} value={booth}>
                  {booth}
                </option>
              ))}
            </select>
          </div>
          <div className="fields-div">
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleTimeSlotChange}
              className="input-fields"
            >
              <option value="">Select Time Slot</option>
              {availableSlots2.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="polledVotes"
              className="input-fields"
              placeholder="Total Votes"
              value={formData.polledVotes}
              onChange={handleChange}
            />
            <input
              type="text"
              name="favVotes"
              className="input-fields"
              placeholder="Party Votes"
              value={formData.favVotes}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="display-data2">
        <div className="display-data">
          <table>
            <thead>
              <tr>
                <th>Booth</th>
                <th>Total Votes</th>
                <th>AC Incharge Name</th>
                <th>AC Incharge Contact</th>
                <th>Booth Incharge Name</th>
                <th>Booth Incharge Contact</th>
              </tr>
            </thead>
            <tbody>
              {boothData.map((data, index) => (
                <tr key={index}>
                  <td>{data.booth}</td>
                  <td>{data.totalVotes}</td>
                  <td>{data.acInchargeName}</td>
                  <td>{data.acInchargeContact}</td>
                  <td>
                    {data.boothInchargeName.map((incharge, i) => (
                      <div key={i}>{incharge.name}</div>
                    ))}
                  </td>
                  <td>
                    {data.boothInchargeName.map((incharge, i) => (
                      <div key={i}>{incharge.contact}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="display-data">
        {formData.booth && <BoothDataDisplay booth={formData.booth} />}
      </div>
    </div>
  );
};

export default CreateBoothForm;
