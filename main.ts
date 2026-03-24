import {chromium, Page, Browser} from 'playwright';
import * as scrape from './scraping-elements';
import fs from 'fs';

const username = '/' + 'mukhitkwo';
const githubURL: string = 'https://github.com';
const logValues: boolean = false;
const headless: boolean = false;

export function logValue(message: string | number) 
{
    if (logValues) 
    {
        console.log(message);
    }
}

async function main() 
{
    const url = githubURL + username + '?tab=repositories';

    try 
    {
        const browser = await chromium.launch({
            headless: headless
        });

        const page = await openPage(browser, url);

        const repoLinks = await getRepoLinks(page);

        const data = await getAllReposData(page, repoLinks);

        fs.writeFileSync('output.json', JSON.stringify(data, null, 4), 'utf-8');

        await browser.close();
    }
    catch (error) 
    {
        logValue(error as string);
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

        console.log('Browser\'s page found');

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

            repoLinks.push(githubURL + href);
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

        const repoData = await getRepoData(page);

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
    about: string | null;
    languages: Record<string, number>;
    stars: number;
    forks: number;
    lastUpdate: string;
    readme: string;
}

async function getRepoData(page: Page) 
{
    const mainPanel = page.locator('div.prc-PageLayout-ContentWrapper-gR9eG');
    const sidePanel = page.locator('div.prc-PageLayout-PaneWrapper-pHPop.pr-2');

    if (await sidePanel.isHidden()) 
    {
        return null;
    }

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

    const repoData: RepoData = {about, languages, stars, forks, lastUpdate, readme};

    return repoData;
}

main();
