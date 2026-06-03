using System.ComponentModel.DataAnnotations;

namespace Entites.DTOs.CourtCosts;

public class UpdateCourtCostRequest
{
    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "DurationMinutes phải lớn hơn 0.")]
    public int? DurationMinutes { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Cost phải lớn hơn 0.")]
    public decimal? Cost { get; set; }

    public bool? IsActive { get; set; }
}
