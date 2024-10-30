import { BulletJournal } from '../src/bujo';
import jsPDF from 'jspdf';

// Mocking jsPDF to prevent actual PDF file creation during tests
jest.mock('jspdf');

describe('BulletJournal PDF Generation', () => {
    let journal;
    let doc;

    beforeEach(() => {
        journal = new BulletJournal('Test Journal');
        doc = new jsPDF();
    });

    test('should create a Dotted Grid PDF without errors', () => {
        expect(() => journal.addDottedGridPage(doc, 0.2, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should create a Daily Planning PDF without errors', () => {
        expect(() => journal.addDailyPlanningPage(doc, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should create a Weekly Overview PDF without errors', () => {
        expect(() => journal.addWeeklyOverviewPage(doc, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should create a Flexible Tracking PDF without errors', () => {
        expect(() => journal.addFlexibleTrackingPage(doc, { width: 8.27, height: 11.69 })).not.toThrow();
    });

    test('should create a complete Bullet Journal Book PDF without errors', () => {
        expect(() => journal.createBulletJournalBook('A4')).not.toThrow();
    });
});
