const express = require('express');
const router = express.Router();
const jsonDB = require('../utils/jsonDatabase');
const bcrypt = require('bcryptjs');

// Get form responses (with password protection)
router.get('/:responseLink', async (req, res) => {
  try {
    const { responseLink } = req.params;
    const { password } = req.query;

    const forms = await jsonDB.readForms();
    const form = forms.find(f => f.responseLink === responseLink);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Check if form has expired
    if (new Date() > new Date(form.expiresAt)) {
      return res.status(410).json({
        success: false,
        error: 'Form has expired'
      });
    }

    // Check password if required
    if (form.responsePassword) {
      if (!password) {
        return res.status(401).json({
          success: false,
          error: 'Password required'
        });
      }

      const isValidPassword = await bcrypt.compare(password, form.responsePassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password'
        });
      }
    }

    // Get responses for this form
    const allResponses = await jsonDB.readResponses();
    const formResponses = allResponses.filter(r => r.formId === form._id);

    // Calculate stats
    const stats = {
      totalResponses: formResponses.length,
      completionRate: formResponses.length > 0 ? 100 : 0, // Simplified for JSON DB
      avgCompletionTime: 'N/A', // Would need to track start time
      lastResponseTime: formResponses.length > 0 
        ? new Date(Math.max(...formResponses.map(r => new Date(r.submittedAt)))).toLocaleString()
        : 'No responses yet'
    };

    res.json({
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        expiresAt: form.expiresAt,
        responseCount: form.responseCount
      },
      responses: formResponses,
      stats
    });

  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch responses'
    });
  }
});

// Export responses
router.get('/:responseLink/export', async (req, res) => {
  try {
    const { responseLink } = req.params;
    const { format = 'csv', password } = req.query;

    const forms = await jsonDB.readForms();
    const form = forms.find(f => f.responseLink === responseLink);

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Check password if required
    if (form.responsePassword) {
      if (!password) {
        return res.status(401).json({
          success: false,
          error: 'Password required'
        });
      }

      const isValidPassword = await bcrypt.compare(password, form.responsePassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password'
        });
      }
    }

    // Get responses
    const allResponses = await jsonDB.readResponses();
    const formResponses = allResponses.filter(r => r.formId === form._id);

    if (format === 'csv') {
      // Generate CSV
      const headers = ['Submitted At', ...form.fields.map(f => f.label)];
      const csvRows = [headers.join(',')];
      
      formResponses.forEach(response => {
        const row = [
          new Date(response.submittedAt).toLocaleString(),
          ...form.fields.map(field => {
            const value = response.data[field.id] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
          })
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      
      res.json({
        success: true,
        data: csvContent
      });
    } else {
      // JSON format
      const exportData = {
        form: {
          title: form.title,
          description: form.description,
          fields: form.fields,
          exportedAt: new Date().toISOString()
        },
        responses: formResponses.map(r => ({
          submittedAt: r.submittedAt,
          data: r.data
        }))
      };

      res.json({
        success: true,
        data: JSON.stringify(exportData, null, 2)
      });
    }

  } catch (error) {
    console.error('Error exporting responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export responses'
    });
  }
});

// Delete responses
router.delete('/:responseLink', async (req, res) => {
  try {
    const { responseLink } = req.params;
    const { responseIds, password } = req.body;

    const forms = await jsonDB.readForms();
    const formIndex = forms.findIndex(f => f.responseLink === responseLink);

    if (formIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    const form = forms[formIndex];

    // Check password if required
    if (form.responsePassword) {
      if (!password) {
        return res.status(401).json({
          success: false,
          error: 'Password required'
        });
      }

      const isValidPassword = await bcrypt.compare(password, form.responsePassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password'
        });
      }
    }

    // Delete responses
    const allResponses = await jsonDB.readResponses();
    const filteredResponses = allResponses.filter(r => 
      r.formId !== form._id || !responseIds.includes(r._id)
    );
    
    await jsonDB.writeResponses(filteredResponses);

    // Update form response count
    const remainingCount = filteredResponses.filter(r => r.formId === form._id).length;
    forms[formIndex].responseCount = remainingCount;
    await jsonDB.writeForms(forms);

    const deletedCount = responseIds.length;

    res.json({
      success: true,
      message: `${deletedCount} response(s) deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting responses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete responses'
    });
  }
});

module.exports = router;