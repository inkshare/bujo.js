module.exports = {
    Configuration: jest.fn().mockImplementation(() => ({
      apiKey: 'test-api-key'
    })),
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createImage: jest.fn().mockResolvedValue({
        data: { data: [{ url: 'https://example.com/fake-image.png' }] }
      })
    }))
  };
  