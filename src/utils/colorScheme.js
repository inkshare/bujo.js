// src/utils/colorScheme.js

/**
 * Applies a color scheme based on user preference.
 * @param {Object} doc - The jsPDF document instance.
 * @param {string} colorScheme - The color scheme ('color' or 'monochrome').
 * @returns {Object} colors - An object containing text, line, and highlight colors.
 */
function applyColorScheme(doc, colorScheme) {
    if (colorScheme === 'color') {
        return {
            textColor: '#4A90E2',   // Blue text
            lineColor: '#F5A623',   // Orange lines
            highlightColor: '#7ED321' // Green highlights
        };
    } else {
        return {
            textColor: '#000000',   // Black text
            lineColor: '#333333',   // Dark gray lines
            highlightColor: '#666666' // Light gray highlights
        };
    }
}

export { applyColorScheme };
