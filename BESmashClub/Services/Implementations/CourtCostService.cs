using Entites.DTOs.CourtCosts;
using Entites.Models;
using Repositories;
using Services.Interfaces;

namespace Services.Implementations;

public class CourtCostService : ICourtCostService
{
    private readonly UnitOfWork _unitOfWork;

    public CourtCostService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CourtCostResponse> CreateCourtCostAsync(Guid userId, CreateCourtCostRequest request)
    {
        // Validate court exists
        var court = await _unitOfWork.Courts.GetDetailAsync(request.CourtId);
        if (court == null)
            throw new KeyNotFoundException("Không tìm thấy sân.");

        // Check ownership via facility
        if (!await _unitOfWork.Facilities.IsOwnerAsync(court.FacilityId, userId))
            throw new UnauthorizedAccessException("Bạn không có quyền quản lý giá sân này.");

        // Validate time range
        if (request.StartTime >= request.EndTime)
            throw new InvalidOperationException("Giờ bắt đầu phải trước giờ kết thúc.");

        // Check overlap with existing CourtCosts on same court
        if (await _unitOfWork.CourtCosts.HasOverlapAsync(request.CourtId, request.StartTime, request.EndTime))
            throw new InvalidOperationException("Khung giờ này bị trùng với bảng giá đã có.");

        var courtCost = new CourtCost
        {
            FacilityId = court.FacilityId,
            CourtId = request.CourtId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            DurationMinutes = request.DurationMinutes,
            Cost = request.Cost,
            IsActive = true
        };

        await _unitOfWork.CourtCosts.CreateAsync(courtCost);

        return MapToResponse(courtCost, court.CourtName);
    }

    public async Task<List<CourtCostResponse>> GetCourtCostsByCourtAsync(int courtId)
    {
        var courtCosts = await _unitOfWork.CourtCosts.GetByCourtIdAsync(courtId);
        return courtCosts.Select(cc => MapToResponse(cc, cc.Court?.CourtName)).ToList();
    }

    public async Task<CourtCostResponse> UpdateCourtCostAsync(Guid userId, int courtCostId, UpdateCourtCostRequest request)
    {
        var courtCost = await _unitOfWork.CourtCosts.GetByCourtCostIdAsync(courtCostId);
        if (courtCost == null)
            throw new KeyNotFoundException("Không tìm thấy bảng giá.");

        // Check ownership via facility
        if (!await _unitOfWork.Facilities.IsOwnerAsync(courtCost.FacilityId, userId))
            throw new UnauthorizedAccessException("Bạn không có quyền cập nhật giá sân này.");

        var newStart = request.StartTime ?? courtCost.StartTime;
        var newEnd = request.EndTime ?? courtCost.EndTime;

        if (newStart >= newEnd)
            throw new InvalidOperationException("Giờ bắt đầu phải trước giờ kết thúc.");

        // Check overlap if time changed
        if (request.StartTime.HasValue || request.EndTime.HasValue)
        {
            if (await _unitOfWork.CourtCosts.HasOverlapAsync(courtCost.CourtId, newStart, newEnd, courtCostId))
                throw new InvalidOperationException("Khung giờ này bị trùng với bảng giá đã có.");
        }

        courtCost.StartTime = newStart;
        courtCost.EndTime = newEnd;

        if (request.DurationMinutes.HasValue)
            courtCost.DurationMinutes = request.DurationMinutes.Value;

        if (request.Cost.HasValue)
            courtCost.Cost = request.Cost.Value;

        if (request.IsActive.HasValue)
            courtCost.IsActive = request.IsActive.Value;

        await _unitOfWork.CourtCosts.UpdateAsync(courtCost);

        var court = await _unitOfWork.Courts.GetByIdAsync(courtCost.CourtId);
        return MapToResponse(courtCost, court?.CourtName);
    }

    public async Task DeactivateCourtCostAsync(Guid userId, int courtCostId)
    {
        var courtCost = await _unitOfWork.CourtCosts.GetByCourtCostIdAsync(courtCostId);
        if (courtCost == null)
            throw new KeyNotFoundException("Không tìm thấy bảng giá.");

        if (!await _unitOfWork.Facilities.IsOwnerAsync(courtCost.FacilityId, userId))
            throw new UnauthorizedAccessException("Bạn không có quyền xóa giá sân này.");

        courtCost.IsActive = false;
        await _unitOfWork.CourtCosts.UpdateAsync(courtCost);
    }

    #region Helpers

    private static CourtCostResponse MapToResponse(CourtCost cc, string? courtName)
    {
        return new CourtCostResponse
        {
            CourtCostId = cc.CourtCostId,
            FacilityId = cc.FacilityId,
            CourtId = cc.CourtId,
            CourtName = courtName,
            StartTime = cc.StartTime,
            EndTime = cc.EndTime,
            DurationMinutes = cc.DurationMinutes,
            Cost = cc.Cost,
            IsActive = cc.IsActive
        };
    }

    #endregion
}
