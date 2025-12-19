import * as feedbackService from '../services/feedback.service.js';

export const getFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getAll(req.query);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackService.getById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.create(req.user.UserID, req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.update(req.params.id, req.body);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await feedbackService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

