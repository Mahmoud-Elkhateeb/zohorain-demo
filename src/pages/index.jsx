import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="mt-2">Welcome back, {user?.displayName || user?.email || 'Admin'}!</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">128</p>
          <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$5,280</p>
          <p className="text-sm text-gray-500 mt-1">+8.2% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Active Users</h3>
          <p className="text-3xl font-bold mt-2">42</p>
          <p className="text-sm text-gray-500 mt-1">+3 since last week</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="border-l-4 border-green-500 pl-4 py-2">
            <p>New order #ORD-1289 received</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </li>
          <li className="border-l-4 border-blue-500 pl-4 py-2">
            <p>New menu item added: Spicy Chicken Burger</p>
            <p className="text-sm text-gray-500">5 hours ago</p>
          </li>
          <li className="border-l-4 border-yellow-500 pl-4 py-2">
            <p>Subscription payment received from customer #C-42</p>
            <p className="text-sm text-gray-500">1 day ago</p>
          </li>
        </ul>
      </div>
    </div>
  );
}


