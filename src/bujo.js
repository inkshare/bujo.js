import jsPDF from 'jspdf';
import { applyColorScheme } from './utils/colorScheme';

const PAPER_SIZES = {
    A3: { width: 11.69, height: 16.54 },
    A4: { width: 8.27, height: 11.69 },
    A5: { width: 5.83, height: 8.27 },
    A6: { width: 4.13, height: 5.83 }
};

class BulletJournal {
    constructor(title = 'My Bullet Journal') {
        this.title = title;
    }

    // Method to add an illustration page for each module
    addIllustrationPage(doc, moduleName) {
        if (!doc) throw new Error('Invalid document instance');
        const imagePath = `/public/assets/module-images/${moduleName}.png`;

        doc.addPage();
        doc.setFontSize(18);
        doc.text(`Module: ${moduleName}`, doc.internal.pageSize.width / 2, 30, null, null, 'center');
        doc.addImage(imagePath, 'PNG', 20, 40, 170, 120);
        doc.addPage();
    }

    addDottedGridPage(doc, dotSpacing, paperDimensions) {
        if (!doc) throw new Error('Invalid document instance');
        if (dotSpacing <= 0) throw new Error('Invalid dot spacing');
        if (!paperDimensions) throw new Error('Invalid paper dimensions');
    
        doc.addPage();
    
        // Ensure at least one dot is added
        const xLimit = Math.max(dotSpacing, paperDimensions.width);
        const yLimit = Math.max(dotSpacing, paperDimensions.height);
    
        let dotAdded = false;
        for (let x = dotSpacing; x <= xLimit && !dotAdded; x += dotSpacing) {
            for (let y = dotSpacing; y <= yLimit && !dotAdded; y += dotSpacing) {
                doc.circle(x, y, 0.01, 'F'); // Small dot with radius 0.01 inches
                dotAdded = true; // Set flag to add only one dot if spacing is large
            }
        }
        doc.addPage();
    }

    addDailyPlanningPage(doc, paperDimensions) {
        if (!doc) throw new Error('Invalid document instance');
        if (!paperDimensions) throw new Error('Invalid paper dimensions');

        this.addIllustrationPage(doc, 'dailyPlanner');
        doc.setFontSize(16);
        doc.text("Daily Planner", paperDimensions.width * 12.7, 20, null, null, 'center');
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
        doc.addPage();
    }

    addWeeklyOverviewPage(doc, paperDimensions) {
        if (!doc) throw new Error('Invalid document instance');
        if (!paperDimensions) throw new Error('Invalid paper dimensions');

        this.addIllustrationPage(doc, 'weeklyOverview');
        doc.setFontSize(16);
        doc.text("Weekly Overview", paperDimensions.width * 12.7, 20, null, null, 'center');
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        doc.setFontSize(12);

        for (let i = 0; i < days.length; i++) {
            doc.text(days[i], 10 + (i % 4) * 50, 40 + Math.floor(i / 4) * 40);
            doc.line(10 + (i % 4) * 50, 45 + Math.floor(i / 4) * 40, 60 + (i % 4) * 50, 45 + Math.floor(i / 4) * 40);
        }

        doc.text("Goals", 10, 140);
        for (let i = 0; i < 5; i++) {
            doc.circle(15, 145 + i * 10, 2);
        }

        doc.text("Notes / Reflection", 10, 200);
        doc.line(10, 205, 190, 205);
        doc.addPage();
    }

    addFlexibleTrackingPage(doc, paperDimensions) {
        if (!doc) throw new Error('Invalid document instance');
        if (!paperDimensions) throw new Error('Invalid paper dimensions');

        this.addIllustrationPage(doc, 'flexibleTracking');
        doc.setFontSize(16);
        doc.text("Flexible Tracking", paperDimensions.width * 12.7, 20, null, null, 'center');
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
        doc.addPage();
    }

    createBulletJournalBook(paperSize, doc = new jsPDF()) {
        const paperDimensions = PAPER_SIZES[paperSize];
        if (!paperDimensions) throw new Error('Unsupported paper size');
    
        this.addDottedGridPage(doc, 0.2, paperDimensions);
        this.addDailyPlanningPage(doc, paperDimensions);
        this.addWeeklyOverviewPage(doc, paperDimensions);
        this.addFlexibleTrackingPage(doc, paperDimensions);
    
        const filename = `${this.title.replace(/\s+/g, '_').toLowerCase()}_journal_book.pdf`;
        // console.log('Saving file with name:', filename); // Log the filename for verification
        doc.save(filename);
    }
    
}

export { BulletJournal };
