namespace Entites.DTOs.Courts;

public class CourtResponse
{
    public int CourtId { get; set; }
    public int FacilityId { get; set; }
    public string? FacilityName { get; set; }
    public int SportId { get; set; }
    public string? SportName { get; set; }
    public string? CourtName { get; set; }
    public int StatusId { get; set; }
    public string? StatusName { get; set; }
    public bool IsActive { get; set; }
}
