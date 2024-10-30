import jsPDF from 'jspdf';
import FullCalendar from 'fullcalendar';
import Chart from 'chart.js';
import Quill from 'quill';
import interact from 'interactjs';
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
        this.pages = [];
        this.calendar = null;
        this.quillEditor = null;
    }

    initCalendar(targetElement) {
        this.calendar = new FullCalendar.Calendar(targetElement, { initialView: 'dayGridMonth', editable: true });
        this.calendar.render();
    }

    initTextEditor(targetElement) {
        this.quillEditor = new Quill(targetElement, { theme: 'snow', modules: { toolbar: [['bold', 'italic'], [{ 'list': 'bullet' }], ['link']] } });
    }

    addHabitTracker(targetElement, labels, data) {
        const ctx = targetElement.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Habit Tracker', data: data, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)' }] },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }

    makeDraggable(targetElement) {
        interact(targetElement).draggable({
            inertia: true,
            modifiers: [interact.modifiers.restrictRect({ restriction: 'parent' })],
            listeners: {
                move(event) {
                    const { target } = event;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
            },
        });
    }

    // Method to add illustration page based on the color scheme
    addIllustrationPage(doc, moduleName, colorScheme) {
        const imagePath = `../public/assets/module-images/${moduleName}-${colorScheme}.png`;

        // Add new page and insert illustration image
        doc.addPage();
        doc.text(`Module: ${moduleName}`, 105, 20, null, null, 'center'); // Module title
        doc.addImage(imagePath, 'PNG', 20, 30, 170, 120); // Adjust dimensions as needed
    }

    // Add a page for each module with a fresh page illustration
    addPage(pageType, content = '', colorScheme = 'color') {
        let pageContent = '';
        const moduleName = pageType; // Use pageType as module name for image naming consistency

        // Add illustration page
        this.addIllustrationPage(doc, moduleName, colorScheme);

        // Add content page for the module
        switch (pageType) {
            case 'habitTracker':
                pageContent = `<h2>Habit Tracker</h2><canvas id="habitTrackerCanvas"></canvas>`;
                break;
            case 'dailyPlanner':
                pageContent = `<h2>Daily Planner</h2><div class="daily-planner">${content}</div>`;
                break;
            case 'monthlyPlanner':
                pageContent = `<h2>Monthly Planner</h2><div class="monthly-planner">${content}</div>`;
                break;
            case 'textEditor':
                pageContent = `<h2>Notes Section</h2><div id="editor"></div>`;
                break;
            case 'calendar':
                pageContent = `<h2>Monthly Calendar</h2><div id="calendar"></div>`;
                break;
            default:
                console.error('Unknown page type');
                return;
        }

        this.pages.push({ type: pageType, content: pageContent });
    }

    exportToHTML() {
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>${this.title}</title>
        </head>
        <body>
          <h1>${this.title}</h1>
          ${this.pages.map(page => `<div class="bojo-page ${page.type}">${page.content}</div>`).join('\n')}
        </body>
        </html>`;
      
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.title.replace(' ', '_').toLowerCase()}.html`;
        link.click();
    }
    
    exportToPDF(colorScheme = 'color', paperSize = 'A5') {
        const paperDimensions = PAPER_SIZES[paperSize] || PAPER_SIZES.A5; // Default to A5 if not provided
        const doc = new jsPDF('p', 'in', [paperDimensions.width, paperDimensions.height]);
        const colors = applyColorScheme(doc, colorScheme);
        
        doc.setFontSize(16);
        doc.setTextColor(colors.textColor);
        
        this.pages.forEach(page => {
            doc.text(page.type, 10, 10);
            doc.text(page.content.replace(/<[^>]+>/g, ''), 10, 20);
            doc.addPage();
        });
        
        doc.save(`${this.title.replace(/\s+/g, '_').toLowerCase()}_journal.pdf`);
    }
}

export { BulletJournal };
