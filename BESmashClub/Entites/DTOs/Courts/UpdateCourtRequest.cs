using System.ComponentModel.DataAnnotations;

namespace Entites.DTOs.Courts;

public class UpdateCourtRequest
{
    [MaxLength(50)]
    public string? CourtName { get; set; }

    public int? SportId { get; set; }

    public int? StatusId { get; set; }

    public bool? IsActive { get; set; }
}
