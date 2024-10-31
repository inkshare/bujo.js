# BulletJournal.js

![Build Status](https://github.com/inkshare/bujo.js/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.18.0-green)
[![Coverage Status](https://coveralls.io/repos/github/inkshare/bujo.js/badge.svg?branch=main)](https://coveralls.io/github/inkshare/bujo.js?branch=main)

`bujo.js` is a customizable library for generating Bullet Journal-style PDFs using JavaScript. It enables users to create organized PDF templates with customizable options, such as cover pages, milestones, undated calendars, planning pages, and more.

## Features

- **Cover Page**: Add a personalized cover page to your journal.
- **Index Page**: Add an index for easy navigation.
- **Undated Calendar Pages**: Generate monthly calendar pages without specific dates.
- **Top Milestones Pages**: Add up to 30 milestones and yearly top 10 milestones.
- **Helicopter Overview**: Add a high-level overview page for the year.
- **Dotted Grid Pages**: Include customizable numbers of dotted grid pages.
- **Daily Planning Pages**: Add daily planning pages for detailed scheduling.
- **Weekly Overview Pages**: Generate weekly pages to track activities for each day.
- **Flexible Tracking Pages**: Add a flexible page for habit tracking, goal-setting, and reflections.

## Installation

1. Clone or download the `bujo.js` repository:
   ```bash
   git clone https://github.com/inkshare/bujo.js.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Import and use `bujo.js` in your project:
   ```javascript
   import { BulletJournal } from './src/bujo.js';
   ```

## Usage

### Creating a New Bullet Journal

To create a new instance of `BulletJournal`, specify the title and color scheme:
```javascript
const journal = new BulletJournal("My Custom Journal", "monochrome");
```

### Customizing Your Bullet Journal

1. **Add Cover Page**:
   ```javascript
   journal.addCoverPage(doc);
   ```

2. **Add Index Page**:
   ```javascript
   journal.addIndexPage(doc);
   ```

3. **Add Undated Calendar Pages**:
   ```javascript
   journal.addUndatedCalendarPages(doc);
   ```

4. **Add Top Milestones Pages**:
   ```javascript
   journal.addTopMilestonesPage(doc);
   ```

5. **Add Helicopter Overview Page**:
   ```javascript
   journal.addHelicopterOverviewPage(doc);
   ```

6. **Add Dotted Grid Pages**:
   Specify the number of pages and dimensions:
   ```javascript
   const pageCount = 5;  // Number of dotted grid pages
   for (let i = 0; i < pageCount; i++) {
       journal.addDottedGridPage(doc, 0.2, { width: 8.27, height: 11.69 });
   }
   ```

7. **Add Daily Planning Page**:
   ```javascript
   journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 });
   ```

8. **Add Weekly Overview Page**:
   ```javascript
   journal.addWeeklyOverviewPage(doc, { width: 8.27, height: 11.69 });
   ```

9. **Add Flexible Tracking Page**:
   ```javascript
   journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });
   ```

### Creating a Complete Bullet Journal Book

To create a full Bullet Journal with a combination of the above sections:
```javascript
const doc = new jsPDF();
journal.createBulletJournalBook('A4', doc);
```

This method will automatically add sections based on a standard format for the year, including cover, index, undated calendar, milestones, helicopter overview, and monthly planning pages.

### Example Code for Form-driven Customization

Here’s an example of how to use user input to customize the journal content:
```javascript
const topMilestones = true;  // User input
const undatedCalendar = false;
const indexPage = true;
const coverPage = true;
const helicopterOverview = false;
const dottedGridCount = 5;
const dailyPlanning = true;
const flexibleTracking = true;

const doc = new jsPDF();
if (coverPage) journal.addCoverPage(doc);
if (indexPage) journal.addIndexPage(doc);
if (undatedCalendar) journal.addUndatedCalendarPages(doc);
if (topMilestones) journal.addTopMilestonesPage(doc);
if (helicopterOverview) journal.addHelicopterOverviewPage(doc);
for (let i = 0; i < dottedGridCount; i++) {
    journal.addDottedGridPage(doc, 0.2, { width: 8.27, height: 11.69 });
}
if (dailyPlanning) journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 });
if (flexibleTracking) journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });

// Save the generated PDF
doc.save("Custom_BulletJournal.pdf");
```

### Methods Summary

| Method                   | Description                           |
|--------------------------|---------------------------------------|
| `addCoverPage(doc)`      | Adds a cover page                    |
| `addIndexPage(doc)`      | Adds an index page                   |
| `addUndatedCalendarPages(doc)` | Adds monthly calendar pages  |
| `addTopMilestonesPage(doc)`     | Adds milestones page       |
| `addHelicopterOverviewPage(doc)` | Adds helicopter overview  |
| `addDottedGridPage(doc, spacing, dimensions)` | Adds dotted grid |
| `addDailyPlanningPage(doc, dimensions)` | Adds daily planning |
| `addWeeklyOverviewPage(doc, dimensions)` | Adds weekly overview |
| `addFlexibleTrackingPage(doc, dimensions)` | Adds flexible tracking |

## Testing

To run tests and check for code coverage:
```bash
npm test
```

## Dependencies

- [jsPDF](https://github.com/parallax/jsPDF) - For generating PDF documents.
- Custom color schemes and design elements can be further customized by modifying `bujo.js`.

## Versioning

This project follows [Semantic Versioning (SemVer)](https://semver.org/). Using `standard-version`, version numbers are automatically updated based on the following types of commits:

- **fix:** Patch release for bug fixes.
- **feat:** Minor release for new features.
- **BREAKING CHANGE:** Major release for backward-incompatible changes.

### Commit Message Format

To ensure versioning is correctly applied, use these commit message conventions:
- `fix: <description>` – for bug fixes (patch).
- `feat: <description>` – for new features (minor).
- `feat!: <description>` – for breaking changes (major).

For example:
```bash
git commit -m "feat: add helicopter overview page"
git commit -m "fix: correct typo in milestone section"
```

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.