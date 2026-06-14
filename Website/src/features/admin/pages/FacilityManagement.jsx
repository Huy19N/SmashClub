import { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAdminFacilities } from '../hooks/useAdmin';

export default function FacilityManagement() {
  const { facilities, isLoading, fetchFacilities } = useAdminFacilities();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const filteredFacilities = facilities.filter(f => {
    const query = searchQuery.toLowerCase();
    return (f.name || '').toLowerCase().includes(query) ||
           (f.ownerName || '').toLowerCase().includes(query) ||
           (f.ownerEmail || '').toLowerCase().includes(query) ||
           (f.city || '').toLowerCase().includes(query) ||
           (f.district || '').toLowerCase().includes(query) ||
           (f.address || '').toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold font-display leading-tight dark:text-white">Quản Lý Chủ Sân & Cơ Sở</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Danh sách các cơ sở thể thao đăng ký trên hệ thống cùng thông tin liên hệ của chủ sân.</p>
      </div>
      <div className="relative max-w-md glass-panel p-4 sm:p-6 rounded-3xl shadow-lg border border-white/20">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo tên sân, chủ sân, địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-primary transition-colors dark:text-white"
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-3 text-amber-500" />
          <p>Không tìm thấy cơ sở nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((f) => (
            <div
              key={f.facilityId}
              className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19]/60 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between glass-panel relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:h-full transition-all" />
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-primary flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight font-display">
                      {f.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{f.address}, {f.district}, {f.city}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-150/50 dark:border-white/5 space-y-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-label">
                    Thông tin Chủ sở hữu
                  </p>
                  <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <p className="font-bold">{f.ownerName}</p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{f.ownerEmail}</span>
                    </div>
                    {f.phoneNumber && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{f.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs text-gray-400">
                <span className="font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-primary rounded-md uppercase tracking-wider font-label">
                  ID: #{f.facilityId}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Hoạt động từ: {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
