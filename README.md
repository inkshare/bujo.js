# BulletJournal.js

![Build Status](https://github.com/inkshare/bujo.js/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.18.0-green)
[![Coverage Status](https://coveralls.io/repos/github/inkshare/bujo.js/badge.svg?branch=main)](https://coveralls.io/github/inkshare/bujo.js?branch=main)

A comprehensive JavaScript library for generating customizable bullet journal PDFs, complete with templates for daily planning, weekly overviews, flexible tracking, and more. Ideal for those who want to create printable, organized bullet journals.

## Features

- **Dotted Grid Pages**: Customizable grid spacing.
- **Daily and Weekly Planning Pages**: Organize your day and week.
- **Flexible Tracking Pages**: Track habits, goals, and reflections.
- **Illustration Support**: Add unique illustration pages before each module.
- **Multiple Paper Sizes**: Supports A3, A4, A5, and A6 formats.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

Import the `BulletJournal` class and create a new bullet journal PDF with the provided methods.

```javascript
import { BulletJournal } from './src/bujo';

const myJournal = new BulletJournal('My Custom Journal');
myJournal.createBulletJournalBook('A4'); // Creates a complete journal PDF in A4 size
```

### Available Templates

- **Dotted Grid**: Customizable dot spacing
- **Daily Planning**: Includes sections for morning, afternoon, evening, tasks, and notes
- **Weekly Overview**: Shows each day of the week with goal and notes sections
- **Flexible Tracking**: Track habits and set goals

## API

### `new BulletJournal(title: string)`

Create a new bullet journal instance.

### `createBulletJournalBook(paperSize: string)`

Generate a complete PDF book with the provided paper size (`A3`, `A4`, `A5`, `A6`).

### Individual Templates

Each method generates a specific PDF page:
- `addDottedGridPage(doc, dotSpacing, paperDimensions)`
- `addDailyPlanningPage(doc, paperDimensions)`
- `addWeeklyOverviewPage(doc, paperDimensions)`
- `addFlexibleTrackingPage(doc, paperDimensions)`

## Testing

To run tests and check code coverage:

```bash
npm test -- --coverage
```

### Negative Tests

The test suite includes negative tests to validate error handling, such as:
- Unsupported paper size
- Missing document parameter
- Negative dot spacing

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.