import Modal from "@/pages/components/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
      console.log("Fetched user data:", data); // Log the fetched user data
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchData(e.target.value);
  };

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

  //   const handleUpdate = async (userId: string) => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/users/${userId}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user data");
  //       }
  //       const userData = await response.json();
  //       setSelectedUser(userData);
  //       setIsUpdate(true);
  //       setIsModalOpen(true);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       toast.error(
  //         error.message || "Failed to fetch user data. Please try again."
  //       );
  //     }
  //   };

  console.log(userData);

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
          <>
            <table className="border-collapse border border-slate-400 ">
              <thead>
                <tr>
                  <th className="border border-slate-300 p-4">Username</th>
                  <th className="border border-slate-300 p-4">Fullname</th>
                  <th className="border border-slate-300 p-4">Role</th>
                  <th className="border border-slate-300 p-4">Project</th>
                  <th className="border border-slate-300 p-4">Active</th>
                  <th className="border border-slate-300 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.length > 0
                  ? userData.map((user) => (
                      <tr key={user.id}>
                        <td className="border border-slate-300 p-4 text-center">
                          {user.username}
                        </td>
                        <td className="border border-slate-300 p-4 text-center">
                          {user.fullname}
                        </td>
                        <td className="border border-slate-300 p-4 text-center">
                          {user.role}
                        </td>
                        <td className="border border-slate-300 p-4 text-center">
                          {user.project}
                        </td>
                        <td className="border border-slate-300 p-4 text-center">
                          {user.activeYn ? "Yes" : "No"}
                        </td>
                        <td className="border border-slate-300 p-4 text-center flex gap-5">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                            onClick={() => handleUpdate(user.id)}
                          >
                            {" "}
                            Update
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                            onClick={() => handleDelete(user.id)}
                          >
                            {" "}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </>
        ) : (
          "Loading...."
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
