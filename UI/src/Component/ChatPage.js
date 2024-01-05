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

    const updatedMessages = [...messages, { text: newMessage, sender: "user" }];
    setMessages(updatedMessages);
    setNewMessage("");
    setMessages([...updatedMessages, { text: "Typing...", sender: "server" }]);
    scrollToTop();

    try {
      const formData = new FormData();
      formData.append("chatMessage", newMessage);
      const response = await axios.post("/api/chat", formData);
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
    <section className="bg-light w-100 vh-100 m-0">
      <div className="w-100 vh-100">
        <div className="w-100 h-100">
          <div className="w-100 h-100 col-md-8 col-lg-6 col-xl-4">
            <div className="card w-100 h-100 d-flex">
              <div
                className="card-header d-flex align-items-center p-2  text-white border-bottom-0"
                style={{ background: "#7F00FF", height: "5vh" }}
              >
                <div className="w-100 text-center">
                  <p className="mb-0 fw-bold ">FirstAid ChatBot</p>
                </div>
              </div>
              <div
                className="w-100 d-flex flex-row justify-content-between"
                style={{ height: "95vh" }}
              >
                <div className="w-100 h-100">
                  <div
                    className="card p-5 w-100 border-0"
                    style={{ overflowY: "scroll", height: "92%" }}
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
                  <div className="w-100 border rounded-pill">
                    <div className="w-100 d-flex">
                        <input
                          type="text"
                          style={{
                            resize: "none",
                            outline: "none",
                            width: "95%",
                          }}
                          className=" border-0 ps-3 py-3  ms-3 bg-transparent "
                          id="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e)}
                          placeholder="Type your message..."
                        ></input>
                        <div>
                          <button
                            className="btn mt-2 px-3 me-3 text-white"
                            style={{ backgroundColor: "#7F00FF" }}
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
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
