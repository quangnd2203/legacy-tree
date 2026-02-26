-- ==============================================================================
-- 🚀 KICK-OFF MIGRATION: LEGACY TREE (GIA PHẢ ĐIỆN TỬ)
-- Description: Khởi tạo toàn bộ cấu trúc CSDL cốt lõi (Core Schema)
-- Version: 1.0 (Architecture Baseline)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. UTILITY FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------
-- Hàm tự động cập nhật timestamp (updated_at) mỗi khi có record thay đổi
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. TABLE: CLAN_SETTINGS (Siêu dữ liệu dòng họ - Singleton)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clan_settings (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Định danh
    clan_name               TEXT NOT NULL DEFAULT 'Chưa cấu hình',
    branch_name             TEXT,           -- Tiều chi / Phái (e.g., Đệ Nhất Phái)
    sub_branch_name         TEXT,           -- Chi (e.g., Đệ Tứ Chi)
    
    -- Địa lý
    hometown_village        TEXT,           -- Làng / Thôn / Ấp
    hometown_commune        TEXT,           -- Xã / Phường / Thị trấn
    hometown_district       TEXT,           -- Huyện / Quận / Thị xã
    hometown_province       TEXT,           -- Tỉnh / Thành phố
    
    -- Phả ký
    book_title              TEXT,           -- Tiêu đề sách gia phả
    book_compiled_year      TEXT,           -- Năm lập phả (vd: Năm Giáp Ngọ 1954)
    book_compiler_name      TEXT,           -- Tên người biên soạn
    generation_display_offset INTEGER DEFAULT 1, -- Độ lệch thế hệ (Đời 1 trong sách = Đời mấy của Thuỷ Tổ)
    preface_poem            TEXT,           -- Lời tựa mở đầu sách (HTML định dạng)
    
    -- Hệ thống
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_by              UUID REFERENCES auth.users(id)
);

-- Tạo Trigger cho Clan Settings
DROP TRIGGER IF EXISTS trg_clan_settings_updated_at ON public.clan_settings;
CREATE TRIGGER trg_clan_settings_updated_at
BEFORE UPDATE ON public.clan_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Khởi tạo Row mặc định duy nhất cho Clan Settings
INSERT INTO public.clan_settings (clan_name) 
VALUES ('Gia Tộc Việt Nam') 
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. TABLE: PROFILES (Hồ sơ thành viên nòng cốt)
-- ------------------------------------------------------------------------------
CREATE TYPE public.profile_gender AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE public.profile_status AS ENUM ('Alive', 'Deceased');

CREATE TABLE IF NOT EXISTS public.profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name               TEXT NOT NULL,
    
    -- Thông tin sinh thần
    birth_date              DATE,                  -- Ngày sinh dương lịch
    birth_date_lunar        VARCHAR(50),           -- Ngày sinh âm lịch (text để chứa năm can chi nếu không rành ngày)
    birth_time              TIME,                  -- Giờ sinh
    gender                  public.profile_gender,
    
    -- Trạng thái & Thờ tự
    status                  public.profile_status DEFAULT 'Alive',
    death_anniversary       VARCHAR(50),           -- Ngày giỗ âm lịch (text: "Ngày 15 Tháng 8")
    grave_location_coords   TEXT,                  -- Tọa độ phần mộ (Google Maps URL/LatLong)
    grave_image_url         TEXT,                  -- Ảnh mộ phần
    
    -- Hình ảnh & Liên hệ
    image_url               TEXT,                  -- Avatar
    phone_number            VARCHAR(20),           -- SĐT (với người còn sống)
    
    -- LIÊN KẾT GIA ĐÌNH (Graph Edges / Self-Referencing Foreign Keys)
    father_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Ràng buộc cha
    mother_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Ràng buộc mẹ
    partner_id              UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Ràng buộc phối ngẫu (vợ/chồng)
    
    -- Chỉ mục phân cấp
    seniority_index         INTEGER,               -- Thứ bậc trong gia đình (1: Con cả, 2: Con thứ...)
    
    -- Hệ thống
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Index tối ưu truy vấn đồ thị (Graph lookup optimization)
CREATE INDEX idx_profiles_father_id ON public.profiles(father_id);
CREATE INDEX idx_profiles_mother_id ON public.profiles(mother_id);
CREATE INDEX idx_profiles_partner_id ON public.profiles(partner_id);

-- Tạo Trigger cho Profiles
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Phân quyền truy cập 100% bằng DB Policy để đảm bảo Clean Architecture
-- ==============================================================================

-- Bật RLS cho các bảng
ALTER TABLE public.clan_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. RLS cho CLAN_SETTINGS
-- Ai cũng xem được thông tin dòng họ (Public Read)
CREATE POLICY "clan_settings_public_read" 
ON public.clan_settings FOR SELECT USING (true);

-- Chỉ người có tài khoản (Trưởng tộc/Admin) mới được sửa setting (Auth Update)
CREATE POLICY "clan_settings_auth_update" 
ON public.clan_settings FOR UPDATE 
TO authenticated USING (true) WITH CHECK (true);

-- 2. RLS cho PROFILES
-- Ai cũng xem được gia phả (Public Read)
CREATE POLICY "profiles_public_read" 
ON public.profiles FOR SELECT USING (true);

-- Cho phép Contributor (đã login) thêm/sửa/xoá hồ sơ mới
CREATE POLICY "profiles_auth_insert" 
ON public.profiles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "profiles_auth_update" 
ON public.profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "profiles_auth_delete" 
ON public.profiles FOR DELETE TO authenticated USING (true);

-- ==============================================================================
-- THIẾT LẬP BỘ CHỨA TỆP TIN (SUPABASE STORAGE BUCKETS)
-- ==============================================================================
-- Khởi tạo Bucket lưu Avatar thành viên và Ảnh mộ phần (Nếu thư viện Storage đã enable)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('avatars', 'avatars', true),
    ('graves', 'graves', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép public đọc ảnh
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Grave Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'graves');

-- Cho phép auth users upload ảnh
CREATE POLICY "Auth Insert Avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Auth Insert Grave" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'graves');

-- Comments Document
COMMENT ON TABLE public.profiles IS 'Bảng hồ sơ 1 thành viên Gia Phả.';
COMMENT ON COLUMN public.profiles.father_id IS 'Khóa ngoại trỏ đến người cha trong chính bảng profiles để tạo cây nhánh (Tree Edges).';
COMMENT ON COLUMN public.profiles.seniority_index IS 'Thứ bậc (Đích tôn = 1, Đích ngạn = 2, v.v.).';
