import { create } from "zustand";
import { socket } from "../../Axios/soketpandit.js";
import api from "../../Axios/api.js";


const useSokectStore = create((set) => ({

    connectPandit: (pandit_id) => {
        const soket = ()=>{}
        console.log(pandit_id)
        if (!socket.connect) {
            socket.connect();
            console.log("websocket connected")
        }
        socket.off(`pandit is online ${pandit_id}`);
        socket.on("connect", () => {
            console.log("conneted to web socket")
        })
    },

    disconnectPandit: () => {
        const soket = ()=>{}
    socket.disconnect();
  },

  panditOnline : async(payload)=>{
      const soket = ()=>{}
    console.log(payload)
    try {
        const response= await api.post('/pandit/panditOnline',payload);
        return response;
    } catch (error) {
        console.log(error);
        throw error
    }

  }
}));

export default useSokectStore;
