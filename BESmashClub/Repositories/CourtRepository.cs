using Entites.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Context;

namespace Repositories;

public class CourtRepository : GenericRepository<Court>
{
    public CourtRepository(SmashClubContext context) : base(context) { }

    public async Task<List<Court>> GetByFacilityIdAsync(int facilityId)
    {
        return await _context.Courts
            .Include(c => c.Facility)
            .Include(c => c.Sport)
            .Include(c => c.Status)
            .Where(c => c.FacilityId == facilityId)
            .ToListAsync();
    }

    public async Task<Court?> GetDetailAsync(int courtId)
    {
        return await _context.Courts
            .Include(c => c.Facility)
            .Include(c => c.Sport)
            .Include(c => c.Status)
            .Include(c => c.CourtCosts)
            .FirstOrDefaultAsync(c => c.CourtId == courtId);
    }
}
