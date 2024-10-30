// src/utils/colorScheme.test.js

import { applyColorScheme } from '../../src/utils/colorScheme';

describe('applyColorScheme', () => {
    test('should return color scheme for "color" mode', () => {
        const result = applyColorScheme({}, 'color');
        expect(result).toEqual({
            textColor: '#4A90E2',
            lineColor: '#F5A623',
            highlightColor: '#7ED321',
        });
    });

    test('should return monochrome scheme for non-color mode', () => {
        const result = applyColorScheme({}, 'monochrome');
        expect(result).toEqual({
            textColor: '#000000',
            lineColor: '#333333',
            highlightColor: '#666666',
        });
    });
});
