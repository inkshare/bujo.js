import jsPDF from 'jspdf';
import { applyColorScheme } from './utils/colorScheme';

const PAPER_SIZES = {
    A3: { width: 11.69, height: 16.54 },
    A4: { width: 8.27, height: 11.69 },
    A5: { width: 5.83, height: 8.27 },
    A6: { width: 4.13, height: 5.83 }
};

class BulletJournal {
    constructor(title = 'My Bullet Journal', colorScheme = 'color') {
        this.title = title;
        this.colorScheme = colorScheme;
    }

    applyColors(doc) {
        const colors = applyColorScheme(doc, this.colorScheme);
        doc.setTextColor(colors.textColor);
        doc.setDrawColor(colors.lineColor);
    }

    addCoverPage(doc) {
        doc.addPage();
        doc.setFontSize(24);
        doc.text(this.title, doc.internal.pageSize.width / 2, 40, null, null, 'center');
    }

    addIndexPage(doc) {
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Index", 10, 20);
        doc.setFontSize(12);
        for (let i = 1; i <= 20; i++) {
            doc.text(`Section ${i} - Page ${i * 5}`, 10, 30 + i * 10);
        }
    }

    addUndatedCalendarPages(doc) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Undated Calendar", 10, 20);
        for (let month = 1; month <= 12; month++) {
            doc.addPage();
            doc.text(`Month ${month}`, 10, 20);
        }
    }

    addTopMilestonesPage(doc) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Top 30 Milestones", 10, 20);
        for (let i = 1; i <= 30; i++) {
            doc.circle(10, 30 + i * 10, 2);
            doc.text(`Milestone ${i}`, 20, 30 + i * 10);
        }

        doc.addPage();
        doc.text("Top 10 Yearly Milestones", 10, 20);
        for (let i = 1; i <= 10; i++) {
            doc.circle(10, 30 + i * 10, 2);
            doc.text(`Yearly Milestone ${i}`, 20, 30 + i * 10);
        }
    }

    addHelicopterOverviewPage(doc) {
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Helicopter Overview", 10, 20);
        doc.setFontSize(12);
        doc.text("A snapshot view of the entire year", 10, 30);
    }

    addIllustrationPage(doc, moduleName) {
        if (!doc) throw new Error('Invalid document instance');
        const imagePath = `/public/assets/module-images/${moduleName}.png`;

        doc.addPage();
        doc.setFontSize(18);
        doc.text(`Module: ${moduleName}`, doc.internal.pageSize.width / 2, 30, null, null, 'center');
        doc.addImage(imagePath, 'PNG', 20, 40, 170, 120);
    }

    addDottedGridPage(doc, dotSpacing, paperDimensions) {
        if (!doc) throw new Error('Invalid document instance');
        if (dotSpacing <= 0) throw new Error('Invalid dot spacing');
        if (!paperDimensions) throw new Error('Invalid paper dimensions');

        doc.addPage();

        const xLimit = Math.max(dotSpacing, paperDimensions.width);
        const yLimit = Math.max(dotSpacing, paperDimensions.height);

        for (let x = dotSpacing; x <= xLimit; x += dotSpacing) {
            for (let y = dotSpacing; y <= yLimit; y += dotSpacing) {
                doc.circle(x, y, 0.01, 'F'); // Small dot
            }
        }
    }

    addDailyPlanningPage(doc, paperDimensions) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Daily Planner", paperDimensions.width / 2, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.text("Morning", 10, 40);
        doc.text("Afternoon", 10, 80);
        doc.text("Evening", 10, 120);
        doc.text("To-Do List", 10, 150);
        for (let i = 0; i < 10; i++) {
            doc.circle(15, 155 + i * 10, 2);
        }
        doc.text("Priority Tasks", 10, 200);
        for (let i = 0; i < 3; i++) {
            doc.circle(15, 205 + i * 10, 2);
        }
        doc.text("Notes", 10, 240);
        doc.line(10, 245, 190, 245);
    }

    addWeeklyOverviewPage(doc, paperDimensions) {
        if (!paperDimensions) throw new Error('Invalid paper dimensions');
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Weekly Overview", paperDimensions.width / 2, 20, null, null, 'center');

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        doc.setFontSize(12);
        for (let i = 0; i < days.length; i++) {
            doc.text(days[i], 10 + (i % 4) * 50, 40 + Math.floor(i / 4) * 40);
            doc.line(10 + (i % 4) * 50, 45 + Math.floor(i / 4) * 40, 60 + (i % 4) * 50, 45 + Math.floor(i / 4) * 40);
        }

        // Add Goals section
        doc.text("Goals", 10, 140);
        for (let i = 0; i < 5; i++) {
            doc.circle(15, 145 + i * 10, 2);
        }
    }


    addFlexibleTrackingPage(doc, paperDimensions) {
        if (!paperDimensions) throw new Error('Invalid paper dimensions');
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Flexible Tracking", paperDimensions.width / 2, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.text("Habit Tracker", 10, 40);
        const days = ["S", "M", "T", "W", "T", "F", "S"];
        for (let i = 0; i < days.length; i++) {
            doc.text(days[i], 30 + i * 20, 45);
            for (let j = 0; j < 5; j++) {
                doc.circle(30 + i * 20, 50 + j * 10, 2);
            }
        }
        doc.text("Goal-Setting", 10, 100);
        for (let i = 0; i < 5; i++) {
            doc.circle(15, 105 + i * 10, 2);
        }
        doc.text("Flexible Tracking Space", 10, 150);
        doc.line(10, 155, 190, 155);
    }

    getExpectedPageCount() {
        const coverPageCount = 1; // Cover page
        const indexPageCount = 1; // Index page
        const calendarPages = 12; // Undated calendar, one page per month
        const milestonesPages = 2; // Top 30 and Top 10 milestones
        const helicopterPageCount = 1; // Helicopter overview
        const monthlyPages = 12 * 4; // 12 months, each with 4 pages: dotted grid, daily, weekly, flexible tracking
        return coverPageCount + indexPageCount + calendarPages + milestonesPages + helicopterPageCount + monthlyPages;
    }

    // Ensure no unintended additional page invocations
    createBulletJournalBook(paperSize, doc = new jsPDF()) {
        const paperDimensions = PAPER_SIZES[paperSize];
        if (!paperDimensions) throw new Error('Unsupported paper size');

        this.applyColors(doc);

        // Static pages
        this.addCoverPage(doc);
        this.addIndexPage(doc);
        this.addUndatedCalendarPages(doc);
        this.addTopMilestonesPage(doc);
        this.addHelicopterOverviewPage(doc);

        // Monthly repeating sections
        for (let i = 0; i < 12; i++) {
            this.addDottedGridPage(doc, 0.2, paperDimensions);
            this.addDailyPlanningPage(doc, paperDimensions);
            this.addWeeklyOverviewPage(doc, paperDimensions);
            this.addFlexibleTrackingPage(doc, paperDimensions);
        }

        const filename = `${this.title.replace(/\s+/g, '_').toLowerCase()}_journal_book.pdf`;
        doc.save(filename);
    }

}

export { BulletJournal };
