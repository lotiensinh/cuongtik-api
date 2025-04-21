const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/get", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Thiếu URL" });

  try {
    const cleanUrl = url.split("?")[0];
    const api = `https://api.tikmate.app/api/lookup?url=${encodeURIComponent(cleanUrl)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (data?.token && data?.id) {
      const videoUrl = `https://tikmate.app/download/${data.token}/${data.id}.mp4`;
      res.json({ video_url: videoUrl });
    } else {
      res.status(400).json({ error: "Không lấy được video", data });
    }
  } catch (err) {
    res.status(500).json({ error: "Lỗi server", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
