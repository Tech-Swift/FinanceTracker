// goalUtils.js
import axios from "../../lib/utils";
import { toast } from "sonner";

/**
 * Fetch all goals for the logged-in user
 */
export const fetchGoals = async () => {
  try {
    const res = await axios.get("/goals");
    return res.data.goals || [];
  } catch (err) {
    console.error("Error fetching goals:", err);
    toast.error(err.response?.data?.message || "Failed to load goals");
    return [];
  }
};

/**
 * Create a new goal
 * @param {Object} goalData - { title, targetAmount, currentAmount, deadline, categoryId }
 */
export const createGoal = async (goalData) => {
  try {
    const res = await axios.post("/goals", goalData);
    toast.success("Goal created successfully");
    return res.data.goal;
  } catch (err) {
    console.error("Error creating goal:", err);
    toast.error(err.response?.data?.message || "Failed to create goal");
    throw err;
  }
};

/**
 * Update an existing goal
 * @param {string} goalId
 * @param {Object} updates
 */
export const updateGoal = async (goalId, updates) => {
  try {
    const res = await axios.put(`/goals/${goalId}`, updates);
    toast.success("Goal updated successfully");
    return res.data.goal;
  } catch (err) {
    console.error("Error updating goal:", err);
    toast.error(err.response?.data?.message || "Failed to update goal");
    throw err;
  }
};

/**
 * Delete a goal
 * @param {string} goalId
 */
export const deleteGoal = async (goalId) => {
  try {
    await axios.delete(`/goals/${goalId}`);
    toast.success("Goal deleted successfully");
    return true;
  } catch (err) {
    console.error("Error deleting goal:", err);
    toast.error(err.response?.data?.message || "Failed to delete goal");
    return false;
  }
};
