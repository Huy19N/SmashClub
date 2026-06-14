import { useState, useEffect } from 'react';
import {
  UserCircle,
  Mail,
  Phone,
  Lock,
  Save,
  ShieldAlert
} from 'lucide-react';
import axios from '../../../config/axios';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const [profile, setProfile] = useState({ fullName: '', email: '', phoneNumber: '', roleName: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Forms states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/users/me');
      if (response.data && response.data.success) {
        const data = response.data.data;
        setProfile(data);
        setFullName(data.fullName || '');
        setPhoneNumber(data.phoneNumber || '');
      } else {
        toast.error('Lỗi khi tải thông tin cá nhân.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể kết nối đến server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update Profile Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Họ tên không được để trống.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const response = await axios.put('/users/me', { fullName, phoneNumber });
      if (response.data && response.data.success) {
        toast.success('Cập nhật thông tin thành công.');
        setProfile(prev => ({ ...prev, fullName, phoneNumber }));
        // Refresh local storage if name changed
        localStorage.setItem('name', fullName);
      } else {
        toast.error('Cập nhật thông tin thất bại.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không trùng khớp.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải dài từ 6 ký tự trở lên.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const response = await axios.patch('/users/me/password', { currentPassword, newPassword });
      if (response.data && response.data.success) {
        toast.success('Đổi mật khẩu thành công.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.data?.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Mật khẩu hiện tại không chính xác.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold font-display leading-tight dark:text-white">Cá Nhân</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Xem thông tin cá nhân và thay đổi mật khẩu quản trị.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19]/60 border border-gray-100 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-primary flex items-center justify-center border border-emerald-500/20">
            <UserCircle className="w-16 h-16" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg leading-tight font-display dark:text-white">{profile.fullName}</h2>
            <p className="text-xs text-gray-500 mt-1">{profile.email}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-primary rounded-full text-xs font-bold font-label uppercase border border-emerald-500/20 dark:border-primary/20">
            Role: {profile.roleName}
          </div>
          <div className="text-[11px] text-gray-400 dark:text-gray-500 w-full pt-4 border-t border-gray-100 dark:border-white/5 font-label">
            Hoạt động từ: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* Forms column */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19]/60 border border-gray-100 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-display mb-4 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-emerald-600 dark:text-primary" />
              Thông tin tài khoản
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Số điện thoại</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Địa chỉ email (Không thể thay đổi)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/10 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-label flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>

          {/* Password form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19]/60 border border-gray-100 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-display mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-primary" />
              Đổi mật khẩu bảo mật
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu cũ của bạn"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-label">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-label flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isUpdatingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
