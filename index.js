const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/get", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: "Thiếu URL video TikTok" });
  }

  try {
    const lookupRes = await fetch(`https://tikmate.online/api/lookup?url=${encodeURIComponent(videoUrl)}`);
    const text = await lookupRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({ error: "Lỗi server", detail: "Phản hồi không phải JSON từ TikMate", raw: text });
    }

    if (!data.token || !data.id) {
      return res.status(400).json({ error: "Không lấy được video từ TikMate", data });
    }

    const videoDownloadUrl = `https://tikmate.online/download/${data.token}/${data.id}.mp4`;

    return res.status(200).json({ videoUrl: videoDownloadUrl });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi server", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
