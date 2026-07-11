import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            // Safely sort records. If percent is missing, assume it's 100.
                            records: level.records.sort(
                                (a, b) => (b.percent !== undefined ? b.percent : 100) - (a.percent !== undefined ? a.percent : 100),
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification (Check for verifier OR first_victor)
        const verifierName = level.verifier || level.first_victor || "";
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === verifierName.toLowerCase(),
        ) || verifierName;

        if (verifier) {
            scoreMap[verifier] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { verified } = scoreMap[verifier];
            verified.push({
                rank: rank + 1,
                level: level.name,
                score: score(level.nlw_tier),
                link: level.verification,
            });
        }

        // Records (Completions)
        if (level.records) {
            level.records.forEach((record) => {
                // Skip if the user is the first victor to avoid duplicate points
                if (verifierName && record.user.toLowerCase() === verifierName.toLowerCase()) {
                    return;
                }

                // If a percent is specified and it's less than 100, skip it!
                if (record.percent !== undefined && record.percent < 100) {
                    return;
                }

                // Find the user case-insensitively
                const user = Object.keys(scoreMap).find(
                    (u) => u.toLowerCase() === record.user.toLowerCase(),
                ) || record.user;
                
                scoreMap[user] ??= {
                    verified: [],
                    completed: [],
                    progressed: [],
                };
                
                const { completed } = scoreMap[user];
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(level.nlw_tier),
                    link: record.link,
                });
            });
        }
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}