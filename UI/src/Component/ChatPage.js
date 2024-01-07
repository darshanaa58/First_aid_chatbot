import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { text: "Hello user! How can I help you today?", sender: "server" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef();

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:8000', // Change the port as needed
    });
    const updatedMessages = [...messages, { text: newMessage, sender: "user" }];
    setMessages(updatedMessages);
    setNewMessage("");
    setMessages([...updatedMessages, { text: "Typing...", sender: "server" }]);
    scrollToTop();
    try {
      const response = await axiosInstance(`/chatbot?ques=${encodeURIComponent(newMessage)}`);
      const serverResponse = { text: response.data, sender: "server" };
      setMessages([...updatedMessages, serverResponse]);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setMessages([
          ...updatedMessages,
          { text: "Error while processing your request!", sender: "server" },
        ]);
      } else if (error.response && error.response.status === 400) {
        setMessages([
          ...updatedMessages,
          { text: "Error while processing your request!", sender: "server" },
        ]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToTop = () => {
    chatContainerRef.current.scrollTop = 0;
  };

  return (
    <section className="w-100 vh-100 m-0">
      <div className="container w-100 vh-100">
        <div className="w-100 h-100">
          <div className="w-100 h-100 ">
            <div className="w-100 h-100 border-start border-end position-relative">
              <div
                className="w-100 d-flex align-items-center top-0 p-2 text-white"
                style={{ background: "#7F00FF", height: "8%" }}
              >
                <div className="w-100 text-center">
                  <p className="mb-0 fw-bold ">FirstAid ChatBot</p>
                </div>
              </div>
              <div
                className="w-100 d-flex flex-row justify-content-between"
                style={{ height: "84%" }}
              >
                <div className="w-100 h-100">
                  <div
                    className="card p-5 w-100 border-0"
                    style={{ overflowY: "scroll", height: "100%" }}
                    ref={chatContainerRef}
                  >
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`d-flex flex-row justify-content-${
                          message.sender === "user" ? "end" : "start"
                        } mb-4`}
                      >
                        {message.sender === "server" ? (
                          <>
                            <img
                              src="https://chatgpt.fr/wp-content/uploads/2023/05/Logo-1.svg"
                              alt="avatar 1"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <div
                              className={`p-3 ms-2 ${
                                message.sender === "user" ? "border" : ""
                              }`}
                              style={{
                                borderRadius: "15px",
                                backgroundColor:
                                  message.sender === "user"
                                    ? "#7F00FF"
                                    : "#f4f4f4",
                                color:
                                  message.sender === "user" ? "#FFF" : "black",
                              }}
                            >
                              <p className="small mb-0">{message.text}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className={`p-3 me-2 ${
                                message.sender === "user" ? "border" : ""
                              } `}
                              style={{
                                borderRadius: "15px",
                                backgroundColor:
                                  message.sender === "user"
                                    ? "#7F00FF"
                                    : "#f4f4f4",
                                color:
                                  message.sender === "user" ? "#FFF" : "black",
                              }}
                            >
                              <p className="small mb-0">{message.text}</p>
                            </div>
                            <img
                              src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                              alt="avatar 2"
                              style={{ width: "55px", height: "55px" }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{ background: "#7F00FF", height: "8%" }}
                className="w-100 position-absolute bottom-0 d-flex align-items-center"
              >
                <div className="w-75 mx-auto d-flex align-items-center h-75">
                  <div className="w-100 h-100 d-flex align-items-center rounded-pill bg-light">
                    <input
                      type="text"
                      style={{
                        resize: "none",
                        outline: "none",
                        width: "95%",
                      }}
                      className=" border-0 ps-3 ms-3 bg-transparent "
                      id="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      placeholder="Type your message..."
                    ></input>
                    
                  </div>
                  <div>
                      <button
                        className="btn px-3 fs-5 text-white"
                        
                        onClick={handleSendMessage}
                      >
                        Send
                      </button>
                    </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
