import { BulletJournal } from '../src/bujo';
import jsPDF from 'jspdf';
import { applyColorScheme } from '../src/utils/colorScheme';

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
        setTextColor: jest.fn(),
        setDrawColor: jest.fn(),
    }));
    return mJsPDF;
});

// Mock applyColorScheme for verifying color application
jest.mock('../src/utils/colorScheme', () => ({
    applyColorScheme: jest.fn(() => ({
        textColor: '#000000',
        lineColor: '#333333',
    }))
}));

describe('BulletJournal PDF Generation with Illustrations', () => {
    let journal;
    let doc;

    beforeEach(() => {
        journal = new BulletJournal('Test Journal', 'monochrome'); // Explicitly set to 'monochrome' for test
        doc = new jsPDF();
        jest.clearAllMocks(); // Clear all previous mock data
    });

    // Test constructor defaults
    test('should set default values if no title or color scheme is provided', () => {
        const defaultJournal = new BulletJournal();
        expect(defaultJournal.title).toBe('My Bullet Journal');
        expect(defaultJournal.colorScheme).toBe('color');
    });

    // Test applyColors functionality
    test('should apply colors using applyColorScheme with monochrome', () => {
        journal.applyColors(doc);
        expect(applyColorScheme).toHaveBeenCalledWith(doc, 'monochrome'); // Ensures 'monochrome' scheme
        expect(doc.setTextColor).toHaveBeenCalledWith('#000000');
        expect(doc.setDrawColor).toHaveBeenCalledWith('#333333');
    });

    // Test addIllustrationPage with invalid doc parameter
    test('should throw an error if doc is missing in addIllustrationPage', () => {
        expect(() => journal.addIllustrationPage(null, 'dailyPlanner')).toThrow('Invalid document instance');
    });

    // Test to ensure flexible tracking page is added without errors
    test('should add flexible tracking page without errors', () => {
        expect(() => journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    // Test to verify habit tracker days are added correctly
    test('should add habit tracker days correctly in flexible tracking page', () => {
        jest.spyOn(doc, 'text');

        journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });

        const days = ["S", "M", "T", "W", "T", "F", "S"];
        days.forEach(day => {
            expect(doc.text).toHaveBeenCalledWith(day, expect.any(Number), expect.any(Number));
        });
    });

    // Test to ensure goal-setting section circles are added correctly
    test('should add goal-setting circles in flexible tracking page', () => {
        jest.spyOn(doc, 'circle');

        journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });

        // Expect 5 circles for goal-setting section
        // Verify 5 goal-setting circles at specific coordinates (y >= 105)
        const goalSettingCalls = doc.circle.mock.calls.filter(call => call[2] === 2 && call[1] >= 105);
        expect(goalSettingCalls).toHaveLength(5);  // Confirms 5 circles for goal-setting section

        expect(doc.text).toHaveBeenCalledWith("Goal-Setting", 10, 100); // Text for goal-setting section
    });

    // Test to ensure flexible tracking space line is drawn
    test('should add flexible tracking space line in flexible tracking page', () => {
        jest.spyOn(doc, 'line');

        journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 });

        expect(doc.line).toHaveBeenCalledWith(10, 155, 190, 155); // Line for flexible tracking space
    });

    // Test for handling missing paper dimensions
    test('should throw error if paperDimensions is missing in addFlexibleTrackingPage', () => {
        expect(() => journal.addFlexibleTrackingPage(doc, null)).toThrow('Invalid paper dimensions');
    });

    // Test for large dimensions and spacing for edge case
    test('should handle large dimensions without issues in addFlexibleTrackingPage', () => {
        expect(() => journal.addFlexibleTrackingPage(doc, { width: 50, height: 50 })).not.toThrow();
    });

    // Test addDottedGridPage for valid and edge cases
    test('should throw an error for invalid dotSpacing in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, -1, { width: 8.27, height: 11.69 })).toThrow('Invalid dot spacing');
    });
    test('should throw an error if paperDimensions is missing in addDottedGridPage', () => {
        expect(() => journal.addDottedGridPage(doc, 0.2, null)).toThrow('Invalid paper dimensions');
    });

    // Test createBulletJournalBook with unsupported paper size
    test('should throw error for unsupported paper size in createBulletJournalBook', () => {
        expect(() => journal.createBulletJournalBook('InvalidSize', doc)).toThrow('Unsupported paper size');
    });

    // Test createBulletJournalBook for proper invocation of page methods and color scheme
    test('should call each page method in createBulletJournalBook', () => {
        jest.spyOn(journal, 'applyColors');
        jest.spyOn(journal, 'addDottedGridPage');
        jest.spyOn(journal, 'addDailyPlanningPage');
        jest.spyOn(journal, 'addWeeklyOverviewPage');
        jest.spyOn(journal, 'addFlexibleTrackingPage');

        journal.createBulletJournalBook('A4', doc);

        expect(journal.applyColors).toHaveBeenCalledTimes(1);
        expect(journal.addDottedGridPage).toHaveBeenCalledWith(doc, 0.2, expect.any(Object));
        expect(journal.addDailyPlanningPage).toHaveBeenCalledWith(doc, expect.any(Object));
        expect(journal.addWeeklyOverviewPage).toHaveBeenCalledWith(doc, expect.any(Object));
        expect(journal.addFlexibleTrackingPage).toHaveBeenCalledWith(doc, expect.any(Object));
    });

    test('should apply colors in createBulletJournalBook only once', () => {
        jest.spyOn(journal, 'applyColors');

        journal.createBulletJournalBook('A4', doc);

        expect(journal.applyColors).toHaveBeenCalledTimes(1); // Ensure single call to applyColors
    });

    // Test addIllustrationPage with valid parameters
    test('should add illustration page without errors', () => {
        expect(() => journal.addIllustrationPage(doc, 'flexibleTracking')).not.toThrow();
        expect(doc.addImage).toHaveBeenCalledWith(expect.stringContaining('flexibleTracking.png'), 'PNG', expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number));
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

        expect(doc.text).toHaveBeenCalledWith("Goals", 10, 140); // Text for goals section
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

    test('should add daily planning elements correctly in addDailyPlanningPage', () => {
        jest.spyOn(doc, 'text');
        jest.spyOn(doc, 'circle');

        journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 });

        expect(doc.text).toHaveBeenCalledWith('Daily Planner', expect.any(Number), 20, null, null, 'center');
        expect(doc.text).toHaveBeenCalledWith('Morning', 10, 40);
        expect(doc.text).toHaveBeenCalledWith('Afternoon', 10, 80);
        expect(doc.text).toHaveBeenCalledWith('Evening', 10, 120);
        expect(doc.text).toHaveBeenCalledWith('To-Do List', 10, 150);

        // Verify circles for To-Do List and Priority Tasks
        expect(doc.circle).toHaveBeenCalledTimes(13); // 10 for To-Do + 3 for Priority
    });

    test('should add weekly overview days and goals correctly in addWeeklyOverviewPage', () => {
        jest.spyOn(doc, 'text');
        jest.spyOn(doc, 'line');
        jest.spyOn(doc, 'circle');

        journal.addWeeklyOverviewPage(doc, { width: 8.27, height: 11.69 });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => expect(doc.text).toHaveBeenCalledWith(day, expect.any(Number), expect.any(Number)));
        expect(doc.line).toHaveBeenCalled(); // Checks for week lines

        expect(doc.text).toHaveBeenCalledWith("Goals", 10, 140);
        expect(doc.circle).toHaveBeenCalledTimes(5); // Verify 5 goal circles
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

    test('should return the correct expected page count', () => {
        const expectedPageCount = journal.getExpectedPageCount();
        expect(expectedPageCount).toBe(65); // Updated based on recalculated page count
    });

    test('should call each page method in createBulletJournalBook', () => {
        jest.spyOn(journal, 'applyColors');
        jest.spyOn(journal, 'addDottedGridPage');
        jest.spyOn(journal, 'addDailyPlanningPage');
        jest.spyOn(journal, 'addWeeklyOverviewPage');
        jest.spyOn(journal, 'addFlexibleTrackingPage');
        jest.spyOn(doc, 'addPage');

        journal.createBulletJournalBook('A4', doc);

        expect(journal.applyColors).toHaveBeenCalledTimes(1);
        expect(journal.addDottedGridPage).toHaveBeenCalledTimes(12);
        expect(journal.addDailyPlanningPage).toHaveBeenCalledTimes(12);
        expect(journal.addWeeklyOverviewPage).toHaveBeenCalledTimes(12);
        expect(journal.addFlexibleTrackingPage).toHaveBeenCalledTimes(12);
        expect(doc.addPage).toHaveBeenCalledTimes(66); // Update expectation to match confirmed page count
    });

});
