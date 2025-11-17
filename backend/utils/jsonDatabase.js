const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class JSONDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.formsFile = path.join(this.dataDir, 'forms.json');
    this.responsesFile = path.join(this.dataDir, 'responses.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize files if they don't exist
      try {
        await fs.access(this.formsFile);
      } catch {
        await fs.writeFile(this.formsFile, JSON.stringify([], null, 2));
      }
      
      try {
        await fs.access(this.responsesFile);
      } catch {
        await fs.writeFile(this.responsesFile, JSON.stringify([], null, 2));
      }
      
      console.log('✅ JSON Database initialized');
    } catch (error) {
      console.error('❌ Failed to initialize JSON database:', error);
    }
  }

  async readForms() {
    try {
      const data = await fs.readFile(this.formsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading forms:', error);
      return [];
    }
  }

  async writeForms(forms) {
    try {
      await fs.writeFile(this.formsFile, JSON.stringify(forms, null, 2));
    } catch (error) {
      console.error('Error writing forms:', error);
    }
  }

  async readResponses() {
    try {
      const data = await fs.readFile(this.responsesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading responses:', error);
      return [];
    }
  }

  async writeResponses(responses) {
    try {
      await fs.writeFile(this.responsesFile, JSON.stringify(responses, null, 2));
    } catch (error) {
      console.error('Error writing responses:', error);
    }
  }

  // Clean up expired forms and responses
  async cleanup() {
    try {
      const now = new Date();
      
      // Clean up forms
      const forms = await this.readForms();
      const activeForms = forms.filter(form => new Date(form.expiresAt) > now);
      if (activeForms.length !== forms.length) {
        await this.writeForms(activeForms);
        console.log(`🧹 Cleaned up ${forms.length - activeForms.length} expired forms`);
      }
      
      // Clean up responses
      const responses = await this.readResponses();
      const activeResponses = responses.filter(response => new Date(response.expiresAt) > now);
      if (activeResponses.length !== responses.length) {
        await this.writeResponses(activeResponses);
        console.log(`🧹 Cleaned up ${responses.length - activeResponses.length} expired responses`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  generateShareableLink() {
    return crypto.randomBytes(16).toString('hex');
  }
}

module.exports = new JSONDatabase();