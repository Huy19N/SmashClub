using Entites.DTOs.CourtCosts;

namespace Services.Interfaces;

public interface ICourtCostService
{
    Task<CourtCostResponse> CreateCourtCostAsync(Guid userId, CreateCourtCostRequest request);
    Task<List<CourtCostResponse>> GetCourtCostsByCourtAsync(int courtId);
    Task<CourtCostResponse> UpdateCourtCostAsync(Guid userId, int courtCostId, UpdateCourtCostRequest request);
    Task DeactivateCourtCostAsync(Guid userId, int courtCostId);
}
