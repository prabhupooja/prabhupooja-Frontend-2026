import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./chathistoryusers.css";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import moment from 'moment';

const Chathistoryusers = () => {
  const navigate = useNavigate();
  const { pandit } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const location = useLocation();
  const { type } = location.state || "";
  console.log(type, pandit?.id);
  useEffect(() => {
    if (pandit?.id) {
      const fetchRequests = async () => {
        try 
        {
          const response = await api.get(`/request/showforpandit/${pandit?.id}/${type}`);
          console.log(response.data, 'fgdgdgfdg')
          setRequests(response.data.data);
        } catch (err) {
          console.log('Failed to load requests', err);
        }
      };

      fetchRequests();
    }

  }, [pandit?.id]);

  const handleNavigation = (data,name,date) => {
    navigate('/chathistory', {
      state: { requestId: data, userName: name,date:date }
    });
  };


  return (
    <>
      <div className="chathistory_section">
        <div className="container">
          <h1 className="title">User Name</h1>
          {requests.length === 0 ? (
            <p>No requests available</p>
          ) : (
            requests.map((request, index) => (
              <>
                <p className="userName">{moment(request.updated_at).format('DD/MM/YYYY hh:mm A')}</p>  
              <div key={index} className="chatContainer">
                <button
                  className="userCard"
                  onClick={() =>
                    handleNavigation(
                      request.request_id,
                      request.user_name,
                      request.updated_at
                    )
                  }
                >
                  <span className="userName">{request.user_name}</span>
                </button>
              </div>
              </>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Chathistoryusers;
