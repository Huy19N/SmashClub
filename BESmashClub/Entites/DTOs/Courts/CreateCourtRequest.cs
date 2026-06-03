using System.ComponentModel.DataAnnotations;

namespace Entites.DTOs.Courts;

public class CreateCourtRequest
{
    [Required]
    public int FacilityId { get; set; }

    [Required]
    public int SportId { get; set; }

    [Required]
    [MaxLength(50)]
    public string CourtName { get; set; } = null!;
}
