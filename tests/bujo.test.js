import { BulletJournal } from '../src/bujo';
import jsPDF from 'jspdf';

// Mocking jsPDF to prevent actual PDF file creation during tests
jest.mock('jspdf', () => {
    const mJsPDF = jest.fn().mockImplementation(() => ({
        addPage: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn(),
        circle: jest.fn(),
        line: jest.fn(),
        addImage: jest.fn(),
        internal: { pageSize: { width: 210, height: 297 } },
        save: jest.fn(),
    }));
    return mJsPDF;
});

describe('BulletJournal PDF Generation with Illustrations', () => {
    let journal;
    let doc;

    beforeEach(() => {
        journal = new BulletJournal('Test Journal');
        doc = new jsPDF();
    });

    // Positive Tests
    test('should create a Dotted Grid PDF without errors', () => {
        expect(() => journal.addDottedGridPage(doc, 0.2, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should add multiple dots within large page dimensions in addDottedGridPage', () => {
        journal.addDottedGridPage(doc, 1, { width: 20, height: 20 });
        expect(doc.circle).toHaveBeenCalled(); // Ensures dots are added within the larger space
    });

    test('should create a Daily Planning PDF without errors', () => {
        expect(() => journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should add daily planning elements including all text and circles', () => {
        journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 });
        expect(doc.text).toHaveBeenCalledWith("Daily Planner", expect.any(Number), expect.any(Number), null, null, 'center');
        expect(doc.text).toHaveBeenCalledWith("Morning", 10, 40);
        expect(doc.text).toHaveBeenCalledWith("Afternoon", 10, 80);
        expect(doc.text).toHaveBeenCalledWith("Evening", 10, 120);
        expect(doc.circle).toHaveBeenCalledTimes(13); // 10 To-Do + 3 Priority circles
    });

    test('should add weekly overview days and goal circles', () => {
        journal.addWeeklyOverviewPage(doc, { width: 8.27, height: 11.69 });
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => {
            expect(doc.text).toHaveBeenCalledWith(day, expect.any(Number), expect.any(Number));
        });
        expect(doc.circle).toHaveBeenCalledTimes(5); // 5 circles for Goals
    });

    test('should add flexible tracking elements including habit tracker and goals', () => {
        journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });
        const days = ["S", "M", "T", "W", "T", "F", "S"];
        days.forEach(day => {
            expect(doc.text).toHaveBeenCalledWith(day, expect.any(Number), expect.any(Number));
        });
        expect(doc.circle).toHaveBeenCalled(); // Habit tracker circles
        expect(doc.text).toHaveBeenCalledWith("Goal-Setting", 10, 100);
    });

    test('should create a complete Bullet Journal Book PDF without errors', () => {
        expect(() => journal.createBulletJournalBook('A4')).not.toThrow();
    });

    test('should generate journal book for A3 size without errors', () => {
        expect(() => journal.createBulletJournalBook('A3', doc)).not.toThrow();
    });

    test('should generate journal book for A5 size without errors', () => {
        expect(() => journal.createBulletJournalBook('A5', doc)).not.toThrow();
    });

    test('should call save with the correct filename in createBulletJournalBook', () => {
        const saveSpy = jest.spyOn(doc, 'save');
        journal.createBulletJournalBook('A4', doc);
        const expectedFilename = `${journal.title.replace(/\s+/g, '_').toLowerCase()}_journal_book.pdf`;
        expect(saveSpy).toHaveBeenCalledWith(expectedFilename);
        saveSpy.mockRestore();
    });

    // Negative Tests
    test('should throw error for unsupported paper size', () => {
        expect(() => journal.createBulletJournalBook('InvalidSize')).toThrow('Unsupported paper size');
    });

    test('should throw error if doc parameter is missing in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(null, 0.2, { width: 8.27, height: 11.69 })).toThrow('Invalid document instance');
    });

    test('should throw error if dotSpacing is negative in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, -0.2, { width: 8.27, height: 11.69 })).toThrow('Invalid dot spacing');
    });

    test('should throw error if paperDimensions is missing in addWeeklyOverviewPage', () => {
        expect(() => journal.addWeeklyOverviewPage(doc, null)).toThrow('Invalid paper dimensions');
    });

    // Edge Cases
    test('should handle minimal dimensions in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, 0.2, { width: 0.5, height: 0.5 })).not.toThrow();
    });

    test('should handle minimal dimensions in addDailyPlanningPage', () => {
        expect(() => journal.addDailyPlanningPage(doc, { width: 0.5, height: 0.5 })).not.toThrow();
    });

    test('should handle large dotSpacing in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, 2, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should handle very large dimensions in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, 0.2, { width: 50, height: 50 })).not.toThrow();
    });

    test('should add multiple pages in createBulletJournalBook for a full journal', () => {
        journal.createBulletJournalBook('A4', doc);
        expect(doc.addPage).toHaveBeenCalled(); // Confirm that multiple pages were added
    });
});
