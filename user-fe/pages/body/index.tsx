import Modal from "@/pages/components/Modal";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import TanTable from "@/pages/components/TanTable";

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsUpdate(false);
    setIsModalOpen(false);
  };

  const fetchData = async (searchTerm: string = "") => {
    try {
      const response = await fetch(
        `http://localhost:3000/users?search=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
    debouncedFetchData(e.target.value);
  };

  const debouncedFetchData = useCallback(
    debounce((term) => fetchData(term), 300),
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (userId: string) => {
    console.log("Deleting user with ID:", userId);
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }

      const result = await response.json();
      console.log("User deleted:", result);
      toast.success(result.message || "User deleted successfully.");

      fetchData(); // Refresh user data after deletion
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user. Please try again.");
    }
  };

  const handleUpdate = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      const userData = await response.json();
      setSelectedUser(userData); // Set the selected user data
      setIsUpdate(true); // Set isUpdate to true to indicate update mode
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(
        error.message || "Failed to fetch user data. Please try again."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center">
        <div> User management project</div>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create User
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="mb-4 p-2 border border-slate-400"
        />

        {userData ? (
          <TanTable
            userData={userData}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        ) : (
          "Loading..."
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          fetchData={fetchData}
          isUpdate={isUpdate}
          selectedUser={selectedUser}
        />
      </div>
    </>
  );
};

export default UserTable;
