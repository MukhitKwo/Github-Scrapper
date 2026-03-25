import {chromium, Page, Browser} from 'playwright';
import * as scrape from './scraping-elements';
import fs from 'fs';

const GITHUB_URL: string = 'https://github.com';
const LOGVALUES: boolean = false;
const headless: boolean = false;

export function logValue(message: string | number) 
{
    if (LOGVALUES)
    {
        console.log(message);
    }
}

async function scrapeGithub(username: string) 
{
    const url = GITHUB_URL + ('/' + username) + '?tab=repositories';

    try 
    {
        const browser = await chromium.launch({
            HEADLESS: headless
        });

        const page = await openPage(browser, url);

        const repoLinks = await getRepoLinks(page);

        const data = await getAllReposData(page, repoLinks);

        fs.writeFileSync('scrapeData.json', JSON.stringify(data, null, 4), 'utf-8');
        
        await browser.close();

        return data;
    }
    catch (error) 
    {
        console.log(error as string);
    }
}

async function openPage(browser: Browser , url: string) 
{
    try 
    {
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle'
        });

        console.log('Github page opened');

        return page;
    }
    catch (error) 
    {
        throw new Error('Failed to open browser page: ', {cause: error});
    }
}

async function getRepoLinks(page: Page) 
{
    try 
    {
        const repoList = page.locator('div#user-repositories-list ul');
        const repoAmount = await repoList.locator('li').count();

        const repoLinks: string[] = [];

        for (let index = 0; index < repoAmount; index++) 
        {
            const repo = repoList.locator('li').nth(index);
            const href = await repo.locator('a').first().getAttribute('href');

            repoLinks.push(GITHUB_URL + href);
        }

        console.log(repoAmount + ' repository links obtained');

        return repoLinks;
    }
    catch (error) 
    {
        throw new Error('Failed to get repo links: ' , {cause: error});
    }
}

async function getAllReposData(page: Page, repoLinks: string[]) 
{
    const allReposData = [];

    for (let index = 0; index < repoLinks.length; index++) 
    {
        const repoLink = repoLinks[index];
        await page.goto(repoLink);

        console.log('Scrapping ' + repoLink + ':');
        
        await page.waitForLoadState('load');
        
        const repoName: string = repoLink.split('/').pop()!;
        logValue(repoName);

        const repoData = await getRepoData(page, repoName);

        if (repoData) 
        {
            allReposData.push(repoData);
            console.log('Data scrapped!');
        }
        else 
        {
            console.log('Data not found!');
        }
    }

    return allReposData;
}

interface RepoData {
    name: string;
    about: string | null;
    languages: Record<string, number>;
    stars: number;
    forks: number;
    lastUpdate: string;
    readme: string;
}

async function getRepoData(page: Page, name: string) 
{
    const mainPanel = page.locator('div.prc-PageLayout-ContentWrapper-gR9eG');
    const sidePanel = page.locator('div.prc-PageLayout-PaneWrapper-pHPop.pr-2');

    if (await sidePanel.isHidden()) 
    {
        return null;
    }

    logValue(`Name: ${name}`);

    const about = await scrape.getAbout(mainPanel);
    logValue(`About: ${about}`);

    const languages = await scrape.getLanguages(sidePanel);
    logValue(`Languages: ${JSON.stringify(languages, null, 2)}`);

    const stars = await scrape.getStars(sidePanel);
    logValue(`Stars: ${stars}`);

    const forks = await scrape.getForks(sidePanel);
    logValue(`Forks: ${forks}`);

    const readme = await scrape.getREADME(mainPanel);
    logValue(`README: ${readme}`);

    const lastUpdate = await scrape.getLastUpdate(mainPanel);
    logValue(`Last Update: ${lastUpdate}`);

    const repoData: RepoData = {name, about, languages, stars, forks, lastUpdate, readme};

    return repoData;
}

const args: string[] = process.argv.slice(2);
let username: string = 'MukhitKwo';

if (args.length > 0)
{
    username = args[0].replace('--', '');
}

scrapeGithub(username);
