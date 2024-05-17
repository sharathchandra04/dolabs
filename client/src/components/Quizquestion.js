import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Single question component
const QuestionComponent = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit({ question, answer });
    // setAnswer('');
  };

  return (
    <div>
      <div>{question}</div>
      <TextField
        variant="outlined"
        value={answer}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default QuestionComponent;