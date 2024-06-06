import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  isUpdate: boolean;
  selectedUser: User | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  fetchData,
  isUpdate,
  selectedUser,
}) => {
  const initialFormData: User = {
    id: "",
    username: "",
    fullname: "",
    role: "",
    project: "",
    activeYn: false,
  };

  const [formData, setFormData] = useState<User>(initialFormData);

  useEffect(() => {
    if (isUpdate && selectedUser) {
      setFormData(selectedUser);
    } else {
      setFormData(initialFormData);
    }
  }, [isUpdate, selectedUser]);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let url = "";
      let method = "";

      if (isUpdate) {
        url = `http://localhost:3000/users/${formData.id}`;
        method = "PATCH";
      } else {
        url = "http://localhost:3000/users";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the entire user object
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await response.json();
      toast.success(result.message);

      resetForm();
      fetchData();
      onClose();
    } catch (err: any) {
      console.error("Error creating/updating user:", err);
      toast.error(
        err.message || "Failed to create/update user. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center w-auto">
      <div className="flex flex-col bg-white p-4 rounded shadow-lg w-fit">
        <div className="flex justify-between">
          <div></div>
          <h2>{isUpdate ? "Update User" : "Create User"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 float-right"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="fullname">Fullname</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              disabled={isUpdate}
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <input
              type="text"
              name="role"
              id="role"
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isUpdate}
            />
          </div>
          <div>
            <label htmlFor="project">Project</label>
            <input
              type="text"
              name="project"
              id="project"
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="project"
              value={formData.project}
              onChange={handleChange}
              required
              disabled={isUpdate}
            />
          </div>
          <div>
            <label htmlFor="activeYn">Active</label>
            <input
              type="checkbox"
              name="activeYn"
              id="activeYn"
              checked={formData.activeYn}
              onChange={handleChange}
              className="ml-2"
              disabled={isUpdate}
            />
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              {isUpdate ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
