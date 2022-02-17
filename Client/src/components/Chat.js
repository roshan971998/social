import React, { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
import "../chat.css";
// import { to_Decrypt, to_Encrypt } from "./aes.js";
import * as $ from "jquery";
import { io } from "socket.io-client";
import { connect } from "react-redux";

let socket = io.connect("http://localhost:5000");

function Chat(props) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [roomname, setRoomname] = useState("codial");
  const [username, setUsername] = useState(props.user.name);
  //const useremail = props.user.email;

  useEffect(() => {
    $(".chat-messages").hide();
    $(".chat-footer").hide();
    $(".chat-header").addClass("stick-to-bottom");
    socket.emit("joinRoom", {
      username,
      roomname,
    });
  }, []);

  // const dispatch = useDispatch();

  // const dispatchProcess = (encrypt, msg, cipher) => {
  //   dispatch(process(encrypt, msg, cipher));
  // };

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      // const ans = to_Decrypt(data.text, data.username);
      // dispatchProcess(false, ans, data.text);
      console.log("ans is ", data.text);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: data.text,
      });
      setMessages([...temp]);
    });
  }, [messages]);

  const sendData = () => {
    if (text) {
      //encrypt here
      // const ans = to_Encrypt(text);
      socket.emit("chat", text);
      setText("");
    }
  };

  const handleMinimize = () => {
    if (isMinimized) {
      $(".chat-messages").hide();
      $(".chat-footer").hide();
      $(".chat-header").addClass("stick-to-bottom");
      setIsMinimized(false);
    } else {
      $(".chat-messages").show();
      $(".chat-footer").show();
      $(".chat-header").removeClass("stick-to-bottom");
      setIsMinimized(true);
    }
  };

  // const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(scrollToBottom, [messages]);

  //console.log(messages, "mess");
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4>
          {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
        </h4>
        <img
          src="https://cdn-icons-png.flaticon.com/512/786/786465.png"
          alt=""
          height={17}
          onClick={handleMinimize}
        />
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            className={
              message.username === username
                ? "chat-bubble self-chat"
                : "chat-bubble other-chat"
            }
            key={index}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          placeholder="enter your message"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        />
        <button type="button" className="btn btn-success" onClick={sendData}>
          Send
        </button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { user: state.auth.user };
}

export default connect(mapStateToProps)(Chat);
