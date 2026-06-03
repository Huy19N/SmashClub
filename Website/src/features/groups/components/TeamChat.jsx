import React, { useState } from 'react';
import { Info, Plus, Image as ImageIcon, Smile, Send } from 'lucide-react';

const mockMessages = [
  {
    id: 1,
    senderId: 'user1',
    senderName: 'Nguyễn Văn An',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    text: 'Chào mọi người, ai đã có lịch thi đấu cho giải câu lạc bộ tháng tới chưa?',
    time: '10:42 AM',
    isMine: false,
  },
  {
    id: 2,
    senderId: 'user2',
    senderName: 'Trần Thị Mai',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: 'Mình cũng đang hóng đây, thấy bảo chiều nay có thông báo chính thức.',
    time: '10:43 AM',
    isMine: false,
  },
  {
    id: 3,
    senderId: 'me',
    senderName: 'Tôi',
    avatar: null,
    text: 'Mình vẫn đang đợi ban tổ chức cập nhật lịch thi đấu chính thức. Sẽ báo ngay cho mọi người nhé!',
    time: '10:44 AM',
    isMine: true,
  },
  {
    id: 4,
    senderId: 'user3',
    senderName: 'Lê Hoàng Nam',
    avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    text: '@An gửi mình lịch tập chiều nay nhé, mình muốn chuẩn bị thêm một chút.',
    time: '10:45 AM',
    isMine: false,
  }
];

export default function TeamChat({ teamName = "Smashers Hanoi", memberCount = 12 }) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');

  // Function to get initials for the group avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        senderId: 'me',
        senderName: 'Tôi',
        avatar: null,
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: true
      }]);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark overflow-hidden h-[600px] shadow-sm font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#047857] flex items-center justify-center text-white font-bold text-sm">
            {getInitials(teamName)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white font-display">Trò chuyện Nhóm: {teamName}</h3>
            <p className="text-xs text-[#047857] font-medium">{memberCount} thành viên</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white dark:bg-[#0b0f19]">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="bg-[#F4F6FB] dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            Hôm nay
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.isMine ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              {!msg.isMine && (
                <div className="flex-shrink-0 mt-1">
                  <img src={msg.avatar} alt={msg.senderName} className="h-8 w-8 rounded-full object-cover" />
                </div>
              )}

              {/* Message Content */}
              <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                {!msg.isMine && (
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ml-1">
                    {msg.senderName}
                  </span>
                )}

                <div className={`px-4 py-3 text-sm leading-relaxed ${msg.isMine
                  ? 'bg-[#047857] text-white rounded-2xl rounded-tr-sm shadow-sm'
                  : 'bg-[#EEF2FF] dark:bg-[#1e2532] text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                  }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1.5 text-right font-medium ${msg.isMine ? 'text-green-200' : 'text-gray-400 dark:text-gray-500'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-border-dark">
        <div className="flex items-center gap-2 bg-[#F4F6FB] dark:bg-[#1a2130] p-2 rounded-xl border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-colors">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
            <Plus className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
            <ImageIcon className="h-5 w-5" />
          </button>

          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />

          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
            <Smile className="h-5 w-5" />
          </button>
          <button
            className="bg-[#047857] hover:bg-[#065f46] text-white p-2 rounded-lg transition-colors flex items-center justify-center ml-1 shadow-sm"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
