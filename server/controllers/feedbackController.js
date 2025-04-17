const db = require('../models/db');
const axios = require('axios');

exports.submitFeedback = async (req, res) => {
  const { message } = req.body;

  try {
    // Hugging Face Sentiment Analysis
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`
        }
      }
    );

    const sentiment = response.data[0][0].label;
    console.log(response.data);
    

    // Save to MySQL
    db.query(
      'INSERT INTO feedback (message, sentiment) VALUES (?, ?)',
      [message, sentiment],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ id: result.insertId, sentiment });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
};

exports.getAllFeedback = (req, res) => {
  db.query('SELECT * FROM feedback ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
