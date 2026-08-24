import React, { useEffect, useState } from "react";
import { FaPrayingHands } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import "./home.css";
import { useNavigate } from "react-router-dom";
import api from "../Axios/api";
import useAuthStore from "../Store/AuthStore/AuthStore";

function Home() {
  const token = localStorage.getItem('Pandittoken');
  const navigate = useNavigate();
  const { pandit, panditGet } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Total Pooja");


  useEffect(() => {
    userFetch();
  }, []);

  const userFetch = async () => {
    if (!token) {
      navigate('/')
    } else {
      await panditGet();
    }
  }


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let type = 'chat';
        const response = await api.get(`/request/showforpandit/${pandit?.id}/${type}`);
        setRequests(response.data.data);
      } catch (err) {
        console.log('Failed to load requests');
      }
    };

    fetchRequests();
  }, [pandit?.id]);

  const filteredRequests = requests.filter(
    (req) => req.category === selectedCategory
  );



  if (!token) {
    navigate('/')
  } else {
    return (
      <>
        <div className="admin_dashboard">
          <div className="admin_homepage">
            <div className="admin_home">
              <div className="dashboard_cards">
                <div
                  className="card"
                  onClick={() => setSelectedCategory("Total Pooja")}
                >
                  <div className="card_content">
                    <div className="card_icon">
                      <FaPrayingHands className="pandit_icon" />
                    </div>
                    <div className="card_info">
                      <h4>Total Pooja</h4>
                      <p>
                        {
                          requests.filter((req) => req.category === "Total Pooja")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                  <span className="growth positive">2.3% Last Week</span>
                </div>

                <div
                  className="card"
                  onClick={() => setSelectedCategory("Total Chats")}
                >
                  <div className="card_content">
                    <div className="card_icon">
                      <IoChatbox className="pandit_icon" />
                    </div>
                    <div className="card_info">
                      <h4>Total Chats</h4>
                      <p>
                        {
                          requests.filter((req) => req.category === "Total Chats")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                  <span className="growth positive">0% Last Month</span>
                </div>

                <div
                  className="card"
                  onClick={() => setSelectedCategory("Total Earning")}
                >
                  <div className="card_content">
                    <div className="card_icon">
                      <GiReceiveMoney className="pandit_icon" />
                    </div>
                    <div className="card_info">
                      <h4>Total Earning</h4>
                      <p>0</p>
                    </div>
                  </div>
                  <span className="growth negative">0% Last Month</span>
                </div>

                <div
                  className="card"
                  onClick={() => setSelectedCategory("Wallet")}
                >
                  <div className="card_content">
                    <div className="card_icon">
                      <RiMoneyRupeeCircleLine className="pandit_icon" />
                    </div>
                    <div className="card_info">
                      <h4>Wallet</h4>
                      <p>₹0</p>
                    </div>
                  </div>
                  <span className="growth negative">0% Last Month</span>
                </div>
              </div>

              <div className="recent-orders">
                <div className="create_orderbox">
                  <h2 className="orders_title">
                    Recent Request - {selectedCategory}
                  </h2>
                </div>
                <div className="table-container">
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Date & Time</th>
                        <th>Place of Birth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((req, index) => (
                          <tr key={index}>
                            <td>{req.id}</td>
                            <td className="customer-name">{req.Name}</td>
                            <td>{req.Status}</td>
                            <td>{req.Gender}</td>
                            <td>{req.DOB}</td>
                            <td>{req.DT}</td>
                            <td>{req.POB}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center" }}>
                            No Requests Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

}

export default Home;
