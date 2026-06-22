import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getAdminDashboard,
  getAllUsers,
} from '../api/adminApi';


const AdminDashboardPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminDashboard,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsers,
  });

  const [search, setSearch] = useState('');

const filteredUsers = users.filter(
  (user) =>
    user.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    user.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
);

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-slate-500">
          HealthOS Platform Analytics
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white shadow-lg">
          <p>Total Users</p>
          <h2 className="mt-2 text-4xl font-bold">
            {stats?.totalUsers || 0}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
          <p>Total Meals</p>
          <h2 className="mt-2 text-4xl font-bold">
            {stats?.totalMeals || 0}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white shadow-lg">
          <p>Exercises</p>
          <h2 className="mt-2 text-4xl font-bold">
            {stats?.totalExercises || 0}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
          <p>Average Health Score</p>
          <h2 className="mt-2 text-4xl font-bold">
            {stats?.averageHealthScore || 0}
          </h2>
        </div>

      </div>
<input
  type="text"
  placeholder="Search users..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="mb-4 w-full rounded-xl border border-slate-200 p-3"
/>

      

      {/* User Table */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-xl font-bold">
          Registered Users
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Goal
                </th>

                <th className="p-3 text-left">
                  Streak
                </th>

                <th className="p-3 text-left">
                  Role
                </th>
                <th className="p-3 text-left">
  Action
</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">
                    {user.goal}
                  </td>

                  <td className="p-3">
                    🔥 {user.streak}
                  </td>

                  <td className="p-3">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>
                  <td className="p-3">
  <button
    onClick={() =>
      setSelectedUser(user)
    }
    className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
  >
    View
  </button>
</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          User Details
        </h2>

        <button
          onClick={() => setSelectedUser(null)}
          className="text-xl"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-3">

        <p>
          <strong>Name:</strong>{' '}
          {selectedUser.name}
        </p>

        <p>
          <strong>Email:</strong>{' '}
          {selectedUser.email}
        </p>

        <p>
          <strong>Goal:</strong>{' '}
          {selectedUser.goal}
        </p>

        <p>
          <strong>Role:</strong>{' '}
          {selectedUser.role}
        </p>

        <p>
          <strong>Streak:</strong>{' '}
          🔥 {selectedUser.streak}
        </p>

        <p>
          <strong>Joined:</strong>{' '}
          {new Date(
            selectedUser.created_at
          ).toLocaleDateString()}
        </p>

      </div>

    </div>

  </div>
)}

    </div>
  );
};

export default AdminDashboardPage;