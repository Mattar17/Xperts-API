function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY)
    return res.status(403).json({
      status: "error",
      message: "Forbidden: api key is required or invalid",
    });
  next();
}

module.exports = validateApiKey;
