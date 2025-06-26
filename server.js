
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/flirt', async (req, res) => {
  try {
    const userMessage = req.body.message || '';

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `אתה בוט עוזר לגבר לענות בצורה מושכת, שנונה, לא מתאמצת ולא מתחנפת לשיחה עם בחורה. תן 3 תגובות קצרות, כל אחת בשורה חדשה.`,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.85,
    });

    const botReply = completion.data.choices[0].message.content;
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
