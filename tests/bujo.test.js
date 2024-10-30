import { BulletJournal } from './BulletJournal';

describe('BulletJournal', () => {
    let journal;

    beforeEach(() => {
        journal = new BulletJournal('Test Journal');
    });

    test('should initialize with a title', () => {
        expect(journal.title).toBe('Test Journal');
    });

    test('should add a habit tracker page', () => {
        journal.addPage('habitTracker');
        expect(journal.pages).toHaveLength(1);
        expect(journal.pages[0].type).toBe('habitTracker');
    });

    test('should add a daily planner page', () => {
        journal.addPage('dailyPlanner', 'Plan for today');
        expect(journal.pages).toHaveLength(1);
        expect(journal.pages[0].type).toBe('dailyPlanner');
    });

    test('should export to HTML', () => {
        const linkMock = jest.spyOn(document, 'createElement').mockReturnValue({ click: jest.fn() });
        journal.exportToHTML();
        expect(linkMock).toHaveBeenCalled();
    });

    test('should export to PDF', () => {
        const saveMock = jest.fn();
        const docMock = { save: saveMock, addPage: jest.fn(), setTextColor: jest.fn(), setFontSize: jest.fn(), text: jest.fn() };
        jest.mock('jspdf', () => jest.fn().mockImplementation(() => docMock));
        journal.exportToPDF('monochrome');
        expect(saveMock).toHaveBeenCalled();
    });
});
