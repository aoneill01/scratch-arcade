import {By, Builder, until} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseApiUrl = 'https://api.scratch.mit.edu';
const baseSiteUrl = 'https://scratch.mit.edu';

async function downloadProject(projectId) {
    const projectsDir = path.join(__dirname, 'public', 'games');
    const projectDir = path.join(projectsDir, `${projectId}`);

    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir);
    }

    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir);
    }

    const response = await fetch(`${baseApiUrl}/projects/${projectId}`);
    const json = await response.json();
    fs.writeFileSync(path.join(projectDir, 'project.json'), JSON.stringify(json, null, 2));

    const imageResponse = await fetch(json.image);
    const buffer = await imageResponse.arrayBuffer();
    fs.writeFileSync(path.join(projectDir, 'image.png'), Buffer.from(buffer));

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().setUserPreferences(
            { "download.default_directory": projectDir }
        ))
        .build();
    
    try {
        await driver.get(`${baseSiteUrl}/projects/${projectId}/editor/`);
        
        const file = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class, "menu-bar_menu-bar-item")]//*[text()="File"]')));
        await driver.wait(async (d) => (await d.findElements(By.xpath('//*[contains(@class, "loader_background")]'))).length === 0);

        await file.click();
        const save = await driver.findElement(By.xpath('//*[text()="Save to your computer"]'));
        await save.click();

        await new Promise((resolve) => setTimeout(resolve, 5000));
    } finally {
        await driver.quit();
    }
}

async function downloadStudio(studioId) {
    const response = await fetch(`${baseApiUrl}/studios/${studioId}/projects/?limit=24&offset=0`);
    const projects = await response.json();

    for (const project of projects) {
        try {
            await downloadProject(project.id);
        } catch (err) {
            console.error(project, err);
        }
    }
}

if (process.argv.length < 3) {
    console.error('Expected at least one argument!');
    process.exit(1);
}

downloadProject(process.argv[2]);
