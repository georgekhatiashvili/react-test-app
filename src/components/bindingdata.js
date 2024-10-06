import React, { useState } from 'react';

function TextInputExample() {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>React Data Binding Example</h2>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Type something..."
        style={{ padding: '8px', fontSize: '16px', width: '300px' }}
      />
      <p style={{ marginTop: '20px', fontSize: '18px' }}>
        You typed: <strong>{text}</strong>
      </p>
    </div>
  );
}

export default TextInputExample;
