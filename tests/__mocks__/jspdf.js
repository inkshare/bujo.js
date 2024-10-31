module.exports = jest.fn().mockImplementation(() => ({
  addPage: jest.fn(),
  setFontSize: jest.fn(),
  text: jest.fn(),
  circle: jest.fn(),
  line: jest.fn(),
  rect: jest.fn(),
  addImage: jest.fn(),
  save: jest.fn(),
  setTextColor: jest.fn(),
  setDrawColor: jest.fn(),
  internal: { pageSize: { width: 210, height: 297 } }
}));
