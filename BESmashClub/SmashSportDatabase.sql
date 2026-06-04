USE master;
GO

DROP DATABASE IF EXISTS SmashClub;
GO

CREATE DATABASE SmashClub;
GO

USE SmashClub;
GO

-- ==========================================
-- 1. SYSTEM & USER MODULE
-- ==========================================
CREATE TABLE UserRoles (
    RoleId INT NOT NULL,
    RoleName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_UserRoles PRIMARY KEY (RoleId)
);

CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER DEFAULT NEWID(),
    RoleId INT NOT NULL,
    FullName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL, 
    PhoneNumber NVARCHAR(20),
    CreatedAt DATETIME CONSTRAINT DF_Users_CreatedAt DEFAULT GETDATE(),
    LastPwdChange DATETIME NOT NULL DEFAULT GETDATE(),
    IsActive BIT CONSTRAINT DF_Users_IsActive DEFAULT 1,
    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT FK_Users_RoleId FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
);

CREATE TABLE RefreshTokens (
    RefreshTokenId UNIQUEIDENTIFIER DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token VARCHAR(255) NOT NULL,
    JwtId VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ExpiredAt DATETIME NOT NULL,
    IsActive BIT CONSTRAINT DF_RefreshTokens_IsActive DEFAULT 1 NOT NULL,
    IPAddress NVARCHAR(255),
    UserAgent NVARCHAR(MAX),
    CONSTRAINT PK_RefreshTokens PRIMARY KEY (RefreshTokenId),
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT UQ_RefreshTokens_Token UNIQUE (Token)
);

-- ==========================================
-- 2. SPORT & PROFILE MODULE
-- ==========================================
CREATE TABLE Sports (
    SportId INT IDENTITY(1,1),
    SportName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    CONSTRAINT PK_Sports PRIMARY KEY (SportId),
    CONSTRAINT UQ_Sports_SportName UNIQUE (SportName)
);

CREATE TABLE SportLevels (
    SportId INT NOT NULL,
    RankValue INT NOT NULL, 
    LevelName NVARCHAR(50) NOT NULL, 
    CONSTRAINT PK_SportLevels PRIMARY KEY (SportId, RankValue),
    CONSTRAINT FK_SportLevels_Sports FOREIGN KEY (SportId) REFERENCES Sports(SportId) ON DELETE CASCADE
);

CREATE TABLE UserSportProfiles (
    UserId UNIQUEIDENTIFIER NOT NULL,
    SportId INT NOT NULL,
    RankValue INT NOT NULL, 
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_UserSportProfiles PRIMARY KEY (UserId, SportId),
    CONSTRAINT FK_UserSportProfiles_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserSportProfiles_SportLevels FOREIGN KEY (SportId, RankValue) REFERENCES SportLevels(SportId, RankValue)
);

-- ==========================================
-- 3. TEAM MODULE
-- ==========================================
CREATE TABLE TeamRoles (
    TeamRoleId INT NOT NULL,
    RoleName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_TeamRoles PRIMARY KEY (TeamRoleId)
);

CREATE TABLE Teams (
    TeamId UNIQUEIDENTIFIER DEFAULT NEWID(),
    TeamName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1 NOT NULL,
    CONSTRAINT PK_Teams PRIMARY KEY (TeamId)
);

CREATE TABLE TeamMembers (
    TeamId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    TeamRoleId INT NOT NULL,
    Wins INT DEFAULT 0 NOT NULL,   
    Losses INT DEFAULT 0 NOT NULL, 
    JoinedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_TeamMembers PRIMARY KEY (TeamId, UserId),
    CONSTRAINT FK_TeamMembers_Teams FOREIGN KEY (TeamId) REFERENCES Teams(TeamId) ON DELETE CASCADE,
    CONSTRAINT FK_TeamMembers_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_TeamMembers_TeamRoles FOREIGN KEY (TeamRoleId) REFERENCES TeamRoles(TeamRoleId)
);

CREATE TABLE TeamInvites (
    InviteId UNIQUEIDENTIFIER DEFAULT NEWID(),
    TeamId UNIQUEIDENTIFIER NOT NULL,
    CreatedByUserId UNIQUEIDENTIFIER NOT NULL,
    InviteToken VARCHAR(100) NOT NULL UNIQUE, 
    CreatedAt DATETIME DEFAULT GETDATE(),
    ExpiredAt DATETIME NOT NULL,
    MaxUses INT DEFAULT 1, 
    CurrentUses INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CONSTRAINT PK_TeamInvites PRIMARY KEY (InviteId),
    CONSTRAINT FK_TeamInvites_Teams FOREIGN KEY (TeamId) REFERENCES Teams(TeamId) ON DELETE CASCADE,
    CONSTRAINT FK_TeamInvites_Users FOREIGN KEY (CreatedByUserId) REFERENCES Users(UserId)
);

-- ==========================================
-- 4. FACILITY & COURT MODULE
-- ==========================================
CREATE TABLE Facilities(
    FacilityId INT IDENTITY(1,1),
    OwnerId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    District NVARCHAR(50) NOT NULL,
    [Address] NVARCHAR(255),
    [Location] GEOGRAPHY,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Facilities PRIMARY KEY (FacilityId),
    CONSTRAINT FK_Facilities_Users FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
);

CREATE TABLE CourtStatus(
    StatusId INT NOT NULL,
    StatusName NVARCHAR(50),
    CONSTRAINT PK_CourtStatus PRIMARY KEY (StatusId)
);

CREATE TABLE Courts(
    CourtId INT IDENTITY(1,1),
    FacilityId INT NOT NULL,
    SportId INT NOT NULL,
    CourtName NVARCHAR(50) NOT NULL,
    StatusId INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_Courts PRIMARY KEY (CourtId),
    CONSTRAINT FK_Courts_Sports FOREIGN KEY (SportId) REFERENCES Sports(SportId),
    CONSTRAINT FK_Courts_Facilities FOREIGN KEY (FacilityId) REFERENCES Facilities(FacilityId),
    CONSTRAINT FK_Courts_CourtStatus FOREIGN KEY (StatusId) REFERENCES CourtStatus(StatusId)
);

CREATE TABLE CourtCosts(
    CourtCostId INT IDENTITY(1,1),
    FacilityId INT NOT NULL,
    CourtId INT NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    DurationMinutes INT NOT NULL DEFAULT 60, -- Đã sửa: Chuyển từ TIME sang INT để tính phút
    Cost MONEY NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_CourtCosts PRIMARY KEY (CourtCostId, FacilityId),
    CONSTRAINT FK_CourtCosts_Courts FOREIGN KEY (CourtId) REFERENCES Courts(CourtId)
);

-- ==========================================
-- 5. BOOKING MODULE
-- ==========================================
CREATE TABLE BookingStatus (
    StatusId INT NOT NULL,
    StatusName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_BookingStatus PRIMARY KEY (StatusId)
);

CREATE TABLE Bookings (
    BookingId UNIQUEIDENTIFIER DEFAULT NEWID(),
    CourtId INT NOT NULL,
    BookedByUserId UNIQUEIDENTIFIER NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    TotalCost DECIMAL(18,2) DEFAULT 0,
    StatusId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Bookings PRIMARY KEY (BookingId),
    CONSTRAINT FK_Bookings_Courts FOREIGN KEY (CourtId) REFERENCES Courts(CourtId),
    CONSTRAINT FK_Bookings_Users FOREIGN KEY (BookedByUserId) REFERENCES Users(UserId) ON DELETE NO ACTION,
    CONSTRAINT FK_Bookings_BookingStatus FOREIGN KEY (StatusId) REFERENCES BookingStatus(StatusId)
);

-- ==========================================
-- 6. SCHEDULING MODULE
-- ==========================================
CREATE TABLE Schedules (
    ScheduleId UNIQUEIDENTIFIER DEFAULT NEWID(),
    HostTeamId UNIQUEIDENTIFIER NOT NULL,
    BookingId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    MaxParticipants INT NOT NULL,
    CostPerPerson DECIMAL(18,2) DEFAULT 0, 
    CostNote NVARCHAR(MAX),            
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Schedules PRIMARY KEY (ScheduleId),
    CONSTRAINT FK_Schedules_HostTeam FOREIGN KEY (HostTeamId) REFERENCES Teams(TeamId) ON DELETE CASCADE,
    CONSTRAINT FK_Schedules_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(BookingId),
    CONSTRAINT CK_Schedules_MaxParticipants CHECK (MaxParticipants > 0)
);

CREATE TABLE ScheduleParticipants (
    ScheduleId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    IsAttended BIT DEFAULT 0 NOT NULL,
    JoinedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_ScheduleParticipants PRIMARY KEY (ScheduleId, UserId),
    CONSTRAINT FK_ScheduleParticipants_Schedules FOREIGN KEY (ScheduleId) REFERENCES Schedules(ScheduleId) ON DELETE CASCADE,
    CONSTRAINT FK_ScheduleParticipants_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE NO ACTION
);

-- ==========================================
-- 7. EMAIL MODULE
-- ==========================================
CREATE TABLE EmailConfirms(
    Code VARCHAR(5) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE() NOT NULL,
    ExpiredAt DATETIME NOT NULL,
    CONSTRAINT PK_EmailConfirms PRIMARY KEY (Code, Email)
);

-- ==========================================
-- 8. SUBSCRIPTION MODULE
-- ==========================================
CREATE TABLE SubscriptionTiers (
    TierId INT IDENTITY(1,1),
    TierName NVARCHAR(50) NOT NULL, 
    Description NVARCHAR(MAX),
    CONSTRAINT PK_SubscriptionTiers PRIMARY KEY (TierId),
    CONSTRAINT UQ_SubscriptionTiers_Name UNIQUE (TierName)
);

CREATE TABLE SubscriptionPlans (
    PlanId INT IDENTITY(1,1),
    TierId INT NOT NULL,
    DurationMonths INT NOT NULL, 
    Price DECIMAL(18,2) NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CONSTRAINT PK_SubscriptionPlans PRIMARY KEY (PlanId),
    CONSTRAINT FK_SubscriptionPlans_Tiers FOREIGN KEY (TierId) REFERENCES SubscriptionTiers(TierId)
);

CREATE TABLE UserSubscriptions (
    UserSubscriptionId UNIQUEIDENTIFIER DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    PlanId INT NOT NULL,
    StartDate DATETIME NOT NULL DEFAULT GETDATE(),
    EndDate DATETIME NOT NULL,
    IsTrial BIT DEFAULT 0 NOT NULL,     
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_UserSubscriptions PRIMARY KEY (UserSubscriptionId),
    CONSTRAINT FK_UserSubscriptions_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserSubscriptions_Plans FOREIGN KEY (PlanId) REFERENCES SubscriptionPlans(PlanId)
);

-- ==========================================
-- 9. CHAT MODULE 
-- ==========================================
CREATE TABLE TeamMessages (
    MessageId UNIQUEIDENTIFIER DEFAULT NEWID(),
    TeamId UNIQUEIDENTIFIER NOT NULL,
    SenderId UNIQUEIDENTIFIER NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    SentAt DATETIME DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0 NOT NULL,
    CONSTRAINT PK_TeamMessages PRIMARY KEY (MessageId),
    CONSTRAINT FK_TeamMessages_Teams FOREIGN KEY (TeamId) REFERENCES Teams(TeamId) ON DELETE CASCADE,
    CONSTRAINT FK_TeamMessages_Users FOREIGN KEY (SenderId) REFERENCES Users(UserId) ON DELETE NO ACTION
);

-- ==========================================
-- 10. PAYMENT MODULE (Provider-agnostic)
-- ==========================================

-- Bảng trạng thái thanh toán
CREATE TABLE PaymentStatuses (
    StatusId INT NOT NULL,
    StatusName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_PaymentStatuses PRIMARY KEY (StatusId)
);

-- Seed data cho PaymentStatuses
INSERT INTO PaymentStatuses (StatusId, StatusName) VALUES
    (1, N'Pending'),
    (2, N'Paid'),
    (3, N'Cancelled'),
    (4, N'Expired'),
    (5, N'Refunded');
GO

-- Bảng giao dịch thanh toán (generic cho nhiều provider)
CREATE TABLE Payments (
    PaymentId UNIQUEIDENTIFIER DEFAULT NEWID(),
    OrderCode BIGINT NOT NULL,                        -- Mã đơn hàng (unique per provider)
    PaymentType NVARCHAR(20) NOT NULL,                -- 'Subscription' hoặc 'Booking'
    ReferenceId NVARCHAR(100) NOT NULL,               -- ID tham chiếu (BookingId / UserSubscriptionId)
    UserId UNIQUEIDENTIFIER NOT NULL,                 -- Người thanh toán
    Amount DECIMAL(18,2) NOT NULL,                    -- Số tiền
    [Description] NVARCHAR(255),                      -- Mô tả giao dịch
    StatusId INT NOT NULL DEFAULT 1,                  -- FK → PaymentStatuses
    PaymentProvider NVARCHAR(50) NOT NULL DEFAULT 'PayOS',  -- 'PayOS', 'VNPay', 'Momo', etc.
    CheckoutUrl NVARCHAR(500),                        -- URL thanh toán
    TransactionId NVARCHAR(100),                      -- Transaction ID từ provider
    CreatedAt DATETIME DEFAULT GETDATE(),
    PaidAt DATETIME,
    CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),
    CONSTRAINT UQ_Payments_OrderCode UNIQUE (OrderCode),
    CONSTRAINT FK_Payments_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Payments_PaymentStatuses FOREIGN KEY (StatusId) REFERENCES PaymentStatuses(StatusId)
);
GO

-- ==========================================
-- 11. PAYOUT MODULE (Lệnh chi cho chủ sân)
-- ==========================================

-- Bảng trạng thái lệnh chi
CREATE TABLE PayoutStatuses (
    StatusId INT NOT NULL,
    StatusName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_PayoutStatuses PRIMARY KEY (StatusId)
);

INSERT INTO PayoutStatuses (StatusId, StatusName) VALUES
    (1, N'Pending'),
    (2, N'Processing'),
    (3, N'Completed'),
    (4, N'Failed');
GO

-- Bảng lệnh chi (chuyển tiền từ platform sang chủ sân)
CREATE TABLE Payouts (
    PayoutId UNIQUEIDENTIFIER DEFAULT NEWID(),
    PaymentId UNIQUEIDENTIFIER NOT NULL,              -- Giao dịch gốc
    FacilityId INT NOT NULL,                          -- Sân bãi
    OwnerUserId UNIQUEIDENTIFIER NOT NULL,            -- Chủ sân
    Amount DECIMAL(18,2) NOT NULL,                    -- Số tiền cần chuyển
    StatusId INT NOT NULL DEFAULT 1,                  -- FK → PayoutStatuses
    BankAccountNo NVARCHAR(50),                       -- Snapshot số tài khoản tại thời điểm tạo
    BankName NVARCHAR(100),                           -- Snapshot tên ngân hàng
    AccountHolder NVARCHAR(255),                      -- Snapshot tên chủ tài khoản
    CreatedAt DATETIME DEFAULT GETDATE(),
    CompletedAt DATETIME,
    Note NVARCHAR(500),
    CONSTRAINT PK_Payouts PRIMARY KEY (PayoutId),
    CONSTRAINT FK_Payouts_Payments FOREIGN KEY (PaymentId) REFERENCES Payments(PaymentId),
    CONSTRAINT FK_Payouts_Facilities FOREIGN KEY (FacilityId) REFERENCES Facilities(FacilityId),
    CONSTRAINT FK_Payouts_Users FOREIGN KEY (OwnerUserId) REFERENCES Users(UserId)
);
GO

-- ==========================================
-- 12. FACILITY BANK ACCOUNTS
-- ==========================================

-- Thông tin ngân hàng của chủ sân (để nhận lệnh chi)
CREATE TABLE FacilityBankAccounts (
    FacilityId INT NOT NULL,
    BankName NVARCHAR(100) NOT NULL,
    AccountNumber NVARCHAR(50) NOT NULL,
    AccountHolder NVARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME,
    CONSTRAINT PK_FacilityBankAccounts PRIMARY KEY (FacilityId),
    CONSTRAINT FK_FacilityBankAccounts_Facilities FOREIGN KEY (FacilityId) REFERENCES Facilities(FacilityId)
);
GO



GO


-- ==========================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ==========================================
USE SmashClub;
GO

-- ==========================================
-- 1. THÊM DANH MỤC CƠ BẢN (MASTER DATA)
-- ==========================================
INSERT INTO UserRoles (RoleId, RoleName) VALUES (1, N'Admin'), (2, N'User'), (3, N'FacilityOwner');
INSERT INTO TeamRoles (TeamRoleId, RoleName) VALUES (1, N'Leader'), (2, N'Member');
INSERT INTO CourtStatus (StatusId, StatusName) VALUES (1, N'Sẵn sàng'), (2, N'Bảo trì');
INSERT INTO BookingStatus (StatusId, StatusName) VALUES (1, N'Pending'), (2, N'Confirmed'), (3, N'Cancelled');

-- (PaymentStatuses và PayoutStatuses đã được insert trong schema của bạn, nhưng tôi chạy lại cho chắc chắn nếu bị xóa)
IF NOT EXISTS (SELECT 1 FROM PaymentStatuses WHERE StatusId = 1)
BEGIN
    INSERT INTO PaymentStatuses (StatusId, StatusName) VALUES (1, N'Pending'), (2, N'Paid'), (3, N'Cancelled'), (4, N'Expired'), (5, N'Refunded');
    INSERT INTO PayoutStatuses (StatusId, StatusName) VALUES (1, N'Pending'), (2, N'Processing'), (3, N'Completed'), (4, N'Failed');
END

INSERT INTO Sports (SportName, Description) VALUES 
    (N'Cầu Lông', N'Sân thảm tiêu chuẩn BWF'), 
    (N'Bóng Bàn', N'Bàn thi đấu quốc tế ITTF'),
    (N'Pickleball', N'Sân Pickleball tiêu chuẩn ngoài trời');

INSERT INTO SportLevels (SportId, LevelName, RankValue) VALUES 
    (1, N'Cơ bản', 1), (1, N'Nâng cao', 2), (1, N'Tuyển thủ', 3),
    (2, N'Cơ bản', 1), (2, N'Nghiệp dư', 2), (2, N'Tuyển thủ', 3),
    (3, N'Newbie', 1), (3, N'Amateur', 2), (3, N'Pro', 3);

-- ==========================================
-- 2. THÊM CẤP ĐỘ VÀ GÓI SUBSCRIPTION
-- ==========================================
INSERT INTO SubscriptionTiers (TierName, Description) VALUES 
    ('Basic', N'Tài khoản miễn phí'),
    ('Pro', N'Gói nâng cao cho người chơi thường xuyên'),
    ('Club Owner', N'Gói quản lý dành cho chủ sân');

DECLARE @BasicId INT = (SELECT TierId FROM SubscriptionTiers WHERE TierName = 'Basic');
DECLARE @ProId INT = (SELECT TierId FROM SubscriptionTiers WHERE TierName = 'Pro');
DECLARE @OwnerId INT = (SELECT TierId FROM SubscriptionTiers WHERE TierName = 'Club Owner');

INSERT INTO SubscriptionPlans (TierId, DurationMonths, Price) VALUES 
    (@BasicId, 0, 0),
    (@ProId, 1, 49000), (@ProId, 6, 250000), (@ProId, 12, 450000),
    (@OwnerId, 1, 199000), (@OwnerId, 12, 1990000);

-- ==========================================
-- 3. KHỞI TẠO BIẾN CHO DATA LIÊN KẾT
-- ==========================================
DECLARE @AdminId UNIQUEIDENTIFIER = NEWID();
DECLARE @Owner1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @User1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @User2Id UNIQUEIDENTIFIER = NEWID();

DECLARE @Team1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Facility1Id INT;
DECLARE @Court1Id INT, @Court2Id INT;
DECLARE @Booking1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Schedule1Id UNIQUEIDENTIFIER = NEWID();
DECLARE @Payment1Id UNIQUEIDENTIFIER = NEWID();

-- ==========================================
-- 4. THÊM NGƯỜI DÙNG & PROFILE
-- ==========================================
INSERT INTO Users (UserId, RoleId, FullName, Email, Password, PhoneNumber) VALUES 
    (@AdminId, 1, N'System Admin', 'admin@smashclub.vn', 'hashed_pwd_admin', '0900000000'),
    (@Owner1Id, 3, N'Trần Chủ Sân', 'owner1@smashclub.vn', 'hashed_pwd_owner', '0911111111'),
    (@User1Id, 2, N'Nguyễn Quang Hải', 'hai.nguyen@gmail.com', 'hashed_pwd_user', '0922222222'),
    (@User2Id, 2, N'Lê Thanh Thúy', 'thuy.le@gmail.com', 'hashed_pwd_user', '0933333333');

INSERT INTO UserSportProfiles (UserId, SportId, RankValue) VALUES 
    (@User1Id, 1, 2), -- Hải chơi Cầu lông nâng cao
    (@User1Id, 3, 1), -- Hải chơi Pickleball newbie
    (@User2Id, 1, 1); -- Thúy chơi Cầu lông cơ bản

-- Gán gói Pro cho User1 (Đã thanh toán)
DECLARE @ProPlan1Month INT = (SELECT TOP 1 PlanId FROM SubscriptionPlans WHERE TierId = @ProId AND DurationMonths = 1);
DECLARE @Sub1Id UNIQUEIDENTIFIER = NEWID();
INSERT INTO UserSubscriptions (UserSubscriptionId, UserId, PlanId, StartDate, EndDate, IsTrial, IsActive)
VALUES (@Sub1Id, @User1Id, @ProPlan1Month, GETDATE(), DATEADD(month, 1, GETDATE()), 0, 1);

-- Thanh toán cho gói Pro của User1
INSERT INTO Payments (PaymentId, OrderCode, PaymentType, ReferenceId, UserId, Amount, [Description], StatusId, PaymentProvider)
VALUES (NEWID(), 100001, 'Subscription', CONVERT(NVARCHAR(100), @Sub1Id), @User1Id, 49000, N'Thanh toán gói Pro 1 tháng', 2, 'PayOS');

-- ==========================================
-- 5. TẠO CƠ SỞ VẬT CHẤT & BẢNG GIÁ
-- ==========================================
-- Chủ sân mở sân tại TP.HCM
INSERT INTO Facilities (OwnerId, Name, City, District, [Address]) VALUES 
    (@Owner1Id, N'SmashClub Arena Quận 10', N'Hồ Chí Minh', N'Quận 10', N'285 Cách Mạng Tháng 8, Phường 12');
SET @Facility1Id = SCOPE_IDENTITY();

-- Cấu hình tài khoản ngân hàng cho Sân
INSERT INTO FacilityBankAccounts (FacilityId, BankName, AccountNumber, AccountHolder)
VALUES (@Facility1Id, N'Vietcombank', N'0123456789', N'TRAN CHU SAN');

-- Thêm Sân con
INSERT INTO Courts (FacilityId, SportId, CourtName, StatusId, IsActive) VALUES 
    (@Facility1Id, 1, N'Sân Cầu Lông VIP 1', 1, 1),
    (@Facility1Id, 1, N'Sân Cầu Lông VIP 2', 1, 1),
    (@Facility1Id, 3, N'Sân Pickleball Ngoài Trời', 1, 1);

-- Lưu lại ID của Sân VIP 1 để Book
SET @Court1Id = (SELECT TOP 1 CourtId FROM Courts WHERE FacilityId = @Facility1Id AND CourtName = N'Sân Cầu Lông VIP 1');

-- Cấu hình giá sân (CourtCosts)
-- Giá giờ hành chính (08:00 - 17:00): 100k/giờ
INSERT INTO CourtCosts (FacilityId, CourtId, StartTime, EndTime, DurationMinutes, Cost, IsActive)
VALUES (@Facility1Id, @Court1Id, '08:00', '17:00', 60, 100000, 1);

-- Giá giờ vàng (17:00 - 22:00): 150k/giờ
INSERT INTO CourtCosts (FacilityId, CourtId, StartTime, EndTime, DurationMinutes, Cost, IsActive)
VALUES (@Facility1Id, @Court1Id, '17:00', '22:00', 60, 150000, 1);

-- ==========================================
-- 6. TẠO TEAM & GIAO TIẾP
-- ==========================================
INSERT INTO Teams (TeamId, TeamName, Description) VALUES 
    (@Team1Id, N'SaiGon Smashers', N'Hội đam mê cầu lông khu vực trung tâm TP.HCM');

INSERT INTO TeamMembers (TeamId, UserId, TeamRoleId, Wins, Losses) VALUES 
    (@Team1Id, @User1Id, 1, 15, 3), -- Hải là Leader
    (@Team1Id, @User2Id, 2, 2, 8);  -- Thúy là Member

INSERT INTO TeamMessages (TeamId, SenderId, Content) VALUES 
    (@Team1Id, @User1Id, N'Tối thứ 7 tuần này anh em ra sân Quận 10 nhé, mình vừa chốt sân xong!'),
    (@Team1Id, @User2Id, N'Tuyệt vời anh ơi, em đăng ký 1 slot nha.');

-- ==========================================
-- 7. ĐẶT SÂN & THANH TOÁN (BOOKING & PAYMENT & PAYOUT)
-- ==========================================
-- User1 đặt sân VIP 1 từ 18:00 đến 20:00 (Giờ vàng -> 2 tiếng = 300k)
DECLARE @PlayStartTime DATETIME = DATEADD(hour, 18, CAST(CAST(DATEADD(day, 2, GETDATE()) AS DATE) AS DATETIME)); 
DECLARE @PlayEndTime DATETIME = DATEADD(hour, 2, @PlayStartTime);

INSERT INTO Bookings (BookingId, CourtId, BookedByUserId, StartTime, EndTime, TotalCost, StatusId) VALUES 
    (@Booking1Id, @Court1Id, @User1Id, @PlayStartTime, @PlayEndTime, 300000, 2); -- Status 2: Confirmed

-- Thanh toán cho Booking
INSERT INTO Payments (PaymentId, OrderCode, PaymentType, ReferenceId, UserId, Amount, [Description], StatusId, PaymentProvider, PaidAt)
VALUES (@Payment1Id, 200001, 'Booking', CONVERT(NVARCHAR(100), @Booking1Id), @User1Id, 300000, N'Thanh toán tiền sân cuối tuần', 2, 'VNPay', GETDATE());

-- Tạo lệnh chi (Payout) chuyển tiền từ Platform cho Chủ Sân (Giả sử cắt phế 10%, trả chủ sân 270k)
INSERT INTO Payouts (PayoutId, PaymentId, FacilityId, OwnerUserId, Amount, StatusId, BankAccountNo, BankName, AccountHolder, Note)
VALUES (NEWID(), @Payment1Id, @Facility1Id, @Owner1Id, 270000, 1, N'0123456789', N'Vietcombank', N'TRAN CHU SAN', N'Doanh thu booking ngày ' + CONVERT(NVARCHAR, @PlayStartTime, 103));

-- ==========================================
-- 8. SCHEDULING (GỌI ĐÀO MỎ/MỞ KÈO)
-- ==========================================
INSERT INTO Schedules (ScheduleId, HostTeamId, BookingId, Title, MaxParticipants, CostPerPerson, CostNote) VALUES 
    (@Schedule1Id, @Team1Id, @Booking1Id, N'Giao lưu đánh đôi Nam Nữ', 6, 60000, N'Tiền sân 300k + 60k tiền trà đá cầu cước, chia đều 6 người');

INSERT INTO ScheduleParticipants (ScheduleId, UserId, IsAttended) VALUES 
    (@Schedule1Id, @User1Id, 1), 
    (@Schedule1Id, @User2Id, 0);

PRINT N'✅ Đã khởi tạo thành công Seed Data hoàn chỉnh cho hệ thống SmashClub!';
GO