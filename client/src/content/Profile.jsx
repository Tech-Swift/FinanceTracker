import { useEffect, useState } from "react";
import axiosInstance from "../lib/utils";
import { toast } from "sonner";

// 🔹 Profile Component
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get("/users/profile");
        setUser(res.data);
        setFormData(res.data); // initialize form
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put("/users/profile", formData);
      setUser(res.data);
      setEditMode(false);
      toast("Profile updated", {
        description: "Your changes have been saved successfully ✅",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Update failed", {
        description: "Something went wrong, please try again.",
      });
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4 text-red-500">Failed to load profile.</p>;

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal details and preferences
          </p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit
          </button>
        )}
      </header>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Info */}
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Personal Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
            <InputField
              label="Phone"
              name="phone"
              type="text"
              value={formData.phone || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
            <InputField
              label="Card / Account Number"
              name="accountNumber"
              type="text"
              value={formData.accountNumber || ""}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="1234 5678 9012 3456"
            />
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Preferences
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Currency"
              name="currency"
              type="text"
              value={formData.currency || "USD"}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Security
          </h2>
          <div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Actions */}
        {editMode && (
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData(user); // reset changes
              }}
              className="px-4 py-2 border rounded-lg dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </section>
  );
}

/* 🔹 Small reusable input field */
function InputField({ label, name, type, value, onChange, disabled, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full border rounded-lg p-2 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:text-gray-100"
      />
    </div>
  );
}

/* 🔹 Password Modal */
function PasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put("/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast("✅ Password updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
      toast("❌ Failed to update password", {
        description: error.response?.data?.message || "Try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-gray-100"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-gray-100"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-gray-100"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg dark:text-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
