"use client";
import Image from 'next/image';
import { useState } from 'react';

interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  status: 'Online' | 'Offline';
  address: string;
  city: string;
  country: string;
  position: string;
  phone: string;
  email: string;
  chat: { left?: string; right?: string }[];
}

interface ChatProps {
  items: ChatItem[];
}

const Chat: React.FC<ChatProps> = ({ items }) => {
  const [selectedUser, setSelectedUser] = useState<ChatItem | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showList, setShowList] = useState(true);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: ChatItem) => {
    setSelectedUser(user);
    setShowInfo(false); // Hide info by default when selecting a new user
    setShowList(false); // Hide the user list when a user is selected (for mobile)
  };

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      selectedUser.chat.push({ right: message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Toggle User List Button for Mobile */}
      <button
        onClick={() => setShowList(!showList)}
        className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        {showList ? 'Close Users' : 'Show Users'}
      </button>

      {/* User List and Search */}
      <div
        className={`md:w-1/4 md:block md:border-r ${
          showList ? 'block fixed inset-0 bg-white z-50 w-60' : 'hidden'
        } md:relative md:z-auto md:bg-transparent`}
      >
        <div className="p-4 bg-white">
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          <ul>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectUser(item)}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${
                  selectedUser?.id === item.id ? 'bg-gray-200' : ''
                }`}
              >
                <Image width={50} height={50} src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.status}</p>
                </div>
              </li>
            ))}
          </ul>
          {/* Close Button for Mobile */}
          <button
            onClick={() => setShowList(false)}
            className="md:hidden text-red-500 mt-4"
          >
            Close
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-lg md:ml-4 p-4">
        {selectedUser ? (
          <>
            {/* User Info */}
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <div className="flex items-center">
                <Image width={50} height={50} src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-3" />
                <h2 className="font-semibold">{selectedUser.name}</h2>
              </div>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-sm text-blue-500"
              >
                {showInfo ? 'Hide Info' : 'Show Info'}
              </button>
            </div>

            {/* Info Box */}
            {showInfo && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Address:</strong> {selectedUser.address}, {selectedUser.city}, {selectedUser.country}</p>
                <p><strong>Position:</strong> {selectedUser.position}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>
            )}

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto mb-4">
              {selectedUser.chat.map((message, index) => (
                <div key={index} className={`flex ${message.left ? 'justify-start' : 'justify-end'} mb-2`}>
                  <div
                    className={`p-2 rounded-lg ${
                      message.left ? 'bg-gray-200' : 'bg-blue-500 text-white'
                    } max-w-xs`}
                  >
                    {message.left || message.right}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center border-t pt-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;