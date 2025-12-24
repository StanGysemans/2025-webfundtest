import * as roleRequestService from '../services/rolerequests.service.js';

export const createRoleRequest = async (req, res) => {
  try {
    const { requestedRole, message } = req.body;
    const request = await roleRequestService.create(req.user.UserID, requestedRole, message);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRoleRequests = async (req, res) => {
  try {
    const requests = await roleRequestService.getAll(req.query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoleRequestById = async (req, res) => {
  try {
    const request = await roleRequestService.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Role request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoleRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await roleRequestService.updateStatus(
      req.params.id,
      status,
      req.user.UserID
    );
    res.json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteRoleRequest = async (req, res) => {
  try {
    await roleRequestService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

