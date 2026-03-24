import {Locator} from 'playwright';

export async function getAbout(panel: Locator) 
{
    const aboutLocator = panel.locator('p.f4.tmp-my-3');

    if (await aboutLocator.isVisible()) 
    {
        return await aboutLocator.innerText();
    }

    return null;
}

export async function getLanguages(panel: Locator) 
{
    const languages = await panel.locator('ul.list-style-none').last().innerText();
    const lang = languages.split('\n').filter((lang) => 
    {
        if (lang.trim() !== '') 
        {
            return lang;
        }
    });

    const cleanedLanguages = lang.map((value) => 
    {
        const cleaned = value.replace('%', '');
        return isNaN(Number(cleaned)) ? value : Number(cleaned);
    });

    const finalLanguages: Record<string, number> = {};

    for (let index = 0; index < cleanedLanguages.length; index++) 
    {
        const value = cleanedLanguages[index];

        if (typeof value === 'number') 
        {
            finalLanguages[lang[index - 1]] = value;
        }
    }

    return finalLanguages;
}

export async function getStars(panel: Locator) 
{
    const stars = await panel.locator('a[href*="/stargazers"] strong').innerText();

    if (stars.includes('k') && stars.includes('.')) 
    {
        const starNumeric = stars.replace('k', '00').replace('.', '');
        return Number(starNumeric); //4.3k -> 4300
    }

    if (stars.includes('k')) 
    {
        const starNumeric = stars.replace('k', '000');
        return Number(starNumeric); //223k -> 223000
    }

    return Number(stars);
}

export async function getForks(panel: Locator) 
{
    const forks = await panel.locator('a[href*="/forks"] strong').innerText();

    if (forks.includes('k') && forks.includes('.')) 
    {
        const forksNumeric = forks.replace('k', '00').replace('.', '');
        return Number(forksNumeric); //4.3k -> 4300
    }

    if (forks.includes('k')) 
    {
        const forksNumeric = forks.replace('k', '000');
        return Number(forksNumeric); //223k -> 223000
    }

    return Number(forks);
}

export async function getREADME(panel: Locator) 
{
    const about = await panel.locator('div.Box-sc-62in7e-0').last().innerText();
    return about;
}

export async function getLastUpdate(panel: Locator) 
{
    const about = await panel.locator('relative-time').last().getAttribute('title');
    return about || '';
}
