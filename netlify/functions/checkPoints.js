const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  try {
    const url = event.queryStringParameters.url;

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Profile URL required" })
      };
    }

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);

    let gameBadges = 0;
    let skillBadges = 0;

    $("h3").each((i, el) => {
      const text = $(el).text().toLowerCase();

      if (text.includes("arcade") || text.includes("trivia") || text.includes("sprint")) {
        gameBadges++;
      }

      if (text.includes("skill badge")) {
        skillBadges++;
      }
    });

    const totalPoints = gameBadges + Math.floor(skillBadges / 2);

    return {
      statusCode: 200,
      body: JSON.stringify({
        game_badges: gameBadges,
        skill_badges: skillBadges,
        total_points: totalPoints
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch profile" })
    };
  }
};