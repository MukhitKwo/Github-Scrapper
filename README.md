# GitHub Repository Scraper

A TypeScript tool using Playwright to extract data from a GitHub user's public repositories and save it as a structured JSON file.

---

## Features

* **Repository Discovery:** Crawls the repositories tab of a specific user to find all public projects.
* **Data Extraction:** Navigates to each repository to collect:
    * Repository name and "About" description.
    * Language distribution statistics.
    * Star and Fork counts.
    * README content and last update timestamp.
* **JSON Export:** Automatically writes all collected data to a formatted `scrapeData.json` file.

## Technical Stack

* **Language:** TypeScript
* **Automation:** Playwright (Chromium)
* **Environment:** Node.js

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browser:**
   ```bash
   npx playwright install chromium
   ```

## Usage

Run the script using `ts-node`. You can provide a GitHub username as a command-line argument.

```bash
# To scrape a specific user
npx ts-node scrapper.ts --username

# If no argument is provided, it defaults to the username defined in the script
npx ts-node scrapper.ts
```

### Configuration

The following variables can be adjusted within the source code:
* **HEADLESS:** Set to `false` to see the browser window during execution.
* **LOGVALUES:** Set to `true` to print scraped data directly to the console.

## Data Structure

The output `scrapeData.json` follows this format:

```json
[
  {
    "name": "repository-name",
    "about": "Description text",
    "languages": { "TypeScript": 90, "HTML": 10 },
    "stars": 5,
    "forks": 1,
    "lastUpdate": "Mar 25, 2026",
    "readme": "Full README text content"
  }
]
```

---

**Note:** This scraper relies on specific GitHub CSS selectors. If GitHub updates their site layout, the selectors in the script may require updates.

Would you like me to create a `.gitignore` file to ensure your `node_modules` and generated JSON files aren't tracked?
