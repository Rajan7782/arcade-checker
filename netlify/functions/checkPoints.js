const axios = require("axios");

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
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = response.data.toLowerCase();

    // Count occurrences using text search
    const gameMatches = html.match(/arcade|trivia|sprint/g) || [];
    const skillMatches = html.match(/skill badge/g) || [];

    const gameBadges = gameMatches.length;
    const skillBadges = skillMatches.length;

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
