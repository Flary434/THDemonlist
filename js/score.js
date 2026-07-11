// Original TSL template formula
/*
  Numbers of decimal digits to round to
  /
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}

    export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // Old formula
    /*
    let score = (100 / Math.sqrt((rank - 1) / 50 + 0.444444) - 50) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    */
    // New formula
    /*
    let score = (-24.9975*Math.pow(rank-1, 0.4) + 200) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    score = Math.max(0, score);

    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}
*/
    // Formula based of what GDTH Demonlist uses

const TIER_POINTS = {
    "Beginner": 10,
    "Easy": 20,
    "Medium": 30,
    "Hard": 50,
    "Very Hard": 75,
    "Insane": 100,
    "Extreme": 150,
    "Remorseless": 200,
    "Relentless": 275,
    "Terrifying": 350,
    "Catastrophic": 450,
    "Inexorable": 575,
    "Excruciating": 700,
};

/**
 * Calculates the score for a level based on its NLW Tier
 * @param {string} tier - Tier of the levels
 * @returns {number} The points awarded for that tier
 */
export function score(tier) {
    return TIER_POINTS[tier] || 0;
}

export function round(num) {
    let ret = Number(Math.round(num + "e3") + "e-3");
    return ret < 0 ? 0 : ret;
}
