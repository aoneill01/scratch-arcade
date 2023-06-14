import fs from 'fs';
import path from 'path';

async function run() {
    const results = [];

    const gamesDir = path.join('public', 'games');

    const files = fs.readdirSync(gamesDir, { withFileTypes: true });
    for (const dir of files) {
        if (!dir.isDirectory()) continue;

        let sb3;
        const gameDir = path.join(gamesDir, dir.name);
        for (const file of fs.readdirSync(gameDir)) {
            if (file.endsWith('.sb3')) {
                sb3 = file;
                break;
            }
        }
        const json = JSON.parse(fs.readFileSync(path.join(gameDir, 'project.json')));

        results.push({
            id: dir.name,
            title: json.title,
            instructions: json.instructions,
            notes: json.description,
            author: json.author.username,
            sb3: `games/${dir.name}/${sb3}`,
            image: `games/${dir.name}/image.png`,
            controls: json.controls
        });
    }

    results.sort((a, b) => a.title.localeCompare(b.title));

    fs.writeFileSync(path.join(gamesDir, 'manifest.json'), JSON.stringify(results, null, 2));
}

run();
