
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/flirt', async (req, res) => {
  try {
    const userMessage = req.body.message || '';

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'אתה בוט עוזר לגבר לענות בצורה מושכת, שנונה, לא מתאמצת ולא מתחנפת לשיחה עם בחורה. תן 3 תגובות קצרות, כל אחת בשורה חדשה.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.85,
    });

    const botReply = chatCompletion.choices[0].message.content;
    res.json({ reply: botReply });

  } catch (err) {
    console.error('שגיאה:', err.message);
    res.status(500).json({ reply: 'שגיאה בשרת: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FlirtBot server running on port ${PORT}`);
});
