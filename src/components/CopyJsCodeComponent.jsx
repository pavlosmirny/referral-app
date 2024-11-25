import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BASE_URL } from "../service/baseUrl";
import "./CopyJsCodeComponent.css";

const CopyCodeComponent = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState("javascript");

  // Устанавливаем значение по умолчанию для user
  const userValue = user && user.id ? user.id : "your_username_here";

  const jsCode = `
  const makeRequest = () => {
    fetch('${BASE_URL}users/apiKey/${userValue}', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey: 'newApiKeyValue' })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from API:', data);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', error);
      });
  };

  makeRequest();
  `;

  const reactCode = `
  import React from 'react';

  const App = () => {
    const makeRequest = () => {
      fetch('${BASE_URL}apiKey/${userValue}', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: 'newApiKeyValue' })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response from API:', data);
        })
        .catch(error => {
          console.error('Ошибка при запросе:', error);
        });
    };

    return (
      <div>
        <button onClick={makeRequest} style={{ marginLeft: '10px' }}>Click me</button>
      </div>
    );
  };

  export default App;
  `;

  const handleCopy = () => {
    const codeToCopy = selectedOption === "javascript" ? jsCode : reactCode;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Ошибка при копировании: ", err);
      });
  };

  return (
    <div className="wrapperCode">
      <h3 className="title">Select the type of code to copy:</h3>
      <div className="buttonContainer">
        <div>
          <label>
            <input
              type="radio"
              name="codeType"
              value="javascript"
              checked={selectedOption === "javascript"}
              onChange={() => setSelectedOption("javascript")}
            />
            JavaScript
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="codeType"
              value="react"
              checked={selectedOption === "react"}
              onChange={() => setSelectedOption("react")}
            />
            React
          </label>
        </div>
        <button onClick={handleCopy} className="buttonCopy">
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      <SyntaxHighlighter
        language={selectedOption === "javascript" ? "javascript" : "jsx"}
        style={darcula}
        customStyle={{ borderRadius: "5px", padding: "10px" }}
      >
        {selectedOption === "javascript" ? jsCode : reactCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CopyCodeComponent;
