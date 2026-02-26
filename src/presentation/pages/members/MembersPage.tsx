import { useState } from 'react';
import { Profile } from '@domain/profiles/Profile';
import { getDisplayBirthDate } from '@shared/genealogy/GenealogyConfig';
import { deleteProfile } from '@application/profile-use-cases/ProfileUseCases';
import { Trash2, Edit, Search } from 'lucide-react';
import { buildGenMap } from '@application/genealogy-use-cases/ProcessAncestryBook';

import { useMembersPage } from './hooks/useMembersPage';
import { useClanSettingsContext } from '@presentation/context/ClanSettingsContext';

interface MembersPageProps {
    onEdit: (profile: Profile) => void;
}

export function MembersPage({ onEdit }: MembersPageProps) {
    const { profiles, orderedProfiles, loading, error, refresh } = useMembersPage();
    const { settings } = useClanSettingsContext();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ của ${name}?`)) {
            try {
                await deleteProfile(id);
                refresh();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Lỗi không xác định';
                alert('Lỗi: ' + message);
            }
        }
    };

    const genMap = buildGenMap(profiles);
    const genOffset = (settings?.generation_display_offset ?? 1) - 1;

    const filteredProfiles = orderedProfiles.filter(p =>
        p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.birth_date?.includes(searchTerm) ||
        p.birth_date_lunar?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-12 text-gray-400 italic">Đang tải danh sách...</div>;

    if (error) return <div className="text-red-500 p-4 border border-red-500 text-sm">{error}</div>;

    return (
        <div className="space-y-4 px-2 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest whitespace-nowrap">Danh sách thành viên</h3>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">{profiles.length}</span>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc ngày sinh..."
                        className="w-full bg-white border border-black p-2 pl-9 text-xs focus:bg-gray-50 outline-none transition-all font-bold placeholder:italic placeholder:font-normal"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto border border-black">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-left border-b border-black">
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest w-12 sm:w-16">Đời</th>
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest">Họ và Tên</th>
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest hidden sm:table-cell">Ngày Sinh</th>
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest hidden md:table-cell">Trạng thái</th>
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest hidden lg:table-cell">Thông tin thêm</th>
                            <th className="p-2 sm:p-3 text-[10px] font-black uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProfiles.length > 0 ? filteredProfiles.map(profile => (
                            <tr key={profile.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-2 sm:p-3 text-center">
                                    <span className="text-[10px] sm:text-xs font-black bg-indigo-50 text-indigo-600 px-1.5 sm:px-2 py-1 rounded-lg border border-indigo-100 inline-block min-w-[24px]">
                                        {genMap[profile.id] ? genMap[profile.id] + genOffset : '?'}
                                    </span>
                                </td>
                                <td className="p-2 sm:p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 border border-black shrink-0 overflow-hidden">
                                            {profile.image_url ? (
                                                <img src={profile.image_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300">LT</div>
                                            )}
                                        </div>
                                        <span className="font-bold text-xs sm:text-sm">{profile.full_name}</span>
                                    </div>
                                </td>
                                <td className="p-2 sm:p-3 text-xs hidden sm:table-cell">
                                    <div className="font-bold flex items-center gap-1">
                                        {getDisplayBirthDate(profile)?.value || ''}
                                        {getDisplayBirthDate(profile)?.type === 'lunar' && (
                                            <span className="text-[8px] text-indigo-500 font-black px-1 bg-indigo-50 rounded italic whitespace-nowrap">Âm</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-2 sm:p-3 hidden md:table-cell">
                                    <span className={`text-[9px] px-2 py-0.5 font-black uppercase border ${profile.status === 'Alive' ? 'border-green-600 text-green-600 bg-green-50' : 'border-gray-400 text-gray-500 bg-gray-50'}`}>
                                        {profile.status === 'Alive' ? 'CÒN SỐNG' : 'ĐÃ MẤT'}
                                    </span>
                                </td>
                                <td className="p-2 sm:p-3 text-[10px] text-gray-600 hidden lg:table-cell">
                                    {profile.status === 'Deceased' && profile.death_anniversary && (
                                        <div className="font-bold text-red-700 uppercase italic">Giỗ: {profile.death_anniversary}</div>
                                    )}
                                    {profile.phone_number && <div className="font-medium">SĐT: {profile.phone_number}</div>}
                                </td>
                                <td className="p-2 sm:p-3 text-right">
                                    <div className="flex justify-end gap-1 sm:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(profile)}
                                            className="p-1.5 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
                                            title="Sửa"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(profile.id, profile.full_name)}
                                            className="p-1.5 hover:bg-red-600 hover:text-white transition-all border border-transparent hover:border-red-600"
                                            title="Xóa"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-xs text-gray-400 italic">
                                    Không tìm thấy thành viên nào khớp với "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
