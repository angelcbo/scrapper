const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const baseUrl = 'https://drugs.com';

const dosagesArray = [];
const MAX_SCRAPING: number = 2;
let count: number = 0;
const LETTER_A_ASCII = 97;
const LETTER_Z_ASCII = 122;
let paths: string[] = [];
let mainPath = '/alpha/';

(function initPaths() {
    for (let i = LETTER_A_ASCII; i <= LETTER_Z_ASCII; i++) {
        for (let j = LETTER_A_ASCII; j <= LETTER_Z_ASCII; j++) {
            paths.push(`${mainPath}${String.fromCharCode(i)}${String.fromCharCode(j)}.html`)
        }
    }
})();

console.log('Starting Scraping...');
(async function initi() {
    scrapeSite('/drug_information.html');
    // scrapeSite('/abilify.html');
})();


async function scrapeSite(this: any, url: any) {

    console.log(count);
    console.log(MAX_SCRAPING);
    console.log(`SCRAPESITE: ${url}`);
    if (count === MAX_SCRAPING)
        process.exit();

    try {
        const baseSite = await getSite(url);
        if (baseSite.includes('NOT FOUND')) {
            console.log(baseSite)
            return;
        }


        const dosage = getDosage(baseSite);
        if (dosage) {
            console.log('Dossage found')
            writeDosage(url, dosage);
            count++;
        }
        let sites = crawlSite(url, baseSite);
        console.log('Sites before filter');
        console.log(sites);

        sites = sites.filter(isNotRoot);
        console.log('Sites after filter');
        console.log(sites);
        sites.forEach(async (newSite: any) => {
            await sleep();
            await scrapeSite(newSite)
        });
    }
    catch (e) {
        console.log(e)
    }
}

function isNotRoot(this: any, site: string) {
    return paths.filter((path: string) => site.includes(path)).length ? true : false;
}

async function getSite(this:any, url: any) {
    console.log('Getting site')
    await sleep();
    const newUrl = getUrl(url);
    console.log(`**********************************`);
    console.log(`URL ${newUrl}`);
    console.log(`**********************************`);
    return axios(newUrl)
        .then((response: any) => response.data)
        .catch((error: any) => `${newUrl} NOT FOUND`);
}

function crawlSite(url: string, site: any) {
    console.log(`Crawling site ... ${url}`);
    const $ = cheerio.load(site);
    return $('a').map((i: any, atags: any) => atags.attribs.href).get();
}

function timeout(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(this:any) {
    await timeout(2000);
    console.log('Sleeping')
}

function getUrl(url: string) {
    console.log('Getting Url')
    if (url.includes('http'))
        return url;
    return `${baseUrl}${url}`;
}



function writeDosage(path: string, dosage: string) {
    console.log('Writting dosage')
    console.log(dosage);
    fs.writeFile(`./scraped_files${path}.txt`, dosage, (err: any) => console.log(err));

}

function getDosage(site: any) {
    const elementId = '#dosage';
    const $ = cheerio.load(site);
    const dosageHeader = $(elementId);

    if (dosageHeader.length === 0)
        return;
    const dosageHeaderText = dosageHeader.text();
    console.log(`Getting Dosage Header ...${dosageHeaderText}`);
    dosagesArray.push(dosageHeaderText)
    const result = getDosagesParagraph(dosageHeader);
    console.log('Results');
    console.log(result)
    return result;
}

function getDosagesParagraph(element: any): string {
    console.log(`Getting Dosages Paragraph of ... ${element}`)

    const nextElement = element.next();
    const elementType = nextElement[0].name;

    if (elementType != 'p')
        return '';

    return `${nextElement.text()}\n${getDosagesParagraph(nextElement)}`;

}

module.exports = {
    getUrl,
    isNotRoot,
    getSite,
    getDosage,
};